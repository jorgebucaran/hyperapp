var DEFAULT_NODE = 0
var RECYCLED_NODE = 1
var LAZY_NODE = 2
var TEXT_NODE = 3

var SVG_NS = "http://www.w3.org/2000/svg"

var EMPTY_OBJECT = {}
var EMPTY_ARRAY = []

var map = EMPTY_ARRAY.map
var isArray = Array.isArray

var defer =
  typeof Promise === "function"
    ? function(cb) {
        Promise.resolve().then(cb)
      }
    : setTimeout

var merge = function(a, b) {
  var target = {}

  for (var i in a) target[i] = a[i]
  for (var i in b) target[i] = b[i]

  return target
}

function createClass(obj) {
  var tmp = typeof obj
  var out = ""

  if (tmp === "string" || tmp === "number") return obj || ""

  if (isArray(obj) && obj.length > 0) {
    for (var i = 0, length = obj.length; i < length; i++) {
      if ((tmp = createClass(obj[i])) !== "") out += (out && " ") + tmp
    }
  } else {
    for (var i in obj) {
      if (obj[i]) out += (out && " ") + i
    }
  }

  return out
}

var updateProperty = function(
  element,
  name,
  oldValue,
  newValue,
  eventCb,
  isSvg
) {
  if (name === "key") {
  } else if (name === "style") {
    for (var i in merge(oldValue, newValue)) {
      var style = newValue == null || newValue[i] == null ? "" : newValue[i]
      if (i[0] === "-") {
        element[name].setProperty(i, style)
      } else {
        element[name][i] = style
      }
    }
  } else {
    if (name[0] === "o" && name[1] === "n") {
      if (
        !((element.events || (element.events = {}))[
          (name = name.slice(2).toLowerCase())
        ] = newValue)
      ) {
        element.removeEventListener(name, eventCb)
      } else if (!oldValue) {
        element.addEventListener(name, eventCb)
      }
    } else if (name !== "list" && !isSvg && name in element) {
      element[name] = newValue == null ? "" : newValue
    } else if (
      newValue == null ||
      newValue === false ||
      (name === "class" && !(newValue = createClass(newValue)))
    ) {
      element.removeAttribute(name)
    } else {
      element.setAttribute(name, newValue)
    }
  }
}

var createElement = function(node, eventCb, isSvg) {
  var element =
    node.type === TEXT_NODE
      ? document.createTextNode(node.name)
      : (isSvg = isSvg || node.name === "svg")
      ? document.createElementNS(SVG_NS, node.name)
      : document.createElement(node.name)

  for (var i = 0, length = node.children.length; i < length; i++) {
    element.appendChild(
      createElement(
        (node.children[i] = resolveNode(node.children[i])),
        eventCb,
        isSvg
      )
    )
  }

  var props = node.props
  for (var name in props) {
    updateProperty(element, name, null, props[name], eventCb, isSvg)
  }

  return (node.element = element)
}

var updateElement = function(element, oldProps, newProps, eventCb, isSvg) {
  for (var name in merge(oldProps, newProps)) {
    if (
      (name === "value" || name === "checked"
        ? element[name]
        : oldProps[name]) !== newProps[name]
    ) {
      updateProperty(
        element,
        name,
        oldProps[name],
        newProps[name],
        eventCb,
        isSvg
      )
    }
  }
}

var removeElement = function(parent, node) {
  parent.removeChild(node.element)
}

var getKey = function(node) {
  return node == null ? null : node.key
}

var createKeyMap = function(children, start, end) {
  for (var out = {}, key, node; start <= end; start++) {
    if ((key = (node = children[start]).key) != null) {
      out[key] = node
    }
  }
  return out
}

