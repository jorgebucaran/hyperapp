/**
 * Creates a VNode. A VNode is a JavaScript object that represents an element
 * in the DOM tree. Hyperapp consumes this object to update the DOM. A VNode
 * props may include any valid HTML or SVG attributes, DOM events, lifecycle
 * events, and keys.
 *
 * @param {string|Function} name An element/tag name or function returning a VNode.
 * @param {Object} props Any attributes/props to set on the created element.
 * @param rest Children to append to the created element.
 *
 * @public
 */
export function h(name, props) {
  var node
  var children = []

  for (var stack = [], i = arguments.length; i-- > 2; ) {
    stack.push(arguments[i])
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (var i = node.length; i--; ) {
        stack.push(node[i])
      }
    } else if (node == null || node === true || node === false) {
    } else {
      children.push(node)
    }
  }

  return typeof name === "string"
    ? {
        name: name,
        props: props || {},
        children: children
      }
    : name(props || {}, children)
}

/**
 * Creates an application and embeds it into the given container.
 *
 * @param {Object} state The state tree that represents the application.
 * @param {Object} actions The actions tree that describes how the state can change.
 * @param {Function} view A function taking state, actions, and returning a VNode.
 * @param {Element} container A DOM element to render into.
 * @returns {Object} The state-wired actions tree.
 *
 * @public
 */
