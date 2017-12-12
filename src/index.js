export function h(type, props) {
  var node
  var stack = []
  var children = []

  for (var i = arguments.length; i-- > 2; ) {
    stack.push(arguments[i])
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (var i = node.length; i--; ) {
        stack.push(node[i])
      }
    } else if (null == node || true === node || false === node) {
    } else {
      children.push(typeof node === "number" ? (node + "") : node)
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
  var stack = []

  repaint()

  return init([], model)

  function set(target, source) {
    for (var i in source) {
      target[i] = source[i]
    }
    return target
  }

  function merge(target, source) {
    return set(set({}, target), source)
  }

  function setDeep(path, value, source) {
    var target = {}
    return 0 === path.length
      ? value
      : ((target[path[0]] =
          1 < path.length
            ? setDeep(path.slice(1), value, source[path[0]])
            : value),
        merge(source, target))
  }

  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]]
    }
    return source
  }

  function init(path, source) {
    for (var key in source) {
      typeof source[key] === "function"
        ? (function(key, action) {
            source[key] = function(data) {
              source = get(path, model)

              if (typeof (data = action(data)) === "function") {
                data = data(source)
              }

              if (data && data !== source && !data.then) {
                repaint((model = setDeep(path, merge(source, data), model)))
              }

              return data
            }
          })(key, source[key])
        : typeof source[key] === "object" &&
          !Array.isArray(source[key]) &&
          init(path.concat(key), source[key])
    }
    return source
  }

  function render(next) {
    lock = !lock
    next = view(model)

    if (!lock) {
      root = patch(container, root, node, (node = next))
    }

    while ((next = stack.pop())) next()
  }

  function repaint() {
    if (view && !lock) {
      setTimeout(render, (lock = !lock))
    }
  }

  function vnode(element, map) {
    return (
      element && {
        type: element.tagName.toLowerCase(),
        props: {},
        children: map.call(element.childNodes, function(element) {
          return 3 === element.nodeType
            ? element.nodeValue
            : vnode(element, map)
        })
      }
    )
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
      var element = (isSVG = isSVG || node.type === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.type)
        : document.createElement(node.type)

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
    for (var i in merge(oldProps, props)) {
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

  function removeElement(parent, element, props) {
    function done() {
      parent.removeChild(element)
    }

    if (props && props.onremove) {
      props.onremove(element, done)
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
