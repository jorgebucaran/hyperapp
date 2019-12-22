var RECYCLED_NODE = 1
var LAZY_NODE = 2
var TEXT_NODE = 3
var EMPTY_OBJ = {}
var EMPTY_ARR = []
var map = EMPTY_ARR.map
var isArray = Array.isArray
var defer =
  typeof requestAnimationFrame !== "undefined"
    ? requestAnimationFrame
    : setTimeout

var createClass = function(obj) {
  var out = ""

  if (typeof obj === "string") return obj

  if (isArray(obj) && obj.length > 0) {
    for (var k = 0, tmp; k < obj.length; k++) {
      if ((tmp = createClass(obj[k])) !== "") {
        out += (out && " ") + tmp
      }
    }
  } else {
    for (var k in obj) {
      if (obj[k]) {
        out += (out && " ") + k
      }
    }
  }

  return out
}

var merge = function(a, b) {
  var out = {}

  for (var k in a) out[k] = a[k]
  for (var k in b) out[k] = b[k]

  return out
}

var batch = function(list) {
  return list.reduce(function(out, item) {
    return out.concat(
      !item || item === true
        ? 0
        : typeof item[0] === "function"
        ? [item]
        : batch(item)
    )
  }, EMPTY_ARR)
}

var isSameAction = function(a, b) {
  return isArray(a) && isArray(b) && a[0] === b[0] && typeof a[0] === "function"
}

var shouldRestart = function(a, b) {
  if (a !== b) {
    for (var k in merge(a, b)) {
      if (a[k] !== b[k] && !isSameAction(a[k], b[k])) return true
      b[k] = a[k]
    }
  }
}

var patchSubs = function(oldSubs, newSubs, dispatch) {
  for (
    var i = 0, oldSub, newSub, subs = [];
    i < oldSubs.length || i < newSubs.length;
    i++
  ) {
    oldSub = oldSubs[i]
    newSub = newSubs[i]
    subs.push(
      newSub
        ? !oldSub ||
          newSub[0] !== oldSub[0] ||
          shouldRestart(newSub[1], oldSub[1])
          ? [
              newSub[0],
              newSub[1],
              newSub[0](dispatch, newSub[1]),
              oldSub && oldSub[2]()
            ]
          : oldSub
        : oldSub && oldSub[2]()
    )
  }
  return subs
}

var patchProperty = function(node, key, oldValue, newValue, listener, isSvg) {
  if (key === "key") {
  } else if (key === "style") {
    for (var k in merge(oldValue, newValue)) {
      oldValue = newValue == null || newValue[k] == null ? "" : newValue[k]
      if (k[0] === "-") {
        node[key].setProperty(k, oldValue)
      } else {
        node[key][k] = oldValue
      }
    }
  } else if (key[0] === "o" && key[1] === "n") {
    if (
      !((node.actions || (node.actions = {}))[
        (key = key.slice(2).toLowerCase())
      ] = newValue)
    ) {
      node.removeEventListener(key, listener)
    } else if (!oldValue) {
      node.addEventListener(key, listener)
    }
  } else if (!isSvg && key !== "list" && key in node) {
    node[key] = newValue == null ? "" : newValue
  } else if (
    newValue == null ||
    newValue === false ||
    (key === "class" && !(newValue = createClass(newValue)))
  ) {
    node.removeAttribute(key)
  } else {
    node.setAttribute(key, newValue)
  }
}

var createNode = function(vdom, listener, isSvg) {
  var ns = "http://www.w3.org/2000/svg"
  var props = vdom.props
  var node =
    vdom.type === TEXT_NODE
      ? document.createTextNode(vdom.name)
      : (isSvg = isSvg || vdom.name === "svg")
      ? document.createElementNS(ns, vdom.name, { is: props.is })
      : document.createElement(vdom.name, { is: props.is })

  for (var k in props) {
    patchProperty(node, k, null, props[k], listener, isSvg)
  }

  var ptcKids = vdom.children.map(child => {
    const childPtc = createNode(
		getVNode(child),
        listener,
        isSvg
      )
	node.appendChild(childPtc[0])
	return childPtc
  })
  return [node, ptcKids, vdom]
}

var getKey = function(vdom) {
  return vdom == null ? null : vdom.key
}

