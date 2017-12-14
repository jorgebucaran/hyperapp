export function h(tag, props) {
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

  return typeof tag === "string"
    ? {
        tag: tag,
        props: props || {},
        children: children
      }
    : tag(props || {}, children)
}

export function app(model, view, container) {
  function vnode(element, map) {
    return (
      element && {
        tag: element.tagName.toLowerCase(),
        props: {},
        children: map.call(element.childNodes, function(element) {
          return element.nodeType === 3
            ? element.nodeValue
            : vnode(element, map)
        })
      }
    )
  }

  function render(next) {
    lock = !lock
    next = view(store)

    if (container && !lock) {
      root = patch(container, root, node, (node = next))
    }

    while ((next = stack.pop())) next()
  }

  function repaint() {
    if (view && !lock) {
      setTimeout(render, (lock = !lock))
    }
  }

  function assign(target, source) {
    var result = {}

    for (var i in target) {
      result[i] = target[i]
    }

    for (var i in source) {
      result[i] = source[i]
    }

    return result
  }

  function setDeep(path, value, source) {
    var target = {}
    return 0 === path.length
      ? value
      : ((target[path[0]] =
          1 < path.length
            ? setDeep(path.slice(1), value, source[path[0]])
            : value),
        assign(source, target))
  }

  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]]
    }
    return source
  }

  function init(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function"
        ? (function(key, action) {
            actions[key] = function(data) {
              state = get(path, store.state)

              if (typeof (data = action(data)) === "function") {
                data = data(state, actions)
              }

              if (data && data !== state && !data.then) {
                repaint(
                  (store.state = setDeep(
                    path,
                    assign(state, data),
                    store.state
                  ))
                )
              }

              return data
            }
          })(key, actions[key])
        : init(path.concat(key), (state[key] = state[key] || {}), actions[key])
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
      for (var i in assign(oldValue, (value = value || {}))) {
        element.style[i] = null == value[i] ? "" : value[i]
      }
    } else {
      try {
        element[name] = null == value ? "" : value
      } catch (_) {}

      if (typeof value !== "function") {
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
      var element = (isSVG = isSVG || node.tag === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
        : document.createElement(node.tag)

      if (node.props.oncreate) {
        stack.push(function() {
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
    for (var i in assign(oldProps, props)) {
      var value = props[i]
      var oldValue = i === "value" || i === "checked" ? element[i] : oldProps[i]

      if (value !== oldValue) {
        setElementProp(element, i, value, oldValue)
      }
    }

    if (props.onupdate) {
      stack.push(function() {
        props.onupdate(element, oldProps)
      })
    }
  }

  function destroyChildren(element, node) {
    if (typeof node !== "string") {
      for (var i = 0; i < node.children.length; i++) {
        destroyChildren(element.childNodes[i], node.children[i])
      }

      if (node.props.ondestroy) {
        node.props.ondestroy(element)
      }
    }
  }

  function removeElement(parent, element, node) {
    function done() {
      destroyChildren(element, node)
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

  var lock
  var root = container && container.children[0]
  var node = vnode(root, [].map)
  var stack = []
  var store = assign({}, model)

  repaint(
    init(
      [],
      (store.state = assign({}, store.state)),
      (store.actions = assign({}, store.actions))
    )
  )

  return store
}
