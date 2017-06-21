var R = require('ramda')

var AT = '@'



export default function (outerEvents) {
  return function (app) {
    var state = {}
    var view = app.view
    var actions = {}
    var events = {}
    var templates = {}
    var node
    var element

    outerEvents.set("child", ({ component, props, children }) => {
      var partialState
      var partialActions

      if (state[AT + component.name]) {

        partialState = state[AT + component.name][props.id] || getState(component, props.initial)
        state[AT + component.name][props.id] = partialState
        partialActions = appendActions(actions[AT + component.name], props.id)

      } else {

        state[AT + component.name] = { [props.id]: getState(component, props.initial) }
        templates[component.name] = component.view
        init(actions, { [AT + component.name]: component.actions }, false, component.name)
        partialState = getState(component, props.initial)
        partialActions = appendActions(actions[AT + component.name], props.id)

      }

      return templates[component.name](partialState, partialActions, props, children)
    })

    for (var i = -1, mixins = app.mixins || []; i < mixins.length; i++) {
      var mixin = mixins[i] ? mixins[i](app) : app

      if (mixin.mixins != null && mixin !== app) {
        mixins = mixins.concat(mixin.mixins)
      }

      if (mixin.state != null) {
        state = merge(state, mixin.state)
      }

      init(actions, mixin.actions)

      Object.keys(mixin.events || []).map(function (key) {
        events[key] = (events[key] || []).concat(mixin.events[key])
      })
    }



    if (document.readyState[0] !== "l") {
      load()
    } else {
      addEventListener("DOMContentLoaded", load)
    }

    function setAction(action, component) {
      function append(action) {
        return function fn(data) {
          var result = action(
            state,
            actions,
            emit("action", {
              name: name,
              data: data
            }).data,
            emit
          )

          if (result == null || typeof result.then === "function") {
            return result
          }

          render((state = merge(state, emit("update", result))), view)
        }
      }
      if (component) {
        return function (id) {
          return append(action(id))
        }
      } else {
        return append(action)
      }
    }

    function init(namespace, children, lastName, component) {
      Object.keys(children || []).map(function (key) {
        var action = children[key]
        var name = lastName ? lastName + "." + key : key

        if (typeof action === "function") {
          if (component) { // TODO: shorten
            const connectedAction = connectAction(component, action)
            namespace[key] = setAction(connectedAction, true)
          } else {
            namespace[key] = setAction(action, false)
          }
        } else {
          init(namespace[key] || (namespace[key] = {}), action, name, component)
        }
      })
    }

    function load() {
      render(state, view)
      emit("loaded")
    }

    function emit(name, data) {
      ; (events[name] || []).map(function (cb) {
        var result = cb(state, actions, data, emit)
        if (result != null) {
          data = result
        }
      })

      return data
    }

    function render(state, view) {
      element = patch(
        app.root || (app.root = document.body),
        element,
        node,
        (node = emit("render", view)(state, actions))
      )
    }

    function merge(a, b) {
      var obj = {}

      if (typeof b !== "object" || Array.isArray(b)) {
        return b
      }

      for (var i in a) {
        obj[i] = a[i]
      }
      for (var i in b) {
        obj[i] = b[i]
      }

      return obj
    }



    function createElementFrom(node, isSVG) {
      if (typeof node === "string") {
        var element = document.createTextNode(node)
      } else {
        var element = (isSVG = isSVG || node.tag === "svg")
          ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
          : document.createElement(node.tag)

        for (var i = 0; i < node.children.length;) {
          element.appendChild(createElementFrom(node.children[i++], isSVG))
        }

        for (var i in node.data) {
          if (i === "oncreate") {
            node.data[i](element)
          } else {
            setElementData(element, i, node.data[i])
          }
        }
      }

      return element
    }

    function setElementData(element, name, value, oldValue) {
      if (name === "key") {
      } else if (name === "style") {
        for (var i in merge(oldValue, (value = value || {}))) {
          element.style[i] = value[i] || ""
        }
      } else {
        try {
          element[name] = value
        } catch (_) { }

        if (typeof value !== "function") {
          if (value) {
            element.setAttribute(name, value)
          } else {
            element.removeAttribute(name)
          }
        }
      }
    }

    function updateElementData(element, oldData, data) {
      for (var name in merge(oldData, data)) {
        var value = data[name]
        var oldValue = name === "value" || name === "checked"
          ? element[name]
          : oldData[name]

        if (name === "onupdate" && value) {
          value(element)
        } else if (value !== oldValue) {
          setElementData(element, name, value, oldValue)
        }
      }
    }

    function getKeyFrom(node) {
      if (node && (node = node.data)) {
        return node.key
      }
    }

    function removeElement(parent, element, node) {
      ; ((node.data && node.data.onremove) || removeChild)(element, removeChild)
      function removeChild() {
        parent.removeChild(element)
      }
    }

    function patch(parent, element, oldNode, node) {
      if (oldNode == null) {
        element = parent.insertBefore(createElementFrom(node), element)
      } else if (node.tag && node.tag === oldNode.tag) {
        updateElementData(element, oldNode.data, node.data)

        var len = node.children.length
        var oldLen = oldNode.children.length
        var reusableChildren = {}
        var oldElements = []
        var newKeys = {}

        for (var i = 0; i < oldLen; i++) {
          var oldElement = element.childNodes[i]
          oldElements[i] = oldElement

          var oldChild = oldNode.children[i]
          var oldKey = getKeyFrom(oldChild)

          if (null != oldKey) {
            reusableChildren[oldKey] = [oldElement, oldChild]
          }
        }

        var i = 0
        var j = 0

        while (j < len) {
          var oldElement = oldElements[i]
          var oldChild = oldNode.children[i]
          var newChild = node.children[j]

          var oldKey = getKeyFrom(oldChild)
          if (newKeys[oldKey]) {
            i++
            continue
          }

          var newKey = getKeyFrom(newChild)

          var reusableChild = reusableChildren[newKey] || []

          if (null == newKey) {
            if (null == oldKey) {
              patch(element, oldElement, oldChild, newChild)
              j++
            }
            i++
          } else {
            if (oldKey === newKey) {
              patch(element, reusableChild[0], reusableChild[1], newChild)
              i++
            } else if (reusableChild[0]) {
              element.insertBefore(reusableChild[0], oldElement)
              patch(element, reusableChild[0], reusableChild[1], newChild)
            } else {
              patch(element, oldElement, null, newChild)
            }

            j++
            newKeys[newKey] = newChild
          }
        }

        while (i < oldLen) {
          var oldChild = oldNode.children[i]
          var oldKey = getKeyFrom(oldChild)
          if (null == oldKey) {
            removeElement(element, oldElements[i], oldChild)
          }
          i++
        }

        for (var i in reusableChildren) {
          var reusableChild = reusableChildren[i]
          var reusableNode = reusableChild[1]
          if (!newKeys[reusableNode.data.key]) {
            removeElement(element, reusableChild[0], reusableNode)
          }
        }
      } else if (node !== oldNode) {
        var i = element
        parent.replaceChild((element = createElementFrom(node)), i)
      }

      return element
    }


    function connectAction(component, action) {
      return function (id) {
        return function (state, actions, data, emit) { // this is the most important function for fractal app!
          var path = R.lensPath([AT + component, id])
          var partialState = R.view(path, state)
          var partialActions = actions[AT + component]
          return R.set(
            path,
            R.merge(partialState, action(partialState, partialActions, data, emit)),
            state
          )
        }
      }
    }

    function appendActions(actions, id) {
      return Object.keys(actions)
        .reduce((partials, key) => merge(partials, {
          [key]: actions[key](id)
        }), {})
    }

    function getState(component, initial) {
      return typeof component.state === "function" ? component.state(initial) : component.state
    }
  }
}