var patch = function(parent, node, oldPtc, newVNode, listener, isSvg) {
  var oldNode = oldPtc && oldPtc[0]
  var oldVNode = oldPtc && oldPtc[2]
  var oldPtcKids = oldPtc && oldPtc[1]
  
  var ptcKids = new Array(newVNode.children.length)
  if (oldVNode === newVNode) {
	  return oldPtc
  } else if (
    oldVNode != null &&
    oldVNode.type === TEXT_NODE &&
    newVNode.type === TEXT_NODE
  ) {
    if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name
  } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
	oldPtc = createNode(newVNode, listener, isSvg)
	parent.insertBefore(oldPtc[0], node)
	if (oldNode != null) {
	  parent.removeChild(oldNode)
	}
	return oldPtc
  } else {
    var tmpPtcKid
    var tmpVKid
    var oldPtcKid

    var oldKey
    var newKey

    var oldVProps = oldVNode.props
    var newVProps = newVNode.props

    var newVKids = newVNode.children

    var oldHead = 0
    var newHead = 0
    var oldTail = oldPtcKids.length - 1
    var newTail = newVKids.length - 1

    isSvg = isSvg || newVNode.name === "svg"

    for (var i in merge(oldVProps, newVProps)) {
      if (
        (i === "value" || i === "selected" || i === "checked"
          ? node[i]
          : oldVProps[i]) !== newVProps[i]
      ) {
        patchProperty(node, i, oldVProps[i], newVProps[i], listener, isSvg)
      }
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldPtcKids[oldHead][2])) == null ||
        oldKey !== getKey(newVKids[newHead])
      ) {
        break
      }

      ptcKids[newHead] = patch(
        node,
		oldPtcKids[oldHead][0],
        oldPtcKids[oldHead],
        getVNode(
          newVKids[newHead],
          oldPtcKids[oldHead][2]
        ),
        listener,
        isSvg
      )
	  oldHead++
	  newHead++
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldPtcKids[oldTail][2])) == null ||
        oldKey !== getKey(newVKids[newTail]) 
      ) {
        break
      }

      ptcKids[newTail] = patch(
        node,
        oldPtcKids[oldTail][0],
        oldPtcKids[oldTail],
        getVNode(
          newVKids[newTail], 
          oldPtcKids[oldTail][2]
        ),
        listener,
        isSvg
      )
	  newTail--
	  oldTail--
    }

    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        node.insertBefore(
          (ptcKids[newHead] = createNode(
            getVNode(newVKids[newHead]),
            listener,
            isSvg
          ))[0],
          (oldPtcKid = oldPtcKids[oldHead]) && oldPtcKid[0]
        )
		newHead++
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        node.removeChild(oldPtcKids[oldHead++][0])
      }
    } else {
      for (var i = oldHead, keyed = {}, newKeyed = {}; i <= oldTail; i++) {
        if ((oldKey = oldPtcKids[i][2].key) != null) {
          keyed[oldKey] = oldPtcKids[i]
        }
      }

      while (newHead <= newTail) {
        oldPtcKid = oldPtcKids[oldHead]
        oldKey = getKey(oldPtcKid && oldPtcKid[2])
        newKey = getKey(tmpVKid = getVNode(newVKids[newHead], oldPtcKid && oldPtcKid[2]))

        if (
          newKeyed[oldKey] ||
          (newKey != null && newKey === getKey(oldPtcKids[oldHead + 1][2]))
        ) {
          if (oldKey == null) {
            node.removeChild(oldPtcKid[0])
          }
          oldHead++
          continue
        }

        if (newKey == null || oldVNode.type === RECYCLED_NODE) {
          if (oldKey == null) {
            ptcKids[newHead] = patch(
              node,
              oldPtcKid && oldPtcKid[0],
              oldPtcKid,
              tmpVKid,
              listener,
              isSvg
            )
            newHead++
          }
          oldHead++
        } else {
          if (oldKey === newKey) {
			ptcKids[newHead] = patch(
              node,
              oldPtcKid[0],
              oldPtcKid,
              tmpVKid,
              listener,
              isSvg
            )
            newKeyed[newKey] = true
            oldHead++
          } else {
            if ((tmpPtcKid = keyed[newKey]) != null) {
              ptcKids[newHead] = patch(
                node,
                node.insertBefore(tmpPtcKid[0], oldPtcKid && oldPtcKid[0]),
                tmpPtcKid,
                newVKids[newHead],
                listener,
                isSvg
              )
              newKeyed[newKey] = true
            } else {
              ptcKids[newHead] = patch(
                node,
                oldPtcKid && oldPtcKid[0],
                null,
                newVKids[newHead],
                listener,
                isSvg
              )
            }
          }
          newHead++
        }
      }

      while (oldHead <= oldTail) {
        if (getKey((oldPtcKid = oldPtcKids[oldHead++])[2]) == null) {
          node.removeChild(oldPtcKid[0])
        }
      }

      for (var i in keyed) {
        if (newKeyed[i] == null) {
          node.removeChild(keyed[i][0])
        }
      }
    }
  }
  return [node, ptcKids, newVNode]
}

