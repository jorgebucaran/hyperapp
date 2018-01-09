/**
 * Create a VNode (virtual node). A virtual node is a JavaScript object that
 * represents an element in the DOM tree. Hyperapp's patch function consumes
 * this object to update the DOM. A VNode props include any valid HTML/SVG
 * attributes, DOM events, lifecycle events, and keys.
 *
 * @param {string|Function} name An element name or function returning a VNode.
 * @param {Object} props Any attributes/props to set on the created element.
 * @param rest Children to append to the created element.
 * @returns {VNode}
 *
 * @public
 */
export function h(name, props) {
  var node
  var rest = []
  var children = []
  var i = arguments.length

  while (i-- > 2) rest.push(arguments[i])

  // Append the rest of the arguments to the children array, skipping null,
  // undefined and boolean nodes. If a node is an array, merge it with the
  // rest and continue processing the list. We do this to avoid creating a
  // recursive function to handle nested arrays.

  while (rest.length) {
    if (Array.isArray((node = rest.pop()))) {
      for (i = node.length; i--; ) {
        rest.push(node[i])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  // If name is a function, invoke it with the props and children. This allows
  // us to use this function like so: `h(MyComponent, props, children)` which
  // is what <MyComponent props={props}></MyComponent> compiles in JSX.

  return typeof name === "function"
    ? name(props || {}, children)
    : {
        name: name,
        props: props || {},
        children: children
      }
}

/**
 * Create an application and embed it to the given container. Returns a copy of
 * the actions tree, enhanced to trigger a repaint after updating the state.
 *
 * @param {Object} state The state tree that represents the application.
 * @param {Object} actions The actions tree that describes how to update the state.
 * @param {Function} view A function that returns a VNode.
 * @param {Element} container A DOM element to render into.
 * @returns {Object} The enhanced actions tree.
 *
 * @public
 */
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

  /**
   * Create the VNode representation of a DOM element.
   *
   * @param {Element}
   * @returns {VNode}
   *
   * @private
   */
  function vnode(element, map) {
    return {
      name: element.nodeName.toLowerCase(),
      props: {},
      children: map.call(element.childNodes, function(element) {
        return element.nodeType === 3 ? element.nodeValue : vnode(element, map)
      })
    }
  }

  /**
   * Compute a new vnode tree and patch the application container with it.
   *
   * @private
   */
  function render(next) {
    renderLock = !renderLock
    next = view(state, actions)

    // Check if the lock has been toggled as a result of calling any actions
    // from the view. This prevents patching the DOM with a stale node.

    if (container && !renderLock) {
      root = patch(container, root, node, (node = next))
    }

    // Flush the lifecycle stack and notify subscribers of created/updated nodes.

    while ((next = lifecycleStack.pop())) next()
  }

  /**
   * Schedules a new render call if we are not currently locked and toggles the
   * lock in order to throttle successive repaint attempts, e.g., when calling
   * several actions in a row.
   *
   * @private
   */
  function repaint() {
    if (!renderLock) {
      renderLock = !renderLock
      setTimeout(render)
    }
  }

  /**
   * Copy all properties from source into target immutably.
   *
   * @param {Object} target Object to copy into.
   * @param {Object} source Object to copy from.
   * @returns {Object}
   * @private
   */
  function copy(target, source) {
    var obj = {}

    for (var i in target) obj[i] = target[i]
    for (var i in source) obj[i] = source[i]

    return obj
  }

  /**
   * Sets the value at path of the source object.
   *
   * @private
   */
  function set(path, value, target, source) {
    if (path.length) {
      target[path[0]] =
        path.length > 1 ? set(path.slice(1), value, {}, source[path[0]]) : value
      return copy(source, target)
    }
    return value
  }

  /**
   * Get the property at path of the given object.
   *
   * @param {Array} path The path of the property to get.
   * @param {Object} source The object to query.
   *
   * @private
   */
  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]]
    }
    return source
  }

  /**
   * Enhance the state (add missing leaves from the actions tree) and actions
   * to trigger repaints after updating the state.
   *
   * @param {Array} path
   * @param {Object} substate
   * @param {Object} subactions
   *
   * @private
   */
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

  /**
   * Get the key from a virtual node properties.
   *
   * @param {VNode} node
   *
   * @private
   */
  function getKey(node) {
    return node && node.props ? node.props.key : null
  }

  /**
   *
   * @param {*} element
   * @param {*} name
   * @param {*} value
   * @param {*} isSVG
   * @param {*} oldValue
   *
   * @private
   */
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

  /**
   *
   * @param {*} node
   * @param {*} isSVG
   *
   * @private
   */
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

  /**
   *
   * @param {*} element
   * @param {*} oldProps
   * @param {*} props
   * @param {*} isSVG
   *
   * @private
   */
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

  /**
   *
   * @param {*} element
   * @param {*} node
   *
   * @private
   */
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

  /**
   *
   * @param {*} parent
   * @param {*} element
   * @param {*} node
   *
   * @private
   */
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

  /**
   * Patch the DOM.
   * @param {*} parent
   * @param {*} element
   * @param {*} oldNode
   * @param {*} node
   * @param {*} isSVG
   * @returns {Element} The patched element.
   *
   * @private
   */
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

// To render your app, we run your view function to produce a vnode tree and consume this object to literally "patch" the DOM, so every time your state changes, we need to calculate a new vnode tree to update the page.
