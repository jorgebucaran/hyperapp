export function app(app) {
  var state = {}
  var actions = {}
  var events = {}
  var mixins = []
  var view = app.view
  var root = app.root || document.body
  var node
  var element
  var locked = false
  var loaded = false

  for (var i = -1; i < mixins.length; i++) {
    var mixin = mixins[i] ? mixins[i](emit) : app

    Object.keys(mixin.events || []).map(function(key) {
      events[key] = (events[key] || []).concat(mixin.events[key])
    })

    if (mixin.state != null) {
      state = merge(state, mixin.state)
    }

    mixins = mixins.concat(mixin.mixins || [])

    initialize(actions, mixin.actions)
  }

  node = hydrate((element = root.querySelector("[data-ssr]")), [].map)

  repaint(emit("init"))

  return emit

  function repaint() {
    if (!locked) {
      requestAnimationFrame(render, (locked = !locked))
    }
  }

  function hydrate(element, map) {
    return element == null
      ? element
      : {
          tag: element.tagName,
          data: {},
          children: map.call(element.childNodes, function(element) {
            hydrate(element, map)
          })
        }
  }

  function render() {
    element = patch(
      root,
      element,
      node,
      (node = emit("render", view)(state, actions))
    )

    locked = !locked

    if (!loaded) {
      emit("loaded", (loaded = true))
    }
  }

  function initialize(namespace, children, lastName) {
    Object.keys(children || []).map(function(key) {
      var action = children[key]
      var name = lastName ? lastName + "." + key : key

      if (typeof action === "function") {
        namespace[key] = function(data) {
          var result = action(
            state,
            actions,
            emit("action", {
              name: name,
              data: data
            }).data
          )

          if (result != null && result.then == null) {
            repaint((state = merge(state, emit("update", result))))
          }

          return result
        }
      } else {
        initialize(namespace[key] || (namespace[key] = {}), action, name)
      }
    })
  }

  function emit(name, data) {
    ;(events[name] || []).map(function(cb) {
      var result = cb(state, actions, data)
      if (result != null) {
        data = result
      }
    })

    return data
  }

  function merge(a, b) {
    if (typeof b !== "object") {
      return b
    }

    var obj = {}

    for (var i in a) {
      obj[i] = a[i]
    }

    for (var i in b) {
      obj[i] = b[i]
    }

    return obj
  }

  function createElement(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node)
    } else {
      var element = (isSVG = isSVG || node.tag === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
        : document.createElement(node.tag)

      for (var i = 0; i < node.children.length; ) {
        element.appendChild(createElement(node.children[i++], isSVG))
      }

      for (var i in node.data) {
        if (i === "oncreate") {
          node.data[i](element)
        } else if (i === "oninsert") {
          setTimeout(node.data[i], 0, element)
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
      } catch (_) {}

      if (typeof value !== "function") {
        if (value) {
          element.setAttribute(name, value)
        } else {
          element.removeAttribute(name)
        }
      }
    }
  }

  function updateElementData(element, oldData, data, cb) {
    for (var name in merge(oldData, data)) {
      var value = data[name]
      var oldValue =
        name === "value" || name === "checked" ? element[name] : oldData[name]

      if (value !== oldValue && name !== "onupdate") {
        setElementData(element, name, value, oldValue)
        cb = data.onupdate
      }
    }

    if (cb != null) {
      cb(element)
    }
  }

  function getKey(node) {
    if (node && (node = node.data)) {
      return node.key
    }
  }

  function removeElement(parent, element, node) {
    ;((node.data && node.data.onremove) || removeChild)(element, removeChild)
    function removeChild() {
      parent.removeChild(element)
    }
  }

  function patch(parent, element, oldNode, node) {
    if (oldNode == null) {
      element = parent.insertBefore(createElement(node), element)
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
        var oldKey = getKey(oldChild)

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

        var oldKey = getKey(oldChild)
        if (newKeys[oldKey]) {
          i++
          continue
        }

        var newKey = getKey(newChild)

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
        var oldKey = getKey(oldChild)
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
      parent.replaceChild((element = createElement(node)), i)
    }

    return element
  }
}
