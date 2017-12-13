export function h(type, props) {
  var node
  var stack = []
  var children = []

  for (var i = arguments.length; i-- > 2; ) {
    stack.push(arguments[i])
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (i = node.length; i--; ) {
        stack.push(node[i])
      }
    } else if (null == node || true === node || false === node) {
    } else {
      children.push(typeof node === "number" ? node + "" : node)
    }
  }

  return typeof type === "string"
    ? {
        type: type,
        props: props || {},
        children: children
      }
    : type(props || {}, children)
}

export function app(model, view, container) {
  var lock
  var root = (container = container || document.body).children[0]
  var node = vnode(root, [].map)
  var lifecycle = []
  var appState = model.state || {}
  var appActions = {}

  repaint(init(appState, appActions, model.actions, []))

  return appActions

  function vnode(element, map) {
    return (
      element &&
      h(
        element.tagName.toLowerCase(),
        {},
        map.call(element.childNodes, function(element) {
          return element.nodeType === 3
            ? element.nodeValue
            : vnode(element, map)
        })
      )
    )
  }

  function set(to, from) {
    for (var i in from) {
      to[i] = from[i]
    }
    return to
  }

  function merge(to, from) {
    return set(set({}, to), from)
  }

  function setDeep(path, value, from) {
    var to = {}
    return 0 === path.length
      ? value
      : ((to[path[0]] =
          1 < path.length
            ? setDeep(path.slice(1), value, from[path[0]])
            : value),
        merge(from, to))
  }

  function get(path, from) {
    for (var i = 0; i < path.length; i++) {
      from = from[path[i]]
    }
    return from
  }

  function isFunction(any) {
    return "function" === typeof any
  }

  function init(state, actions, from, path) {
    for (var key in from) {
      isFunction(from[key])
        ? (function(key, action) {
            actions[key] = function(data) {
              state = get(path, appState)

              if (
                isFunction((data = action(data))) &&
                isFunction((data = data(state)))
              ) {
                data = data(actions)
              }

              if (data && data !== state && !data.then) {
                repaint(
                  (appState = setDeep(path, merge(state, data), appState))
                )
              }

              return data
            }
          })(key, from[key])
        : init(
            state[key] || (state[key] = {}),
            (actions[key] = {}),
            from[key],
            path.concat(key)
          )
    }
  }

  function getKey(node) {
    if (node && node.props) {
      return node.props.key
    }
  }

  function setElementProp(element, name, value, oldValue) {
    if (name === "key") {
    } else if (name === "style") {
      for (var i in merge(oldValue, (value = value || {}))) {
        element.style[i] = null == value[i] ? "" : value[i]
      }
    } else {
      try {
        element[name] = null == value ? "" : value
      } catch (_) {}

      if (!isFunction(value)) {
        if (null == value || false === value) {
          element.removeAttribute(name)
        } else {
          element.setAttribute(name, value)
        }
      }
    }
  }

  function createElement(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node)
    } else {
      var element = (isSVG = isSVG || node.type === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.type)
        : document.createElement(node.type)

      if (node.props.oncreate) {
        lifecycle.push(function() {
          node.props.oncreate(element)
        })
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i], isSVG))
      }

      for (var i in node.props) {
        setElementProp(element, i, node.props[i])
      }
    }
    return element
  }

  function updateElement(element, oldProps, props) {
    for (var i in merge(oldProps, props)) {
      var value = props[i]
      var oldValue = i === "value" || i === "checked" ? element[i] : oldProps[i]

      if (value !== oldValue) {
        setElementProp(element, i, value, oldValue)
      }
    }

    if (props.onupdate) {
      lifecycle.push(function() {
        props.onupdate(element, oldProps)
      })
    }
  }

  function destroyNode(element, node) {
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        if (typeof node.children[i] !== "string") {
          destroyNode(element.childNodes[i], node.children[i])
        }
      }
    }
    if (node.props && node.props.ondestroy) {
      node.props.ondestroy(element)
    }
  }

  function removeElement(parent, element, node) {
    function done() {
      destroyNode(element, node)
      parent.removeChild(element)
    }

    if (node.props && node.props.onremove) {
      node.props.onremove(element, done)
    } else {
      done()
    }
  }

  function patch(parent, element, oldNode, node, isSVG, nextSibling) {
    if (oldNode === node) {
    } else if (null == oldNode) {
      element = parent.insertBefore(createElement(node, isSVG), element)
    } else if (node.type != null && node.type === oldNode.type) {
      updateElement(element, oldNode.props, node.props)

      isSVG = isSVG || node.type === "svg"

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
          removeElement(element, oldElements[i], oldChild)
        }
        i++
      }

      for (var i in oldKeyed) {
        var keyedNode = oldKeyed[i]
        var reusableNode = keyedNode[1]
        if (!keyed[reusableNode.props.key]) {
          removeElement(element, keyedNode[0], reusableNode)
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
        removeElement(parent, nextSibling, oldNode)
      }
    }

    return element
  }

  function render(next) {
    lock = !lock

    if (isFunction((next = view(appState)))) {
      next = next(appActions)
    }

    if (!lock) {
      root = patch(container, root, node, (node = next))
    }

    while ((next = lifecycle.pop())) next()
  }

  function repaint() {
    if (view && !lock) {
      setTimeout(render, (lock = !lock))
    }
  }
}
