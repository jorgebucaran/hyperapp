var DEFAULT = 0
var RECYCLED_NODE = 1
var TEXT_NODE = 3 // Node.TEXT_NODE

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
  var element = container && container.children && container.children[0]
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

  if (ENVIRONMENT === 'development') {
    var overrides = makeDebugger(setState, dispatch, eventProxy);
    dispatch = overrides.dispatch
    setState = overrides.setState
    eventProxy = overrides.eventProxy
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

function makeDebugger(setState, dispatch, eventProxy) {
  var debugWindow = window.open(
    "",
    "hyperappDebugger",
    "dependent=yes,alwaysRaised=yes,dialog=yes,width=350,height=500,left=0,bottom=0"
  );

  var title = debugWindow.document.createElement('title')
  title.innerText = 'Hyperapp Debugger'
  debugWindow.document.head.appendChild(title)

  debugWindow.document.body.style.padding = '0'
  debugWindow.document.body.style.margin = '0'
  debugWindow.document.body.style.boxSizing = 'border-box'

  var makeStream = function() {
    var actionState = { action: { name: '<init>' } }
    var listener = null
    var pending = []

    var setCurrentAction = function(action, data) {
      if (typeof action === 'function' && typeof actionState.action === 'undefined') {
        actionState.action = action
        actionState.actionData = data
      }
    }

    var setCurrentState = function(state) {
      if (actionState.action && typeof actionState.state === 'undefined') {
        actionState.state = state
        pending.push(actionState)

        if (listener) {
          listener(actionState)
        }

        actionState = {}
      }
    }

    return {
      setAction: setCurrentAction,
      setState: setCurrentState,
      listen: function(cb) {
        listener = cb
        pending.forEach(function(p) { listener(p) })
        pending = []
        return function() {
          if (listener === cb) {
            listener = null
          }
        }
      }
    }
  }

  var stream = makeStream();

  var wrappedSetState = function(nextState) {
    stream.setState(nextState)
    return setState(nextState)
  }

  var wrappedDispatch = function(obj, data) {
    stream.setAction(obj)

    return dispatch(obj, data)
  }

  var wrappedEventProxy = function(event) {
    return eventProxy(event)
  }

  var streamSubFx = function(args, dispatch) {
    var fire = function(actionState) {
      dispatch(args.action, actionState)
    }

    var cancel = stream.listen(fire)

    return function() {
      cancel()
    }
  }

  var addHistoryAction = function(state, actionState) {
    var nextHistory = state.history.concat(actionState)
    return merge(state, {
      history: nextHistory,
      currentTime: -1,
    })
  }

  var setCurrentTimeAction = function(state, event) {
    var currentTime = parseInt(event.target.value, 10);
    dispatch(function() { return state.history[currentTime].state }, {})
    return merge(state, {
      currentTime: currentTime,
    })
  }

  var setViewModeAction = function(state, event) {
    return merge(state, {
      view: event.target.value,
    })
  }

  var styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100vh',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    section: {
      boxSizing: 'border-box',
      width: '100%',
      padding: '1rem',
      paddingBottom: '0',
    },
    actionContainer: {
      boxSizing: 'border-box',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly'
    },
    timeLabel: {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box'
    },
    inputRange: {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
    },
    actionSelect: {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
    },
    stateContainer: {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      flexGrow: 1,
    },
    controlsContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '100%',
      boxSizing: 'border-box',
    }
  }

  var viewControlsView = function(view) {
    return h('section', { style: merge(styles.section, styles.controlsContainer) }, [
      h('label', null, ['State Mode ', h('select', { onChange: setViewModeAction }, [
        h('option', { value: 'by-time', selected: view === 'by-time' }, 'By Time'),
        h('option', { value: 'by-action', selected: view === 'by-action' }, 'By Action'),
      ])]),
    ])
  }

  var showStateView = function(time) {
    return h('section', { style: merge(styles.section, styles.stateContainer) }, [
      h('div', null, time ? time.action.name : [h('i', null, 'No Action')]),
      h('pre', null, time ? JSON.stringify(time.state, null, 2) : '')
    ])
  }

  var timeView = function(history, index, time, view) {
    return h(
      'div',
      { style: styles.container },
      [
        h('section', { style: styles.section }, [
          h('label', { style: styles.timeLabel }, [
            h('div', null, 'Time'),
            h('input', {
              key: history.length,
              type: 'range',
              value: index,
              min: 0,
              max: (history.length - 1),
              oninput: setCurrentTimeAction,
              style: styles.inputRange
            })
          ]),
        ]),
        showStateView(time),
        viewControlsView(view),
      ]
    )
  }

  var actionView = function(history, index, time, view) {
    var grouped = history.reduce(function (memo, currentHistory, index) {
      var last = memo.slice(-1)[0]
      var shouldAppend = last && last.actionName === currentHistory.action.name
      var current = merge(currentHistory, { index: index })

      return shouldAppend
        ? memo.slice(0, -1).concat(merge(last, { children: last.children.concat(current) }))
        : memo.concat({ actionName: current.action.name, children: [current] })
    }, [])

    var currentGroupIndex = grouped.findIndex(function(group) {
      return group.children.find(function(child) { return child.index === index })
    })

    var currentGroup = grouped[currentGroupIndex]

    return h(
      'div',
      { style: styles.container },
      [
        h('section', { style: merge(styles.section, styles.actionContainer) }, [
          h('select', { size: 10, onchange: setCurrentTimeAction, style: styles.actionSelect }, grouped.map(function(group, groupIndex) {
            return h('option', { value: group.children.slice(-1)[0].index, selected: currentGroupIndex === groupIndex }, group.actionName + ' (' + group.children.length + ')')
          })),
          h('select', { size: 10, onchange: setCurrentTimeAction, style: styles.actionSelect }, currentGroup.children.map(function(child, childIndex) {
            return h('option', { value: child.index, selected: child.index === index }, 'Diff ' + child.index.toString())
          })),
        ]),
        showStateView(time),
        viewControlsView(view),
      ]
    )
  }

  app({
    init: { history: [], currentTime: -1, view: 'by-time' },
    container: debugWindow.document.body,
    view: function(state) {
      var index = state.currentTime === -1
        ? state.history.length - 1
        : state.currentTime

      var time = state.history[index];

      return state.view === 'by-time'
        ? timeView(state.history, index, time)
        : actionView(state.history, index, time)
    },
    subscriptions: function(state) {
      return [
        { effect: streamSubFx, action: addHistoryAction }
      ]
    }
  })

  return {
    setState: wrappedSetState,
    dispatch: wrappedDispatch,
    eventProxy: wrappedEventProxy
  }
}
