var DEFAULT = 0
var RECYCLED_NODE = 1
var TEXT_NODE = 2

var XLINK_NS = "http://www.w3.org/1999/xlink"
var SVG_NS = "http://www.w3.org/2000/svg"

var EMPTY_OBJECT = {}
var EMPTY_ARRAY = []

var map = EMPTY_ARRAY.map
var isArray = Array.isArray

var merge = function(a, b) {
  var target = {}

  for (var i in a) target[i] = a[i]
  for (var i in b) target[i] = b[i]

  return target
}

var resolved = typeof Promise === "function" && Promise.resolve()

var defer = !resolved
  ? setTimeout
  : function(cb) {
      return resolved.then(cb)
    }

var updateProperty = function(
  element,
  name,
  lastValue,
  nextValue,
  eventProxy,
  isSvg
) {
  if (name === "key") {
  } else if (name === "style") {
    for (var i in merge(lastValue, nextValue)) {
      var style = nextValue == null || nextValue[i] == null ? "" : nextValue[i]
      if (i[0] === "-") {
        element[name].setProperty(i, style)
      } else {
        element[name][i] = style
      }
    }
  } else {
    if (name[0] === "o" && name[1] === "n") {
      name = name.slice(2).toLowerCase()

      if (!element.events) element.events = {}

      element.events[name] = nextValue

      if (nextValue == null) {
        element.removeEventListener(name, eventProxy)
      } else if (lastValue == null) {
        element.addEventListener(name, eventProxy)
      }
    } else {
      var nullOrFalse = nextValue == null || nextValue === false

      if (
        name in element &&
        name !== "list" &&
        name !== "draggable" &&
        name !== "spellcheck" &&
        name !== "translate" &&
        !isSvg
      ) {
        element[name] = nextValue == null ? "" : nextValue
        if (nullOrFalse) {
          element.removeAttribute(name)
        }
      } else {
        var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ""))
        if (ns) {
          if (nullOrFalse) {
            element.removeAttributeNS(XLINK_NS, name)
          } else {
            element.setAttributeNS(XLINK_NS, name, nextValue)
          }
        } else {
          if (nullOrFalse) {
            element.removeAttribute(name)
          } else {
            element.setAttribute(name, nextValue)
          }
        }
      }
    }
  }
}

var createElement = function(node, lifecycle, eventProxy, isSvg) {
  var element =
    node.type === TEXT_NODE
      ? document.createTextNode(node.name)
      : (isSvg = isSvg || node.name === "svg")
        ? document.createElementNS(SVG_NS, node.name)
        : document.createElement(node.name)

  var props = node.props
  if (props.onCreate) {
    lifecycle.push(function() {
      props.onCreate(element)
    })
  }

  for (var i = 0, length = node.children.length; i < length; i++) {
    element.appendChild(
      createElement(node.children[i], lifecycle, eventProxy, isSvg)
    )
  }

  for (var name in props) {
    updateProperty(element, name, null, props[name], eventProxy, isSvg)
  }

  return (node.element = element)
}

var updateElement = function(
  element,
  lastProps,
  nextProps,
  lifecycle,
  eventProxy,
  isSvg,
  isRecycled
) {
  for (var name in merge(lastProps, nextProps)) {
    if (
      (name === "value" || name === "checked"
        ? element[name]
        : lastProps[name]) !== nextProps[name]
    ) {
      updateProperty(
        element,
        name,
        lastProps[name],
        nextProps[name],
        eventProxy,
        isSvg
      )
    }
  }

  var cb = isRecycled ? nextProps.onCreate : nextProps.onUpdate
  if (cb != null) {
    lifecycle.push(function() {
      cb(element, lastProps)
    })
  }
}

var removeChildren = function(node) {
  for (var i = 0, length = node.children.length; i < length; i++) {
    removeChildren(node.children[i])
  }

  var cb = node.props.onDestroy
  if (cb != null) {
    cb(node.element)
  }

  return node.element
}

var removeElement = function(parent, node) {
  var remove = function() {
    parent.removeChild(removeChildren(node))
  }

  var cb = node.props && node.props.onRemove
  if (cb != null) {
    cb(node.element, remove)
  } else {
    remove()
  }
}

var getKey = function(node) {
  return node == null ? null : node.key
}

var createKeyMap = function(children, start, end) {
  var out = {}
  var key
  var node

  for (; start <= end; start++) {
    if ((key = (node = children[start]).key) != null) {
      out[key] = node
    }
  }

  return out
}

