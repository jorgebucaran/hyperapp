var SVG_NS = "http://www.w3.org/2000/svg"

export default function (app) {

  var view = app.view || function () {
    return ""
  }

  var model
  var actions = {}
  var subscriptions = []
  var hooks = {
    onError: [],
    onAction: [],
    onUpdate: [],
    onRender: []
  }

  var node
  var element
  var root
  var batch = []
  var plugins = app.plugins || []

  for (var i = -1; i < plugins.length; i++) {
    var plugin = i < 0 ? app : plugins[i](app)
    var obj = plugin.model

    if (obj != null) {
      model = merge(model, obj)
    }

    if (obj = plugin.actions) {
      init(actions, obj)
    }

    if (obj = plugin.subscriptions) {
      subscriptions = subscriptions.concat(obj)
    }

    if (obj = plugin.hooks) {
      Object.keys(obj).forEach(function (key) {
        hooks[key].push(obj[key])
      })
    }
  }

  load(function () {
    root = app.root || document.body

    render(model, view)

    for (var i = 0; i < subscriptions.length; i++) {
      subscriptions[i](model, actions, onError)
    }
  })

  function onError(error) {
    for (var i = 0; i < hooks.onError.length; i++) {
      hooks.onError[i](error)
    }

    if (i <= 0) {
      throw error
    }
  }

  function init(container, group, lastName) {
    Object.keys(group).forEach(function (key) {
      if (!container[key]) {
        container[key] = {}
      }

      var name = lastName ? lastName + "." + key : key
      var action = group[key]

      if (typeof action === "function") {
        container[key] = function (data) {
          for (var i = 0; i < hooks.onAction.length; i++) {
            hooks.onAction[i](name, data)
          }

          var result = action(model, data, actions, onError)

          if (result == null || typeof result.then === "function") {
            return result

          } else {
            for (var i = 0; i < hooks.onUpdate.length; i++) {
              hooks.onUpdate[i](model, result, data)
            }

            model = merge(model, result)
            render(model, view)
          }
        }
      } else {
        init(container[key], action, name)
      }
    })
  }

  function load(fn) {
    if (document.readyState[0] !== "l") {
      fn()
    } else {
      document.addEventListener("DOMContentLoaded", fn)
    }
  }


  function render(model, view) {
    for (var i = 0; i < hooks.onRender.length; i++) {
      view = hooks.onRender[i](model, view)
    }

    element = patch(root, element, node, node = view(model, actions))

    for (var i = 0; i < batch.length; i++) {
      batch[i]()
    }

    batch = []
  }

  function merge(a, b) {
    var obj = {}

    if (typeof b !== "object" || Array.isArray(b)) {
      return b
    }

    for (var key in a) {
      obj[key] = a[key]
    }
    for (var key in b) {
      obj[key] = b[key]
    }

    return obj
  }

  function createElementFrom(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node)

    } else {
      var element = (isSVG = isSVG || node.tag === "svg")
        ? document.createElementNS(SVG_NS, node.tag)
        : document.createElement(node.tag)

      for (var name in node.data) {
        if (name !== "onCreate") {
          setElementData(element, name, node.data[name])
        }
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElementFrom(node.children[i], isSVG))
      }

      // call onCreate handler *after* child nodes are added,
      // so they'll be available to the handler for manipulation
      if (node.data.onCreate) node.data.onCreate(element)
    }

    return element
  }

  function setElementData(element, name, value, oldValue) {
    name = name.toLowerCase()
    if (name === "key") {}
    else if (!value) {
      element[name] = value
      element.removeAttribute(name)

    } else if (name === "style") {
      for (var i in oldValue) {
        if (!(i in value)) {
          element.style[i] = ""
        }
      }

      for (var i in value) {
        element.style[i] = value[i]
      }
    } else {
      element.setAttribute(name, value)

      if (element.namespaceURI !== SVG_NS) {
        if (element.type === "text") {
          var oldSelStart = element.selectionStart
          var oldSelEnd = element.selectionEnd
        }

        element[name] = value

        if (oldSelStart >= 0) {
          element.setSelectionRange(oldSelStart, oldSelEnd)
        }
      }
    }
  }

  function updateElementData(element, data, oldData) {
    for (var name in merge(oldData, data)) {
      var value = data[name]
      var oldValue = oldData[name]
      var realValue = element[name]

      if (name === "onUpdate") {
        value(element)

      } else if (value !== oldValue || realValue !== value) {
        setElementData(element, name, value, oldValue)
      }
    }
  }

  function batchRemove (parent, element, node) {
    batch.push(function () {
      if (node.data && node.data.onRemove) node.data.onRemove(element)
      parent.removeChild(element)
    })
  }

  function patch (parent, element, oldNode, newNode) {
    if (oldNode == null) {
      var n = createElementFrom(newNode)
      parent.insertBefore(n, element)
      element = n

    } else if (
      newNode.tag !== oldNode.tag ||
      typeof newNode !== typeof oldNode ||
      typeof newNode === "string" && newNode !== oldNode
    ) {
      var n = createElementFrom(newNode)
      parent.replaceChild(n, element)
      element = n

    } else if (oldNode.tag){
      updateElementData(element, newNode.data, oldNode.data)
      patchChildren(element, oldNode, newNode)
    }

    return element
  }

  function patchChildren(element, oldNode, newNode) {
    // We need to index all keyed nodes in oldChildren in order to
    // distinguish new keyed nodes from nodes to reuse in newChildren
    var oldLen = oldNode.children.length
    var newLen = newNode.children.length
    var oldChildren = []
    var oldKeys = {}

    for (var i = 0; i < oldLen; i++) {
      if (oldNode.children[i].data && oldNode.children[i].data.key) {
        oldKeys[oldNode.children[i].data.key] = true;
      }
      oldChildren[i] = [element.childNodes[i], oldNode.children[i]]
    }

    var newIndex = 0
    var oldIndex = 0
    var cache = {}

    while (newIndex < newLen || oldIndex < oldLen) {
      var newChild = newNode.children[newIndex]
      var oldChildElem = oldChildren[oldIndex][0]
      var oldChild = oldChildren[oldIndex][1]
      var newKey = newChild && (newChild.data != null) && oldKeys[newChild.data.key] ? newChild.data.key : null
      var oldKey = (oldChild && (oldChild.data != null) && oldChild.data.key) || null


      if (
        newChild != null &&
        newKey != null &&
        cache[newKey]
      ) {
        var i = cache[newKey]
        element.insertBefore(i[0], oldChildElem)
        patch(element, i[0], i[1], newChild)
        delete cache[newKey]
        newIndex++

      } else if (
        oldChild == null ||
        (oldKey != null && newKey == null)
      ) {
        patch(element, oldChildElem, null, newChild)
        newIndex++

      } else if (
        newChild == null ||
        (oldKey == null && newKey != null)
      ) {
        batchRemove(element, oldChildElem, oldChild)
        oldIndex++

      } else if (oldKey == newKey) {
        patch(element, oldChildElem, oldChild, newChild)
        oldIndex++
        newIndex++

      } else {
        cache[oldKey] = oldChildren[oldIndex]
        oldIndex++

      }
    }

    for (var key in cache) {
      batchRemove(element, cache[key][0], cache[key][1])
    }
  }
}