var propsChanged = function(a, b) {
  for (var k in a) if (a[k] !== b[k]) return true
  for (var k in b) if (a[k] !== b[k]) return true
}

var getTextVNode = function(node) {
  return typeof node === "object" ? node : createTextVNode(node)
}

var getVNode = function(newVNode, oldVNode) {
    return newVNode.type === LAZY_NODE
      ? ((!oldVNode ||
          (oldVNode.type !== LAZY_NODE ||
            propsChanged(oldVNode.lazy, newVNode.lazy))) &&
          ((oldVNode = getTextVNode(newVNode.lazy.view(newVNode.lazy))).lazy =
            newVNode.lazy),
        oldVNode)
      : newVNode
  }

var createVNode = function(name, props, children, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    type: type,
    key: key
  }
}

var createTextVNode = function(value) {
  return createVNode(value, EMPTY_OBJ, EMPTY_ARR, undefined, TEXT_NODE)
}

var recycleNode = function(node) {
  if (node.nodeType === TEXT_NODE)
    return [node, null, createTextVNode(node.nodeValue, node)]
  else {
    var ptcKids = map.call(node.childNodes, recycleNode)
    var vdom = createVNode(
      node.nodeName.toLowerCase(),
      EMPTY_OBJ,
      ptcKids.map(k => k[2]),
      undefined,
      RECYCLED_NODE
    )
    return [node, ptcKids, vdom]
  }
}

export var Lazy = function(props) {
  return {
    lazy: props,
    type: LAZY_NODE
  }
}

export var h = function(name, props) {
  for (var vdom, rest = [], children = [], i = arguments.length; i-- > 2; ) {
    rest.push(arguments[i])
  }

  while (rest.length > 0) {
    if (isArray((vdom = rest.pop()))) {
      for (var i = vdom.length; i-- > 0; ) {
        rest.push(vdom[i])
      }
    } else if (vdom === false || vdom === true || vdom == null) {
    } else {
      children.push(getTextVNode(vdom))
    }
  }

  props = props || EMPTY_OBJ

  return typeof name === "function"
    ? name(props, children)
    : createVNode(name, props, children, props.key)
}

export var app = function(props) {
  var state = {}
  var lock = false
  var view = props.view
  var node = props.node 
  var ptc = recycleNode(node)
  var subscriptions = props.subscriptions
  var subs = []


  var listener = function(event) {
    dispatch(this.actions[event.type], event)
  }

  var setState = function(newState) {
    if (state !== newState) {
      state = newState
      if (subscriptions) {
        subs = patchSubs(subs, batch([subscriptions(state)]), dispatch)
      }
      if (view && !lock) defer(render, (lock = true))
    }
    return state
  }

  var dispatch = (props.middleware ||
    function(obj) {
      return obj
    })(function(action, props) {
    return typeof action === "function"
      ? dispatch(action(state, props))
      : isArray(action)
      ? typeof action[0] === "function" || isArray(action[0])
        ? dispatch(
            action[0],
            typeof action[1] === "function" ? action[1](props) : action[1]
          )
        : (batch(action.slice(1)).map(function(fx) {
            fx && fx[0](dispatch, fx[1])
          }, setState(action[0])),
          state)
      : setState(action)
  })

  var render = function() {
    lock = false
    ptc = patch(
      node.parentNode,
      node,
      ptc,
      getTextVNode(view(state)),
      listener
    )
  }

  dispatch(props.init)
}