var DEFAULT_NODE = 0
var RECYCLED_NODE = 1
var LAZY_NODE = 2
var TEXT_NODE = 3

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

var defer =
  typeof Promise === "function"
    ? function(cb) {
        Promise.resolve().then(cb)
      }
    : setTimeout

function createClass(names) {
  var tmp
  var out = ""
  var type = typeof names

  if (type === "string" || type === "number") return names || ""

  if (isArray(names) && names.length > 0) {
    for (var i = 0, len = names.length; i < len; i++) {
      if ((tmp = createClass(names[i])) !== "") out += (out && " ") + tmp
    }
  } else {
    for (var i in names) {
      if (names.hasOwnProperty(i) && names[i]) out += (out && " ") + i
    }
  }

  return out
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
  } else if (name === "class") {
    if ((nextValue = createClass(nextValue))) {
      element.setAttribute(name, nextValue)
    } else {
      element.removeAttribute(name)
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
      createElement(
        (node.children[i] = resolveNode(node.children[i])),
        lifecycle,
        eventProxy,
        isSvg
      )
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
  oldNode,
  newNode,
  lifecycle,
  eventProxy,
  isSvg
) {
  if (newNode === oldNode) {
  } else if (
    oldNode != null &&
    oldNode.type === TEXT_NODE &&
    newNode.type === TEXT_NODE
  ) {
    if (oldNode.name !== newNode.name) {
      element.nodeValue = newNode.name
    }
  } else if (oldNode == null || oldNode.name !== newNode.name) {
    var newElement = parent.insertBefore(
      createElement(
        (newNode = resolveNode(newNode)),
        lifecycle,
        eventProxy,
        isSvg
      ),
      element
    )

    if (oldNode != null) removeElement(parent, oldNode)

    element = newElement
  } else {
    updateElement(
      element,
      oldNode.props,
      newNode.props,
      lifecycle,
      eventProxy,
      (isSvg = isSvg || newNode.name === "svg"),
      oldNode.type === RECYCLED_NODE
    )

    var savedNode
    var childNode

    var lastKey
    var lastChildren = oldNode.children
    var lastChStart = 0
    var lastChEnd = lastChildren.length - 1

    var nextKey
    var nextChildren = newNode.children
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
        (nextChildren[nextChStart] = resolveNode(
          nextChildren[nextChStart],
          lastChildren[lastChStart]
        )),
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
        (nextChildren[nextChEnd] = resolveNode(
          nextChildren[nextChEnd],
          lastChildren[lastChEnd]
        )),
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
            (nextChildren[nextChStart] = resolveNode(
              nextChildren[nextChStart++]
            )),
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
        nextKey = getKey(
          (nextChildren[nextChStart] = resolveNode(
            nextChildren[nextChStart],
            childNode
          ))
        )

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

        if (nextKey == null || oldNode.type === RECYCLED_NODE) {
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

  return (newNode.element = element)
}

var shouldUpdate = function(a, b) {
  for (var k in a) if (a[k] !== b[k]) return true
  for (var k in b) if (a[k] !== b[k]) return true
}

var resolveNode = function(newNode, oldNode) {
  return newNode.type === LAZY_NODE
    ? !oldNode || shouldUpdate(newNode.lazy, oldNode.lazy)
      ? newNode.render()
      : oldNode
    : newNode
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
  return element.nodeType === TEXT_NODE
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

var patch = function(container, element, oldNode, newNode, eventProxy) {
  var lifecycle = []

  element = patchElement(
    container,
    element,
    oldNode,
    newNode,
    lifecycle,
    eventProxy
  )

  while (lifecycle.length > 0) lifecycle.pop()()

  return element
}

export var Lazy = function(props) {
  return {
    type: LAZY_NODE,
    key: props.key,
    lazy: props,
    render: function() {
      var node = props.render(props)
      node.lazy = props
      return node
    }
  }
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
    : createVNode(name, props, children, null, props.key, DEFAULT_NODE)
}

var isSameAction = function(a, b) {
  return isArray(a) && isArray(b) && typeof a[0] === "function" && a[0] === b[0]
}

var shouldRestart = function(a, b) {
  for (var k in merge(a, b)) {
    if (a[k] === b[k] || isSameAction(a[k], b[k])) b[k] = a[k]
    else return true
  }
}

var patchSubs = function(sub, oldSub, dispatch) {
  if (
    (sub && (!sub[0] || isArray(sub[0]))) ||
    (oldSub && (!oldSub[0] || isArray(oldSub[0])))
  ) {
    var out = []
    var subs = sub ? sub : [sub]
    var oldSubs = oldSub ? oldSub : [oldSub]

    for (var i = 0; i < subs.length || i < oldSubs.length; i++) {
      out.push(patchSubs(subs[i], oldSubs[i], dispatch))
    }

    return out
  }

  return sub
    ? !oldSub || sub[0] !== oldSub[0] || shouldRestart(sub[1], oldSub[1])
      ? [sub[0], sub[1], sub[0](sub[1], dispatch), oldSub && oldSub[2]()]
      : oldSub
    : oldSub && oldSub[2]()
}

export function app(props) {
  var state
  var view = props.view
  var subs = props.subscriptions
  var container = props.container
  var element = container && container.children[0]
  var oldNode = element && recycleElement(element)
  var stateLock = false
  var lastSub

  var setState = function(newState) {
    if (state !== newState) {
      state = newState
      if (!stateLock) {
        stateLock = true
        defer(render)
      }
    }
  }

  var dispatch = function(obj, props) {
    if (obj == null) {
    } else if (typeof obj === "function") {
      dispatch(obj(state, props))
    } else if (isArray(obj)) {
      if (typeof obj[0] === "function") {
        dispatch(obj[0](state, obj[1], props))
      } else {
        obj.slice(1).map(function(fx) {
          fx[0](fx[1], dispatch)
        }, setState(obj[0]))
      }
    } else {
      setState(obj)
    }
  }

  var eventProxy = function(event) {
    dispatch(event.currentTarget.events[event.type], event)
  }

  var render = function() {
    stateLock = false
    if (subs) lastSub = patchSubs(subs(state), lastSub, dispatch)
    if (view) {
      element = patch(
        container,
        element,
        oldNode,
        (oldNode = view(state)),
        eventProxy
      )
    }
  }

  dispatch(props.init || {})
}