var patchElement = function(
  parent,
  element,
  lastNode,
  nextNode,
  lifecycle,
  eventProxy,
  isSvg
) {
  if (nextNode === lastNode) {
  } else if (
    lastNode != null &&
    lastNode.type === TEXT_NODE &&
    nextNode.type === TEXT_NODE
  ) {
    if (lastNode.name !== nextNode.name) {
      element.nodeValue = nextNode.name
    }
  } else if (lastNode == null || lastNode.name !== nextNode.name) {
    var newElement = parent.insertBefore(
      createElement(nextNode, lifecycle, eventProxy, isSvg),
      element
    )

    if (lastNode != null) removeElement(parent, lastNode)

    element = newElement
  } else {
    updateElement(
      element,
      lastNode.props,
      nextNode.props,
      lifecycle,
      eventProxy,
      (isSvg = isSvg || nextNode.name === "svg"),
      lastNode.type === RECYCLED_NODE
    )

    var savedNode
    var childNode

    var lastKey
    var lastChildren = lastNode.children
    var lastChStart = 0
    var lastChEnd = lastChildren.length - 1

    var nextKey
    var nextChildren = nextNode.children
    var nextChStart = 0
    var nextChEnd = nextChildren.length - 1

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      lastKey = getKey(lastChildren[lastChStart])
      nextKey = getKey(nextChildren[nextChStart])

      if (lastKey == null || lastKey !== nextKey) break

      patchElement(
        element,
        lastChildren[lastChStart].element,
        lastChildren[lastChStart],
        nextChildren[nextChStart],
        lifecycle,
        eventProxy,
        isSvg
      )

      lastChStart++
      nextChStart++
    }

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      lastKey = getKey(lastChildren[lastChEnd])
      nextKey = getKey(nextChildren[nextChEnd])

      if (lastKey == null || lastKey !== nextKey) break

      patchElement(
        element,
        lastChildren[lastChEnd].element,
        lastChildren[lastChEnd],
        nextChildren[nextChEnd],
        lifecycle,
        eventProxy,
        isSvg
      )

      lastChEnd--
      nextChEnd--
    }

    if (lastChStart > lastChEnd) {
      while (nextChStart <= nextChEnd) {
        element.insertBefore(
          createElement(
            nextChildren[nextChStart++],
            lifecycle,
            eventProxy,
            isSvg
          ),
          (childNode = lastChildren[lastChStart]) && childNode.element
        )
      }
    } else if (nextChStart > nextChEnd) {
      while (lastChStart <= lastChEnd) {
        removeElement(element, lastChildren[lastChStart++])
      }
    } else {
      var lastKeyed = createKeyMap(lastChildren, lastChStart, lastChEnd)
      var nextKeyed = {}

      while (nextChStart <= nextChEnd) {
        lastKey = getKey((childNode = lastChildren[lastChStart]))
        nextKey = getKey(nextChildren[nextChStart])

        if (
          nextKeyed[lastKey] ||
          (nextKey != null && nextKey === getKey(lastChildren[lastChStart + 1]))
        ) {
          if (lastKey == null) {
            removeElement(element, childNode)
          }
          lastChStart++
          continue
        }

        if (nextKey == null || lastNode.type === RECYCLED_NODE) {
          if (lastKey == null) {
            patchElement(
              element,
              childNode && childNode.element,
              childNode,
              nextChildren[nextChStart],
              lifecycle,
              eventProxy,
              isSvg
            )
            nextChStart++
          }
          lastChStart++
        } else {
          if (lastKey === nextKey) {
            patchElement(
              element,
              childNode.element,
              childNode,
              nextChildren[nextChStart],
              lifecycle,
              eventProxy,
              isSvg
            )
            nextKeyed[nextKey] = true
            lastChStart++
          } else {
            if ((savedNode = lastKeyed[nextKey]) != null) {
              patchElement(
                element,
                element.insertBefore(
                  savedNode.element,
                  childNode && childNode.element
                ),
                savedNode,
                nextChildren[nextChStart],
                lifecycle,
                eventProxy,
                isSvg
              )
              nextKeyed[nextKey] = true
            } else {
              patchElement(
                element,
                childNode && childNode.element,
                null,
                nextChildren[nextChStart],
                lifecycle,
                eventProxy,
                isSvg
              )
            }
          }
          nextChStart++
        }
      }

      while (lastChStart <= lastChEnd) {
        if (getKey((childNode = lastChildren[lastChStart++])) == null) {
          removeElement(element, childNode)
        }
      }

      for (var key in lastKeyed) {
        if (nextKeyed[key] == null) {
          removeElement(element, lastKeyed[key])
        }
      }
    }
  }

  return (nextNode.element = element)
}

