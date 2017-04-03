var SVG_NS = "http://www.w3.org/2000/svg"

export default function (app) {
  var view = app.view || function () {
    return ""
  }

  var model
  var actions = {}
  var hooks = {
    onError: [],
    onAction: [],
    onUpdate: [],
    onRender: []
  }
  var subscriptions = []

  var node
  var root
  var element
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
      Object.keys(obj).map(function (key) {
        hooks[key].push(obj[key])
      })
    }
  }

  load(function () {
    root = app.root || document.body

    render(model, view)

    subscriptions.map(function (cb) {
      cb(model, actions, error)
    })
  })

  function error(error) {
    if (hooks.onError.length === 0) {
      throw error
    }

    hooks.onError.map(function (cb) {
      cb(error)
    })
  }

  function init(container, group, lastName) {
    Object.keys(group).map(function (key) {
      var name = lastName ? lastName + "." + key : key
      var action = group[key]

      if (typeof action === "function") {
        container[key] = function (data) {
          hooks.onAction.map(function (cb) {
            cb(name, data)
          })

          var result = action(model, data, actions, error)

          if (result == null || typeof result.then === "function") {
            return result

          } else {
            hooks.onUpdate.map(function (cb) {
              cb(model, result, data)
            })

            model = merge(model, result)
            render(model, view)
          }
        }
      } else {
        init(container[key]
          ? container[key]
          : container[key] = {}, action, name)
      }
    })
  }

  function load(cb) {
    if (document.readyState[0] !== "l") {
      cb()
    } else {
      document.addEventListener("DOMContentLoaded", cb)
    }
  }

  function render(model, view) {
    hooks.onRender.map(function (cb) {
      view = cb(model, view)
    })

    element = patch(root, element, node, node = view(model, actions))
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
        ? document.createElementNS(SVG_NS, node.tag)
        : document.createElement(node.tag)

      for (var name in node.data) {
        if (name === "onCreate") {
          node.data[name](element)
        } else {
          setElementData(element, name, node.data[name])
        }
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElementFrom(node.children[i], isSVG))
      }
    }

    return element
  }

  function setElementData(element, name, value, oldValue) {
    name = name.toLowerCase()

    if (name === "key") {
    } else if (!value) {
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
      if (typeof value !== "function") {
        element.setAttribute(name, value)
      }

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

  function updateElementData(element, oldData, data) {
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

  function getKeyFrom(node) {
    if (node && (node = node.data)) {
      return node.key
    }
  }

  function removeElement(parent, element, node) {
    if (node.data.onRemove) {
      node.data.onRemove(element)
    }
    parent.removeChild(element)
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

        var reusableChild = reusableChildren[newKey]
        var reusableElement = 0
        var reusableNode = 0

        if (reusableChild) {
          reusableElement = reusableChild[0]
          reusableNode = reusableChild[1]
        }

        if (null == oldKey && null == newKey) {
          patch(element, oldElement, oldChild, newChild)
          j++
          i++

        } else if (null == oldKey && null != newKey) {
          if (reusableElement) {
            element.insertBefore(reusableElement, oldElement)
            patch(element, reusableElement, reusableNode, newChild)
          } else {
            patch(element, oldElement, null, newChild)
          }

          j++
          newKeys[newKey] = newChild

        } else if (null != oldKey && null == newKey) {
          i++

        } else {
          if (oldKey === newKey) {
            patch(element, reusableElement, reusableNode, newChild)
            i++

          } else if (reusableElement) {
            element.insertBefore(reusableElement, oldElement)
            patch(element, reusableElement, reusableNode, newChild)

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
      parent.replaceChild(element = createElementFrom(node), i)
    }

    return element
  }
}