export function app(state, actions, view, container) {
  var lifecycle = []
  var root = container && container.children[0]
  var node = vnode(root, [].map)
  var lock

  repaint(init([], (state = assign(state)), (actions = assign(actions))))

  return actions

  /**
   * Returns the VNode representation of the given element. The element is usually
   * server side rendered HTML, and we use this function to start with an existing
   * node on the first patch. The node is not populated with your state or actions,
   * but it will be after we patch it with the VNode produced by the view function.
   *
   * @param {Element} element A DOM element to traverse.
   * @param {Function} map A reference to Array.prototype.map.
   * @returns A VNode that represents the given element.
   *
   * @private
   */
  function vnode(element, map) {
    return (
      element && {
        name: element.nodeName.toLowerCase(),
        props: {},
        children: map.call(element.childNodes, function(element) {
          return element.nodeType === 3
            ? element.nodeValue
            : vnode(element, map)
        })
      }
    )
  }

  /**
   *
   *
   */
  function render(next) {
    lock = !lock
    next = view(state, actions)

    if (container && !lock) {
      root = patch(container, root, node, (node = next))
    }

    while ((next = lifecycle.pop())) next()
  }

  /**
   * Schedules a new render call if we are not currently locked and toggles the
   * lock in order to throttle successive repaint attempts, e.g., when calling
   * several actions in a row.
   */
  function repaint() {
    if (!lock) {
      lock = !lock
      setTimeout(render)
    }
  }

  /**
   * Copy all properties from source into target without mutation.
   *
   * @param {Object} target Object to copy into.
   * @param {Object} source Object to copy from.
   * @private
   */

  function assign(target, source) {
    var obj = {}

    for (var i in target) obj[i] = target[i]
    for (var i in source) obj[i] = source[i]

    return obj
  }

  function set(path, value, target, source) {
    if (path.length) {
      target[path[0]] =
        path.length > 1 ? set(path.slice(1), value, {}, source[path[0]]) : value
      return assign(source, target)
    }
    return value
  }

  /**
   *
   * @param {Array} path An array of keys that indicate
   * @param {*} source
   */
  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]]
    }
    return source
  }

  /**
   * Initializes the given module:
   *  - computes the initial state
   *  - initalize all actions
   *  - add module.init() to be called before the first render
   *  - initialize sub-modules
   *
   * @param path the module to initialize
   * @param slice the initial state (updated by this function)
   * @param actions the actions object (updated by this function)
   */
  function init(path, slice, actions) {
    for (var key in actions) {
      typeof actions[key] === "function"
        ? (function(key, action) {
            actions[key] = function(data) {
              if (typeof (data = action(data)) === "function") {
                data = data(get(path, state), actions)
              }

              if (data && data !== (slice = get(path, state)) && !data.then) {
                repaint((state = set(path, assign(slice, data), {}, state)))
              }

              return data
            }
          })(key, actions[key])
        : init(
            path.concat(key),
            (slice[key] = slice[key] || {}),
            (actions[key] = assign(actions[key]))
          )
    }
  }

  function getKey(node) {
    return node && node.props ? node.props.key : null
  }

  function setElementProp(element, name, value, isSVG, oldValue) {
    if (name === "key") {
    } else if (name === "style") {
      for (var i in assign(oldValue, value)) {
        element[name][i] = value == null || value[i] == null ? "" : value[i]
      }
    } else {
      if (typeof value === "function" || (name in element && !isSVG)) {
        element[name] = value == null ? "" : value
      } else if (value != null && value !== false) {
        element.setAttribute(name, value)
      }

      if (value == null || value === false) {
        element.removeAttribute(name)
      }
    }
  }

  function createElement(node, isSVG) {
    var element =
      typeof node === "string" || typeof node === "number"
        ? document.createTextNode(node)
        : (isSVG = isSVG || node.name === "svg")
          ? document.createElementNS("http://www.w3.org/2000/svg", node.name)
          : document.createElement(node.name)

    if (node.props) {
      if (node.props.oncreate) {
        lifecycle.push(function() {
          node.props.oncreate(element)
        })
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i], isSVG))
      }

      for (var name in node.props) {
        setElementProp(element, name, node.props[name], isSVG)
      }
    }

    return element
  }

  function updateElement(element, oldProps, props, isSVG) {
    for (var name in assign(oldProps, props)) {
      if (
        props[name] !==
        (name === "value" || name === "checked"
          ? element[name]
          : oldProps[name])
      ) {
        setElementProp(element, name, props[name], isSVG, oldProps[name])
      }
    }

    if (props.onupdate) {
      lifecycle.push(function() {
        props.onupdate(element, oldProps)
      })
    }
  }

  function removeChildren(element, node, props) {
    if ((props = node.props)) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i])
      }

      if (props.ondestroy) {
        props.ondestroy(element)
      }
    }
    return element
  }

  function removeElement(parent, element, node, cb) {
    function done() {
      parent.removeChild(removeChildren(element, node))
    }

    if (node.props && (cb = node.props.onremove)) {
      cb(element, done)
    } else {
      done()
    }
  }

  function patch(parent, element, oldNode, node, isSVG, nextSibling) {
    if (node === oldNode) {
    } else if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element)
    } else if (node.name && node.name === oldNode.name) {
      updateElement(
        element,
        oldNode.props,
        node.props,
        (isSVG = isSVG || node.name === "svg")
      )

      var oldElements = []
      var oldKeyed = {}
      var newKeyed = {}

      for (var i = 0; i < oldNode.children.length; i++) {
        oldElements[i] = element.childNodes[i]

        var oldChild = oldNode.children[i]
        var oldKey = getKey(oldChild)

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElements[i], oldChild]
        }
      }

      var i = 0
      var j = 0

      while (j < node.children.length) {
        var oldChild = oldNode.children[i]
        var newChild = node.children[j]

        var oldKey = getKey(oldChild)
        var newKey = getKey(newChild)

        if (newKeyed[oldKey]) {
          i++
          continue
        }

        if (newKey == null) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChild, newChild, isSVG)
            j++
          }
          i++
        } else {
          var recyledNode = oldKeyed[newKey] || []

          if (oldKey === newKey) {
            patch(element, recyledNode[0], recyledNode[1], newChild, isSVG)
            i++
          } else if (recyledNode[0]) {
            patch(
              element,
              element.insertBefore(recyledNode[0], oldElements[i]),
              recyledNode[1],
              newChild,
              isSVG
            )
          } else {
            patch(element, oldElements[i], null, newChild, isSVG)
          }

          j++
          newKeyed[newKey] = newChild
        }
      }

      while (i < oldNode.children.length) {
        var oldChild = oldNode.children[i]
        if (getKey(oldChild) == null) {
          removeElement(element, oldElements[i], oldChild)
        }
        i++
      }

      for (var i in oldKeyed) {
        if (!newKeyed[oldKeyed[i][1].props.key]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
        }
      }
    } else if (node.name === oldNode.name) {
      element.nodeValue = node
    } else {
      element = parent.insertBefore(
        createElement(node, isSVG),
        (nextSibling = element)
      )
      removeElement(parent, nextSibling, oldNode)
    }
    return element
  }
}