var createVNode = function(name, props, children, element, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    element: element,
    key: key,
    type: type
  }
}

var createTextVNode = function(text, element) {
  return createVNode(text, EMPTY_OBJECT, EMPTY_ARRAY, element, null, TEXT_NODE)
}

var recycleChild = function(element) {
  return element.nodeType === 3 // Node.TEXT_NODE
    ? createTextVNode(element.nodeValue, element)
    : recycleElement(element)
}

var recycleElement = function(element) {
  return createVNode(
    element.nodeName.toLowerCase(),
    EMPTY_OBJECT,
    map.call(element.childNodes, recycleChild),
    element,
    null,
    RECYCLED_NODE
  )
}

var patch = function(container, element, lastNode, nextNode, eventProxy) {
  var lifecycle = []

  element = patchElement(
    container,
    element,
    lastNode,
    nextNode,
    lifecycle,
    eventProxy
  )

  while (lifecycle.length > 0) lifecycle.pop()()

  return element
}

export var h = function(name, props) {
  var node
  var rest = []
  var children = []
  var length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  if ((props = props == null ? {} : props).children != null) {
    if (rest.length <= 0) {
      rest.push(props.children)
    }
    delete props.children
  }

  while (rest.length > 0) {
    if (isArray((node = rest.pop()))) {
      for (length = node.length; length-- > 0; ) {
        rest.push(node[length])
      }
    } else if (node === false || node === true || node == null) {
    } else {
      children.push(typeof node === "object" ? node : createTextVNode(node))
    }
  }

  return typeof name === "function"
    ? name(props, (props.children = children))
    : createVNode(name, props, children, null, props.key, DEFAULT)
}

var cancel = function(sub) {
  sub.cancel()
}

var isSameValue = function(a, b) {
  if (a !== b) {
    for (var k in merge(a, b)) {
      if (a[k] !== b[k]) return false
    }
  }
  return true
}

var isSameAction = function(a, b) {
  return (
    typeof a === typeof b &&
    (isArray(a) && a[0] === b[0] && isSameValue(a[1], b[1]))
  )
}

var restart = function(sub, oldSub, dispatch) {
  for (var k in merge(sub, oldSub)) {
    if (k === "cancel") {
    } else if (sub[k] === oldSub[k] || isSameAction(sub[k], oldSub[k])) {
    } else {
      cancel(oldSub)
      return start(sub, dispatch)
    }
  }
  return oldSub
}

var start = function(sub, dispatch) {
  return merge(sub, {
    cancel: sub.effect(sub, dispatch)
  })
}

var refresh = function(sub, oldSub, dispatch) {
  if (isArray(sub) || isArray(oldSub)) {
    var out = []
    var subs = isArray(sub) ? sub : [sub]
    var oldSubs = isArray(oldSub) ? oldSub : [oldSub]

    for (var i = 0; i < subs.length || i < oldSubs.length; i++) {
      out.push(refresh(subs[i], oldSubs[i], dispatch))
    }

    return out
  }

  return sub
    ? oldSub
      ? restart(sub, oldSub, dispatch)
      : start(sub, dispatch)
    : oldSub
      ? cancel(oldSub)
      : oldSub
}

export function app(props) {
  var state
  var view = props.view
  var subs = props.subscriptions
  var container = props.container
  var element = container.children[0]
  var lastNode = element && recycleElement(element)
  var lastSub = []
  var updateInProgress = false

  var setState = function(newState) {
    if (state !== newState) {
      state = newState

      if (!updateInProgress) {
        updateInProgress = true
        defer(render)
      }
    }
  }

  var dispatch = function(obj, data) {
    if (obj == null) {
    } else if (typeof obj === "function") {
      dispatch(obj(state, data))
    } else if (isArray(obj)) {
      if (typeof obj[0] === "function") {
        dispatch(obj[0](state, obj[1], data))
      } else {
        obj[1].effect(obj[1], dispatch, setState(obj[0]))
      }
    } else {
      setState(obj)
    }
  }

  var eventProxy = function(event) {
    dispatch(event.currentTarget.events[event.type], event)
  }

  var render = function() {
    updateInProgress = false

    if (subs) {
      lastSub = refresh(subs(state), lastSub, dispatch)
    }

    if (view) {
      element = patch(
        container,
        element,
        lastNode,
        (lastNode = view(state)),
        eventProxy
      )
    }
  }

  dispatch(props.init)
}
