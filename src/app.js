var globalInvokeLaterStack = []

export function app(props, oldNode) {
  if (typeof props === "function") {
    return props(app)
  }

  var appActions = {}
  var appState = props.state
  var appView = props.view
  var appSubs = props.subscriptions || []
  var appRoot = props.root || document.body
  var element = appRoot.children[0]
  var beforeActionHooks = []
  var renderLock

  initialize(appActions, props.actions, [])

  appSubs.map(function(sub) {
    if (typeof (sub = sub(appState, appActions)) === "function") {
      beforeActionHooks.push(sub)
    }
  })

  requestRender()

  return appActions

  function initialize(actions, withActions, lastPath) {
    Object.keys(withActions || {}).map(function(key) {
      var action = withActions[key]
      var path = lastPath.concat(key)

      if (typeof action === "function") {
        actions[key] = function(data) {
          var afterActionHooks = []

          beforeActionHooks.map(function(cb) {
            if (
              typeof (cb = cb({ name: path.join("."), data: data })) ===
              "function"
            ) {
              afterActionHooks.push(cb)
            }
          })

          var result = action(
            getPath(lastPath, appState),
            getPath(lastPath, appActions),
            data
          )

          afterActionHooks.map(function(cb) {
            result = cb(result)
          })

          return typeof result === "function"
            ? result(function(withState) {
                return update(lastPath, withState)
              })
            : update(lastPath, result)
        }
      } else {
        initialize(actions[key] || (actions[key] = {}), action, path)
      }
    })
  }

  function update(path, withState) {
    var partialState = getPath(path, appState)

    if (typeof withState === "function") {
      return update(path, withState(partialState))
    }
    if (
      withState &&
      (withState = setPath(path, merge(partialState, withState), appState))
    ) {
      requestRender((appState = withState))
    }
    return appState
  }

  function getPath(path, source) {
    return path.length === 0 ? source : getPath(path.slice(1), source[path[0]])
  }

  function setPath(path, value, source) {
    var name = path[0]
    return path.length === 0
      ? value
      : setProp(
          name,
          path.length > 1
            ? setPath(
                path.slice(1),
                value,
                source != null && name in source
                  ? source[name]
                  : path[1] >= 0 ? [] : {}
              )
            : value,
          source
        )
  }

  function setProp(prop, value, source) {
    var target = merge(source)
    target[prop] = value
    return target
  }

  function render(cb) {
    element = patch(
      appRoot,
      element,
      oldNode,
      (oldNode = appView(appState, appActions)),
      (renderLock = !renderLock)
    )
    while ((cb = globalInvokeLaterStack.pop())) cb()
  }

  function requestRender() {
    if (appView && !renderLock) {
      requestAnimationFrame(render, (renderLock = !renderLock))
    }
  }

  function merge(a, b) {
    var obj = {}

    for (var i in a) {
      obj[i] = a[i]
    }

    for (var i in b) {
      obj[i] = b[i]
    }

    return obj
  }

  function getKey(node) {
    if (node && (node = node.props)) {
      return node.key
    }
  }

  function createElement(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node)
    } else {
      var element = (isSVG = isSVG || node.tag === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
        : document.createElement(node.tag)

      if (node.props && node.props.oncreate) {
        globalInvokeLaterStack.push(function() {
          node.props.oncreate(element)
        })
      }

      for (var i = 0; i < node.children.length; ) {
        element.appendChild(createElement(node.children[i++], isSVG))
      }

      for (var i in node.props) {
        setData(element, i, node.props[i])
      }
    }

    return element
  }

  function setData(element, name, value, oldValue) {
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

  function updateElement(element, oldData, data) {
    for (var i in merge(oldData, data)) {
      var value = data[i]
      var oldValue = i === "value" || i === "checked" ? element[i] : oldData[i]

      if (value !== oldValue) {
        setData(element, i, value, oldValue)
      }
    }

    if (data && data.onupdate) {
      globalInvokeLaterStack.push(function() {
        data.onupdate(element, oldData)
      })
    }
  }

  function removeElement(parent, element, data) {
    if (data && data.onremove) {
      data.onremove(element)
    } else {
      parent.removeChild(element)
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
