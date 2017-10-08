import { h } from "./h"

var callbackStack = []

export function app(props) {
  if (typeof props === "function") {
    return props(app)
  }

  var skipRender
  var appView = props.view
  var appState = {}
  var appActions = {}
  var appRoot = props.root || document.body
  var element = appRoot.children[0]
  var node = hydrate(element, [].map)

  requestRender(flush(setup(props, appState, appActions)))

  return appActions

  function requestRender() {
    if (appView && !skipRender) {
      requestAnimationFrame(render, (skipRender = !skipRender))
    }
  }

  function render() {
    flush(
      (element = patch(
        appRoot,
        element,
        node,
        (node = appView(appState, appActions)),
        (skipRender = !skipRender)
      ))
    )
  }

  function flush(cb) {
    while ((cb = callbackStack.pop())) cb()
  }

  function setup(module, state, actions) {
    copy(state, module.state)

    setupActions(actions, state, module.actions)

    if (module.init) {
      callbackStack.push(function() {
        module.init(state, actions)
      })
    }

    if (module.modules) {
      Object.keys(module.modules).map(function(key) {
        setup(module.modules[key], (state[key] = {}), (actions[key] = {}))
      })
    }
  }

  function setupActions(actions, withState, withActions) {
    Object.keys(withActions || {}).map(function(name) {
      if (typeof withActions[name] === "function") {
        actions[name] = function(data) {
          return typeof (data = withActions[name](withState, actions, data)) ===
          "function"
            ? data(update)
            : update(data)
        }
      } else {
        setupActions(
          (actions[name] = {}),
          withState[name] || (withState[name] = {}),
          withActions[name]
        )
      }
    })

    function update(data) {
      return (
        typeof data === "function"
          ? update(data(withState))
          : data && requestRender(copy(withState, data)),
        withState
      )
    }
  }

  function copy(target, source) {
    for (var i in source) {
      target[i] = source[i]
    }
    return target
  }

  function merge(target, source, result) {
    return copy(copy((result = {}), target), source)
  }

  function hydrate(element, map) {
    return (
      element &&
      h(
        element.tagName.toLowerCase(),
        {},
        map.call(element.childNodes, function(element) {
          return element.nodeType === 3
            ? element.nodeValue
            : hydrate(element, map)
        })
      )
    )
  }

  function createElement(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node)
    } else {
      var element = (isSVG = isSVG || node.tag === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
        : document.createElement(node.tag)

      if (node.props && node.props.oncreate) {
        callbackStack.push(function() {
          node.props.oncreate(element)
        })
      }

      for (var i = 0; i < node.children.length; ) {
        element.appendChild(createElement(node.children[i++], isSVG))
      }

      for (var i in node.props) {
        setProp(element, i, node.props[i])
      }
    }
    return element
  }

  function setProp(element, name, value, oldValue) {
    if (name === "key") {
    } else if (name === "style") {
      for (var name in merge(oldValue, (value = value || {}))) {
        element.style[name] = value[name] || ""
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

  function updateElement(element, oldProps, props) {
    for (var name in merge(oldProps, props)) {
      var value = props[name]
      var oldValue =
        name === "value" || name === "checked" ? element[name] : oldProps[name]

      if (value !== oldValue) {
        setProp(element, name, value, oldValue)
      }
    }

    if (props && props.onupdate) {
      callbackStack.push(function() {
        props.onupdate(element, oldProps)
      })
    }
  }

  function removeElement(parent, element, props) {
    if (
      props &&
      props.onremove &&
      typeof (props = props.onremove(element)) === "function"
    ) {
      props(remove)
    } else {
      remove()
    }

    function remove() {
      parent.removeChild(element)
    }
  }

  function getKey(node) {
    if (node && node.props) {
      return node.props.key
    }
  }

  function patch(parent, element, oldNode, node, isSVG, nextSibling) {
    if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element)
    } else if (node.tag != null && node.tag === oldNode.tag) {
      updateElement(element, oldNode.props, node.props)

      isSVG = isSVG || node.tag === "svg"

      var len = node.children.length
      var oldLen = oldNode.children.length
      var oldKeyed = {}
      var oldElements = []
      var keyed = {}

      for (var i = 0; i < oldLen; i++) {
        var oldElement = (oldElements[i] = element.childNodes[i])
        var oldChild = oldNode.children[i]
        var oldKey = getKey(oldChild)

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElement, oldChild]
        }
      }

      var i = 0
      var j = 0

      while (j < len) {
        var oldElement = oldElements[i]
        var oldChild = oldNode.children[i]
        var newChild = node.children[j]

        var oldKey = getKey(oldChild)
        if (keyed[oldKey]) {
          i++
          continue
        }

        var newKey = getKey(newChild)

        var keyedNode = oldKeyed[newKey] || []

        if (null == newKey) {
          if (null == oldKey) {
            patch(element, oldElement, oldChild, newChild, isSVG)
            j++
          }
          i++
        } else {
          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], newChild, isSVG)
            i++
          } else if (keyedNode[0]) {
            element.insertBefore(keyedNode[0], oldElement)
            patch(element, keyedNode[0], keyedNode[1], newChild, isSVG)
          } else {
            patch(element, oldElement, null, newChild, isSVG)
          }

          j++
          keyed[newKey] = newChild
        }
      }

      while (i < oldLen) {
        var oldChild = oldNode.children[i]
        var oldKey = getKey(oldChild)
        if (null == oldKey) {
          removeElement(element, oldElements[i], oldChild.props)
        }
        i++
      }

      for (var i in oldKeyed) {
        var keyedNode = oldKeyed[i]
        var reusableNode = keyedNode[1]
        if (!keyed[reusableNode.props.key]) {
          removeElement(element, keyedNode[0], reusableNode.props)
        }
      }
    } else if (element && node !== element.nodeValue) {
      if (typeof node === "string" && typeof oldNode === "string") {
        element.nodeValue = node
      } else {
        element = parent.insertBefore(
          createElement(node, isSVG),
          (nextSibling = element)
        )
        removeElement(parent, nextSibling, oldNode.props)
      }
    }
    return element
  }
}
