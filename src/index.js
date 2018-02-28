export function h(name, attributes /*, ...rest*/) {
  var node
  var rest = []
  var children = []
  var length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    if ((node = rest.pop()) && node.pop /* Array? */) {
      for (length = node.length; length--; ) {
        rest.push(node[length])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  return typeof name === "function"
    ? name(attributes || {}, children)
    : {
        nodeName: name,
        attributes: attributes || {},
        children: children,
        key: attributes && attributes.key
      }
}

export function app(state, actions, view, container) {
  var renderLock
  var firstRender = true
  var lifeCycle = []
  var element = (container && container.children[0]) || null
  var oldNode = element && recycleNode(element, [].map)
  var globalState = clone(state)
  var wiredActions = clone(actions)

  scheduleRender(wireStateToActions([], globalState, wiredActions))

  return wiredActions

  function recycleNode(element, map) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function(element) {
        return element.nodeType === 3 // Node.TEXT_NODE
          ? element.nodeValue
          : recycleNode(element, map)
      })
    }
  }

  function resolveNode(node) {
    return typeof node === "function"
      ? resolveNode(node(globalState, wiredActions))
      : node
  }

  function render() {
    element = patch(container, element, oldNode, (oldNode = resolveNode(view)))
    firstRender = false
    renderLock = !renderLock

    while (lifeCycle.length) lifeCycle.pop()()
  }

  function scheduleRender() {
    if (!renderLock) {
      renderLock = !renderLock
      setTimeout(render)
    }
  }

  function clone(target, source) {
    var obj = {}

    for (var i in target) obj[i] = target[i]
    for (var i in source) obj[i] = source[i]

    return obj
  }

  function set(path, value, source) {
    var target = {}
    if (path.length) {
      target[path[0]] =
        path.length > 1 ? set(path.slice(1), value, source[path[0]]) : value
      return clone(source, target)
    }
    return value
  }

  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]]
    }
    return source
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function"
        ? (function(key, action) {
            actions[key] = function(data) {
              if (typeof (data = action(data)) === "function") {
                data = data(get(path, globalState), actions)
              }

              if (
                data &&
                data !== (state = get(path, globalState)) &&
                !data.then // Promise
              ) {
                scheduleRender(
                  (globalState = set(path, clone(state, data), globalState))
                )
              }

              return data
            }
          })(key, actions[key])
        : wireStateToActions(
            path.concat(key),
            (state[key] = clone(state[key])),
            (actions[key] = clone(actions[key]))
          )
    }
  }

  function getKey(node) {
    return node ? node.key : null
  }

  function updateAttribute(element, name, value, isSVG, oldValue) {
    if (name === "key") {
    } else if (name === "style") {
      for (var i in clone(oldValue, value)) {
        element[name][i] = value == null || value[i] == null ? "" : value[i]
      }
    } else {
      if (
        typeof value === "function" ||
        (name in element && name !== "list" && !isSVG)
      ) {
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
        : (isSVG = isSVG || node.nodeName === "svg")
          ? document.createElementNS(
              "http://www.w3.org/2000/svg",
              node.nodeName
            )
          : document.createElement(node.nodeName)

    if (node.attributes) {
      if (node.attributes.oncreate) {
        lifeCycle.push(function() {
          node.attributes.oncreate(element)
        })
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(
          createElement(
            (node.children[i] = resolveNode(node.children[i])),
            isSVG
          )
        )
      }

      for (var name in node.attributes) {
        updateAttribute(element, name, node.attributes[name], isSVG)
      }
    }

    return element
  }

  function updateElement(element, oldAttributes, attributes, isSVG) {
    for (var name in clone(oldAttributes, attributes)) {
      if (
        attributes[name] !==
        (name === "value" || name === "checked"
          ? element[name]
          : oldAttributes[name])
      ) {
        updateAttribute(
          element,
          name,
          attributes[name],
          isSVG,
          oldAttributes[name]
        )
      }
    }

    var cb = firstRender ? attributes.oncreate : attributes.onupdate
    if (cb) {
      lifeCycle.push(function() {
        cb(element, oldAttributes)
      })
    }
  }

  function removeChildren(element, node, attributes) {
    if ((attributes = node.attributes)) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i])
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element)
      }
    }
    return element
  }

  function removeElement(parent, element, node, cb) {
    function done() {
      parent.removeChild(removeChildren(element, node))
    }

    if (node.attributes && (cb = node.attributes.onremove)) {
      cb(element, done)
    } else {
      done()
    }
  }

  function patch(parent, element, oldNode, node, isSVG) {
    if (node === oldNode) {
    } else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
      var newElement = createElement(node, isSVG)
      parent.insertBefore(newElement, element)

      if (oldNode != null) {
        removeElement(parent, element, oldNode)
      }

      element = newElement
    } else if (oldNode.nodeName == null) {
      element.nodeValue = node
    } else {
      updateElement(
        element,
        oldNode.attributes,
        node.attributes,
        (isSVG = isSVG || node.nodeName === "svg")
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
        var newChild = (node.children[j] = resolveNode(node.children[j]))

        var oldKey = getKey(oldChild)
        var newKey = getKey(newChild)

        if (newKeyed[oldKey]) {
          i++
          continue
        }

        if (newKey == null || firstRender) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChild, newChild, isSVG)
            j++
          }
          i++
        } else {
          var keyedNode = oldKeyed[newKey] || []

          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], newChild, isSVG)
            i++
          } else if (keyedNode[0]) {
            patch(
              element,
              element.insertBefore(keyedNode[0], oldElements[i]),
              keyedNode[1],
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
        if (!newKeyed[oldKeyed[i][1].key]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
        }
      }
    }
    return element
  }
}
