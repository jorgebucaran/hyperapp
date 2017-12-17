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

export function app(state, actions, view, container) {
  var lock
  var root = container && container.children[0]
  var node = vnode(root, [].map)
  var stack = []

  repaint(init([], (state = copy(state)), (actions = copy(actions))))

  return actions

  function vnode(element, map) {
    return (
      element && {
        tag: element.tagName.toLowerCase(),
        props: {},
        children: map.call(element.childNodes, function(element) {
          return 3 === element.nodeType
            ? element.nodeValue
            : vnode(element, map)
        })
      }
    )
  }

  function render(next) {
    lock = !lock
    next = view(state, actions)

    if (container && !lock) {
      root = patch(container, root, node, (node = next))
    }

    while ((next = stack.pop())) next()
  }

  function repaint() {
    if (view && !lock) {
      lock = !lock
      setTimeout(render)
    }
  }

  function copy(target, source) {
    var obj = {}

    for (var i in target) obj[i] = target[i]
    for (var i in source) obj[i] = source[i]

    return obj
  }

  function set(path, value, source) {
    var target = {}

    if (!path.length) {
      return value
    } else {
      target[path[0]] =
        1 < path.length ? set(path.slice(1), value, source[path[0]]) : value
      return copy(source, target)
    }
  }

  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]]
    }
    return source
  }

  function init(path, slice, actions) {
    for (var key in actions) {
      typeof actions[key] === "function"
        ? (function(key, action) {
            actions[key] = function(data) {
              slice = get(path, state)

              if (typeof (data = action(data)) === "function") {
                data = data(slice, actions)
              }

              if (data && data !== slice && !data.then) {
                repaint((state = set(path, copy(slice, data), state)))
              }

              return data
            }
          })(key, actions[key])
        : init(
            path.concat(key),
            (slice[key] = slice[key] || {}),
            (actions[key] = copy(actions[key]))
          )
    }
  }

  function getKey(node) {
    return node && node.props ? node.props.key : null
  }

  function setElementProp(element, name, value, oldValue) {
    if (name === "key") {
    } else if (name === "style") {
      for (var i in copy(oldValue, (value = value || {}))) {
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
      var element = (isSVG = isSVG || "svg" === node.tag)
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
    for (var i in copy(oldProps, props)) {
      var oldValue = "value" === i || "checked" === i ? element[i] : oldProps[i]

      if (props[i] !== oldValue) {
        setElementProp(element, i, props[i], oldValue)
      }
    }

    if (props.onupdate) {
      stack.push(function() {
        props.onupdate(element, oldProps)
      })
    }
  }

  function removeElement(parent, element, node, isChild) {
    if (node.props) {
      for (var i = 0, cb = node.props.onremove; i < node.children.length; i++) {
        removeElement(element, element.childNodes[i], node.children[i], true)
      }

      if (cb && typeof (cb = cb(element)) === "function") {
        cb(function() {
          return parent.removeChild(element)
        })
      }
    }

    if (!isChild) parent.removeChild(element)
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
}
