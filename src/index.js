export function h(name, props) {
  var node
  var rest = []
  var children = []
  var i = arguments.length

  while (i-- > 2) rest.push(arguments[i])

  while (rest.length) {
    if (Array.isArray((node = rest.pop()))) {
      for (i = node.length; i--; ) {
        rest.push(node[i])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  return typeof name === "function"
    ? name(props || {}, children)
    : {
        name: name,
        props: props || {},
        children: children
      }
}

export function app(state, actions, view, container) {
  // The render lock is used to avoid unnecessary view renders when the
  // state is updated in succession (calling multiple actions in a row).
  var renderLock

  // The lifecycle stack is used to defer the invocation of lifecycle
  // events until after patching the DOM.
  var lifecycleStack = []

  // The container is usually empty or server-side rendered. When there is
  // existing content, we'll take over its first element child and attempt
  // to patch it during the view render instead of throwing it away.
  var root = (container && container.children[0]) || null

  // If the root is non-empty, turn the existing HTML into a virtual node.
  // This means we can avoid creating new elements on the first patch and
  // rehydrate the existing content, e.g. attach event listeners, etc.
  var node = root && vnode(root, [].map)

  // Copy the state and actions tree to avoid mutating non-owned objects
  // and initialize/wire the actions to the view rendering.
  repaint(enhance([], (state = copy(state)), (actions = copy(actions))))

  return actions

  /** Create the VNode representation of a DOM element. */
  function vnode(element, map) {
    return {
      name: element.nodeName.toLowerCase(),
      props: {},
      children: map.call(element.childNodes, function(element) {
        return element.nodeType === 3 ? element.nodeValue : vnode(element, map)
      })
    }
  }

  /** Compute a new vnode tree and patch the application container with it. */
  function render(next) {
    renderLock = !renderLock
    next = view(state, actions)

    // Check if the lock has been toggled as a result of calling any actions
    // from the view. This prevents patching the DOM with a stale node.

    if (container && !renderLock) {
      root = patch(container, root, node, (node = next))
    }

    while ((next = lifecycleStack.pop())) next()
  }

  /** Schedules a new render call if we are not currently render locked. */
  function repaint() {
    if (!renderLock) {
      renderLock = !renderLock
      setTimeout(render)
    }
  }

  /** Copy all properties from source into target immutably. */
  function copy(target, source) {
    var obj = {}

    for (var i in target) obj[i] = target[i]
    for (var i in source) obj[i] = source[i]

    return obj
  }

  /** Sets the value at path of the source object.  */
  function set(path, value, target, source) {
    if (path.length) {
      target[path[0]] =
        path.length > 1 ? set(path.slice(1), value, {}, source[path[0]]) : value
      return copy(source, target)
    }
    return value
  }

  /** Get the property at path of the given object. */
  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]]
    }
    return source
  }

  /** Enhance actions to trigger repaints after updating the state. */
  function enhance(path, substate, subactions) {
    for (var key in subactions) {
      typeof subactions[key] === "function"
        ? (function(key, action) {
            subactions[key] = function(data) {
              if (typeof (data = action(data)) === "function") {
                data = data(get(path, state), subactions)
              }

              if (
                data &&
                data !== (substate = get(path, state)) &&
                !data.then
              ) {
                repaint((state = set(path, copy(substate, data), {}, state)))
              }

              return data
            }
          })(key, subactions[key])
        : enhance(
            path.concat(key),
            (substate[key] = substate[key] || {}),
            (subactions[key] = copy(subactions[key]))
          )
    }
  }

  /** Get the key from a virtual node properties. */
  function getKey(node) {
    return node && node.props ? node.props.key : null
  }

  /** Set an attribute/property in the element. */
  function setElementProp(element, name, value, isSVG, oldValue) {
    if (name === "key") {
    } else if (name === "style") {
      for (var i in copy(oldValue, value)) {
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

  /** Create a new element from a virtual node. */
  function createElement(node, isSVG) {
    var element =
      typeof node === "string" || typeof node === "number"
        ? document.createTextNode(node)
        : (isSVG = isSVG || node.name === "svg")
          ? document.createElementNS("http://www.w3.org/2000/svg", node.name)
          : document.createElement(node.name)

    if (node.props) {
      if (node.props.oncreate) {
        lifecycleStack.push(function() {
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

  /** Update an element properties. */
  function updateElement(element, oldProps, props, isSVG) {
    for (var name in copy(oldProps, props)) {
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
      lifecycleStack.push(function() {
        props.onupdate(element, oldProps)
      })
    }
  }

  /** Remove all element children. */
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

  /** Remove and element from its parent. */
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

  /** Patch the DOM. */
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
