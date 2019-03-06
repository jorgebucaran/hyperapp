var EMPTY_OBJECT = {}
var EMPTY_ARRAY = []
var map = EMPTY_ARRAY.map
var isArray = Array.isArray

var SVG_NS = "http://www.w3.org/2000/svg"
var DEFAULT_NODE = 0
var RECYCLED_NODE = 1
var LAZY_NODE = 2
var TEXT_NODE = 3

var defer =
  typeof Promise === "function"
    ? function(cb) {
        Promise.resolve().then(cb)
      }
    : setTimeout

var merge = function(a, b) {
  var out = {}

  for (var i in a) out[i] = a[i]
  for (var i in b) out[i] = b[i]

  return out
}

function createClass(obj) {
  var out = ""
  var tmp = typeof obj

  if (tmp === "string" || tmp === "number") return obj

  if (isArray(obj) && obj.length > 0) {
    for (var i = 0; i < obj.length; i++) {
      if ((tmp = createClass(obj[i])) !== "") out += (out && " ") + tmp
    }
  } else {
    for (var i in obj) {
      if (obj[i]) out += (out && " ") + i
    }
  }

  return out
}

var updateProperty = function(element, name, value, newValue, cb, isSvg) {
  if (name === "key") {
  } else if (name === "style") {
    for (var i in merge(value, newValue)) {
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
        element.removeEventListener(name, cb)
      } else if (!value) {
        element.addEventListener(name, cb)
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

var removeElement = function(parent, node) {
  parent.removeChild(node.element)
}

var createElement = function(node, cb, isSvg) {
  var element =
    node.type === TEXT_NODE
      ? document.createTextNode(node.name)
      : (isSvg = isSvg || node.name === "svg")
      ? document.createElementNS(SVG_NS, node.name)
      : document.createElement(node.name)

  for (var i = 0, len = node.children.length; i < len; i++) {
    element.appendChild(
      createElement((node.children[i] = getNode(node.children[i])), cb, isSvg)
    )
  }

  var props = node.props
  for (var k in props) {
    updateProperty(element, k, null, props[k], cb, isSvg)
  }

  return (node.element = element)
}

var updateElement = function(element, props, newProps, cb, isSvg) {
  for (var k in merge(props, newProps)) {
    if (
      (k === "value" || k === "checked" ? element[k] : props[k]) !== newProps[k]
    ) {
      updateProperty(element, k, props[k], newProps[k], cb, isSvg)
    }
  }
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

var patchElement = function(parent, element, node, newNode, cb, isSvg) {
  if (newNode === node) {
  } else if (
    node != null &&
    node.type === TEXT_NODE &&
    newNode.type === TEXT_NODE
  ) {
    if (node.name !== newNode.name) {
      element.nodeValue = newNode.name
    }
  } else if (node == null || node.name !== newNode.name) {
    var newElement = parent.insertBefore(
      createElement((newNode = getNode(newNode)), cb, isSvg),
      element
    )

    if (node != null) removeElement(parent, node)

    element = newElement
  } else {
    updateElement(
      element,
      node.props,
      newNode.props,
      cb,
      (isSvg = isSvg || newNode.name === "svg")
    )

    var savedNode
    var childNode

    var key
    var children = node.children
    var start = 0
    var end = children.length - 1

    var newKey
    var newChildren = newNode.children
    var newStart = 0
    var newEnd = newChildren.length - 1

    while (newStart <= newEnd && start <= end) {
      key = getKey(children[start])
      newKey = getKey(newChildren[newStart])

      if (key == null || key !== newKey) break

      patchElement(
        element,
        children[start].element,
        children[start],
        (newChildren[newStart] = getNode(
          newChildren[newStart],
          children[start]
        )),
        cb,
        isSvg
      )

      start++
      newStart++
    }

    while (newStart <= newEnd && start <= end) {
      key = getKey(children[end])
      newKey = getKey(newChildren[newEnd])

      if (key == null || key !== newKey) break

      patchElement(
        element,
        children[end].element,
        children[end],
        (newChildren[newEnd] = getNode(newChildren[newEnd], children[end])),
        cb,
        isSvg
      )

      end--
      newEnd--
    }

    if (start > end) {
      while (newStart <= newEnd) {
        element.insertBefore(
          createElement(
            (newChildren[newStart] = getNode(newChildren[newStart++])),
            cb,
            isSvg
          ),
          (childNode = children[start]) && childNode.element
        )
      }
    } else if (newStart > newEnd) {
      while (start <= end) {
        removeElement(element, children[start++])
      }
    } else {
      var keyed = createKeyMap(children, start, end)
      var newKeyed = {}

      while (newStart <= newEnd) {
        key = getKey((childNode = children[start]))
        newKey = getKey(
          (newChildren[newStart] = getNode(newChildren[newStart], childNode))
        )

        if (
          newKeyed[key] ||
          (newKey != null && newKey === getKey(children[start + 1]))
        ) {
          if (key == null) {
            removeElement(element, childNode)
          }
          start++
          continue
        }

        if (newKey == null || node.type === RECYCLED_NODE) {
          if (key == null) {
            patchElement(
              element,
              childNode && childNode.element,
              childNode,
              newChildren[newStart],
              cb,
              isSvg
            )
            newStart++
          }
          start++
        } else {
          if (key === newKey) {
            patchElement(
              element,
              childNode.element,
              childNode,
              newChildren[newStart],
              cb,
              isSvg
            )
            newKeyed[newKey] = true
            start++
          } else {
            if ((savedNode = keyed[newKey]) != null) {
              patchElement(
                element,
                element.insertBefore(
                  savedNode.element,
                  childNode && childNode.element
                ),
                savedNode,
                newChildren[newStart],
                cb,
                isSvg
              )
              newKeyed[newKey] = true
            } else {
              patchElement(
                element,
                childNode && childNode.element,
                null,
                newChildren[newStart],
                cb,
                isSvg
              )
            }
          }
          newStart++
        }
      }

      while (start <= end) {
        if (getKey((childNode = children[start++])) == null) {
          removeElement(element, childNode)
        }
      }

      for (var key in keyed) {
        if (newKeyed[key] == null) {
          removeElement(element, keyed[key])
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

var getNode = function(newNode, node) {
  return newNode.type === LAZY_NODE
    ? !node || shouldUpdate(newNode.lazy, node.lazy)
      ? newNode.render()
      : node
    : newNode
}

var createVNode = function(name, props, children, element, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    element: element,
    type: type,
    key: key
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

var patch = function(container, element, node, newNode, cb) {
  return (element = patchElement(container, element, node, newNode, cb))
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
  for (var node, rest = [], children = [], i = arguments.length; i-- > 2; ) {
    rest.push(arguments[i])
  }

  for (; rest.length > 0; ) {
    if (isArray((node = rest.pop()))) {
      for (i = node.length; i-- > 0; ) rest.push(node[i])
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

var patchSub = function(sub, newSub, dispatch) {
  if (
    (newSub && (!newSub[0] || isArray(newSub[0]))) ||
    (sub && (!sub[0] || isArray(sub[0])))
  ) {
    var out = []
    var subs = sub ? sub : [sub]
    var newSubs = newSub ? newSub : [newSub]

    for (var i = 0; i < newSubs.length || i < subs.length; i++) {
      out.push(patchSub(subs[i], newSubs[i], dispatch))
    }

    return out
  }

  return newSub
    ? !sub || newSub[0] !== sub[0] || shouldRestart(newSub[1], sub[1])
      ? [newSub[0], newSub[1], newSub[0](newSub[1], dispatch), sub && sub[2]()]
      : sub
    : sub && sub[2]()
}

export function app(props) {
  var container = props.container
  var element = container && container.children[0]
  var node = element && recycleElement(element)
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

  var cb = function(event) {
    dispatch(event.currentTarget.events[event.type], event)
  }

  var render = function() {
    renderLock = false
    if (subs) sub = patchSub(sub, subs(state), dispatch)
    if (view) {
      element = patch(container, element, node, (node = view(state)), cb)
    }
  }

  dispatch(props.init || {})
}