var patchElement = function(parent, element, oldNode, newNode, eventCb, isSvg) {
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
      createElement((newNode = resolveNode(newNode)), eventCb, isSvg),
      element
    )

    if (oldNode != null) removeElement(parent, oldNode)

    element = newElement
  } else {
    updateElement(
      element,
      oldNode.props,
      newNode.props,
      eventCb,
      (isSvg = isSvg || newNode.name === "svg")
    )

    var savedNode
    var childNode

    var oldKey
    var oldChildren = oldNode.children
    var oldChStart = 0
    var oldChEnd = oldChildren.length - 1

    var newKey
    var newChildren = newNode.children
    var newChStart = 0
    var newChEnd = newChildren.length - 1

    while (newChStart <= newChEnd && oldChStart <= oldChEnd) {
      oldKey = getKey(oldChildren[oldChStart])
      newKey = getKey(newChildren[newChStart])

      if (oldKey == null || oldKey !== newKey) break

      patchElement(
        element,
        oldChildren[oldChStart].element,
        oldChildren[oldChStart],
        (newChildren[newChStart] = resolveNode(
          newChildren[newChStart],
          oldChildren[oldChStart]
        )),
        eventCb,
        isSvg
      )

      oldChStart++
      newChStart++
    }

    while (newChStart <= newChEnd && oldChStart <= oldChEnd) {
      oldKey = getKey(oldChildren[oldChEnd])
      newKey = getKey(newChildren[newChEnd])

      if (oldKey == null || oldKey !== newKey) break

      patchElement(
        element,
        oldChildren[oldChEnd].element,
        oldChildren[oldChEnd],
        (newChildren[newChEnd] = resolveNode(
          newChildren[newChEnd],
          oldChildren[oldChEnd]
        )),
        eventCb,
        isSvg
      )

      oldChEnd--
      newChEnd--
    }

    if (oldChStart > oldChEnd) {
      while (newChStart <= newChEnd) {
        element.insertBefore(
          createElement(
            (newChildren[newChStart] = resolveNode(newChildren[newChStart++])),
            eventCb,
            isSvg
          ),
          (childNode = oldChildren[oldChStart]) && childNode.element
        )
      }
    } else if (newChStart > newChEnd) {
      while (oldChStart <= oldChEnd) {
        removeElement(element, oldChildren[oldChStart++])
      }
    } else {
      var oldKeyed = createKeyMap(oldChildren, oldChStart, oldChEnd)
      var newKeyed = {}

      while (newChStart <= newChEnd) {
        oldKey = getKey((childNode = oldChildren[oldChStart]))
        newKey = getKey(
          (newChildren[newChStart] = resolveNode(
            newChildren[newChStart],
            childNode
          ))
        )

        if (
          newKeyed[oldKey] ||
          (newKey != null && newKey === getKey(oldChildren[oldChStart + 1]))
        ) {
          if (oldKey == null) {
            removeElement(element, childNode)
          }
          oldChStart++
          continue
        }

        if (newKey == null || oldNode.type === RECYCLED_NODE) {
          if (oldKey == null) {
            patchElement(
              element,
              childNode && childNode.element,
              childNode,
              newChildren[newChStart],
              eventCb,
              isSvg
            )
            newChStart++
          }
          oldChStart++
        } else {
          if (oldKey === newKey) {
            patchElement(
              element,
              childNode.element,
              childNode,
              newChildren[newChStart],
              eventCb,
              isSvg
            )
            newKeyed[newKey] = true
            oldChStart++
          } else {
            if ((savedNode = oldKeyed[newKey]) != null) {
              patchElement(
                element,
                element.insertBefore(
                  savedNode.element,
                  childNode && childNode.element
                ),
                savedNode,
                newChildren[newChStart],
                eventCb,
                isSvg
              )
              newKeyed[newKey] = true
            } else {
              patchElement(
                element,
                childNode && childNode.element,
                null,
                newChildren[newChStart],
                eventCb,
                isSvg
              )
            }
          }
          newChStart++
        }
      }

      while (oldChStart <= oldChEnd) {
        if (getKey((childNode = oldChildren[oldChStart++])) == null) {
          removeElement(element, childNode)
        }
      }

      for (var key in oldKeyed) {
        if (newKeyed[key] == null) {
          removeElement(element, oldKeyed[key])
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

var patch = function(container, element, oldNode, newNode, eventCb) {
  return (element = patchElement(container, element, oldNode, newNode, eventCb))
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

  props = props || EMPTY_OBJECT

  return typeof name === "function"
    ? name(props, children)
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

var patchSub = function(oldSub, newSub, dispatch) {
  if (
    (newSub && (!newSub[0] || isArray(newSub[0]))) ||
    (oldSub && (!oldSub[0] || isArray(oldSub[0])))
  ) {
    var subs = []
    var newSubs = newSub ? newSub : [newSub]
    var oldSubs = oldSub ? oldSub : [oldSub]

    for (var i = 0; i < newSubs.length || i < oldSubs.length; i++) {
      subs.push(patchSub(oldSubs[i], newSubs[i], dispatch))
    }

    return subs
  }

  return newSub
    ? !oldSub || newSub[0] !== oldSub[0] || shouldRestart(newSub[1], oldSub[1])
      ? [
          newSub[0],
          newSub[1],
          newSub[0](newSub[1], dispatch),
          oldSub && oldSub[2]()
        ]
      : oldSub
    : oldSub && oldSub[2]()
}

export function app(props) {
  var container = props.container
  var element = container && container.children[0]
  var oldNode = element && recycleElement(element)
  var subs = props.subscriptions
  var view = props.view
  var renderLock = false
  var state
  var sub

  var setState = function(newState) {
    if (!(state === newState || renderLock)) {
      defer(render, (renderLock = true))
    }
    state = newState
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

  var eventCb = function(event) {
    dispatch(event.currentTarget.events[event.type], event)
  }

  var render = function() {
    renderLock = false
    if (subs) sub = patchSub(sub, subs(state), dispatch)
    if (view) {
      element = patch(
        container,
        element,
        oldNode,
        (oldNode = view(state)),
        eventCb
      )
    }
  }

  dispatch(props.init || {})
}
