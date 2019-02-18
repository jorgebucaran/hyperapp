var merge = function(a, b) {
  var target = {}

  for (var i in a) target[i] = a[i]
  for (var i in b) target[i] = b[i]

  return target
}

export function timeTravelDebugger(app, h, setState, dispatch) {
  var debugWindow = window.open(
    "",
    "hyperappDebugger",
    "dependent=yes,alwaysRaised=yes,dialog=yes,width=350,height=500,left=0,bottom=0"
  );

  var title = debugWindow.document.createElement('title')
  title.innerText = 'Hyperapp Debugger'
  debugWindow.document.head.appendChild(title)

  var debuggerCss = [
    "@import url('https://fonts.googleapis.com/css?family=Open+Sans');",
    "html, body { padding: 0; margin: 0; font-size: 16px; font-family: 'Open Sans', sans-serif; height: 100vh }",
    "* { box-sizing: border-box; }",
  ].join('\n')

  var styleSheet = debugWindow.document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.innerText = debuggerCss;

  debugWindow.document.head.appendChild(styleSheet)

  var makeStream = function() {
    var actionState = { actionName: '<init>' }
    var listener = null
    var pending = []

    var setCurrentAction = function(action, data) {
      if (typeof action === 'function' && typeof actionState.actionName === 'undefined') {
        actionState.actionName = action.name || 'unknownAction'
        if (!action.name) {
          console.warn('An action was ran, but the function name was anonymous. If you are using a function to generate an action, make sure you wrap the generator call in (state, arg) => generatorFn(...)(state, arg) to avoid this warning.');
        }
        actionState.actionData = data
      }
    }

    var setCurrentState = function(state) {
      if (actionState.actionName && typeof actionState.state === 'undefined') {
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

  var streamSubFx = function(args, dispatch) {
    var fire = function(actionState) {
      dispatch(args.action, actionState)
    }

    var cancel = stream.listen(fire)

    return function() {
      cancel()
    }
  }

  var dragAndDropSubFx = function(args, dispatch) {
    var updateHistory = function (file) {
      var reader = new FileReader()
      reader.onload = function(event) {
        var history = JSON.parse(event.target.result)
        dispatch(args.action, history)
      }
      reader.readAsText(file)
    }

    var onDragOver = function(event) {
      var dataTransfer = event.dataTransfer
      var hasFiles = (
        (dataTransfer.files && dataTransfer.files.length > 0)
        || (dataTransfer.types && Array.from(dataTransfer.types).indexOf('Files') >= 0)
      )

      if (hasFiles) {
        event.preventDefault();
      }
    }

    var onDrop = function(event) {
      event.preventDefault();
      for(var i = 0; i < event.dataTransfer.files.length; i++) {
        var file = event.dataTransfer.files[i]
        if (file.type === 'application/json') {
          updateHistory(file)
          break
        }
      }
    }

    debugWindow.document.body.addEventListener('dragover', onDragOver);
    debugWindow.document.body.addEventListener('drop', onDrop);

    return function() {
      debugWindow.document.body.removeEventListener('dragover', onDragOver);
      debugWindow.document.body.removeEventListener('drop', onDrop);
    }
  }

  var setHistoryAction = function(state, history) {
    var currentTime = history.length - 1

    dispatch(function() { return history[currentTime].state }, {})
    return merge(state, {
      history: history,
      currentTime: currentTime,
    })
  }

  var addHistoryAction = function(state, actionState) {
    var nextHistory = state.history.concat(actionState)
    return merge(state, {
      history: nextHistory,
      currentTime: nextHistory.length - 1,
    })
  }

  var setCurrentTimeAction = function(state, event) {
    var currentTime = parseInt(event.target.value, 10)

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
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    },
    section: {
      width: '100%',
      padding: '1rem',
      paddingBottom: '0',
    },
    actionContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly'
    },
    timeLabel: {
      display: 'block',
      width: '100%',
    },
    inputRange: {
      display: 'block',
      width: '100%',
    },
    actionSelect: {
      display: 'block',
      width: '100%',
    },
    stateContainer: {
      display: 'block',
      width: '100%',
      flexGrow: 1,
    },
    controlsContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: '100%',
    },
    jsonString: {
      color: 'red',
    },
    jsonNumber: {
      color: 'blue',
    },
  }

  var viewControlsView = function(history, view) {
    var dataUrl = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history))
    return h('section', { style: merge(styles.section, styles.controlsContainer) }, [
      h('select', { onChange: setViewModeAction }, [
        h('option', { value: 'by-time', selected: view === 'by-time' }, 'History By Time'),
        h('option', { value: 'by-action', selected: view === 'by-action' }, 'History By Action'),
      ]),
      h('div', null, [
        h('a', { href: dataUrl, download: 'history.json' }, 'Save History'),
      ])
    ])
  }

  var indentView = function(children) {
    return h('div', { style: { paddingLeft: '0.5rem' } }, children);
  }

  var showVariableView = function(variable, key) {
    var showKey = function() {
      return key ? h('strong', null, key + ': ') : '' 
    }
    if (Array.isArray(variable)) {
      return h(
        'div',
        null,
        [
          showKey,
          '[',
          indentView(variable.map(function (value, index) { return showVariableView(value, index) })),
          ']'
        ]
      )
    } else if (variable === null || typeof variable !== 'object') {
      var isString = typeof variable === 'string'
      var wrap = isString ? '"' : '';
      return h(
        'div',
        null,
        [
          showKey(),
          h(
            'span',
            {
              style: isString ? styles.jsonString : styles.jsonNumber,
            },
            [
              wrap,
              variable.toString(),
              wrap,
            ],
          )
        ]
      )
    } else if (typeof variable === 'undefined') {
      return null;
    } else {
      return h(
        'div',
        null,
        [
          showKey(),
          '{',
          indentView(Object.keys(variable).map(function (key) { return showVariableView(variable[key], key) })),
          '}'
        ]
      )
    }
  }

  var showStateView = function(time) {
    return h('section', { style: merge(styles.section, styles.stateContainer) }, [
      h('div', null, time ? time.actionName : [h('i', null, 'No Action')]),
      showVariableView(time.state, 'state'),
    ])
  }

  var timeView = function(history, index, time, view) {
    var value = index
    var max = history.length - 1
    return h(
      'div',
      { style: styles.container },
      [
        h('section', { style: styles.section }, [
          h('label', { style: styles.timeLabel }, [
            h('div', null, 'Time'),
            h('input', {
              key: max,
              type: 'range',
              value: value,
              min: 0,
              max: max,
              oninput: setCurrentTimeAction,
              style: styles.inputRange
            })
          ]),
        ]),
        showStateView(time),
        viewControlsView(history, view),
      ]
    )
  }

  var actionView = function(history, index, time, view) {
    var grouped = history.reduce(function (memo, currentHistory, index) {
      var last = memo.slice(-1)[0]
      var shouldAppend = last && last.actionName === currentHistory.actionName
      var current = merge(currentHistory, { index: index })

      return shouldAppend
        ? memo.slice(0, -1).concat(merge(last, { children: last.children.concat(current) }))
        : memo.concat({ actionName: current.actionName, children: [current] })
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
        viewControlsView(history, view),
      ]
    )
  }

  app({
    init: { history: [], currentTime: -1, view: 'by-time' },
    container: debugWindow.document.body,
    view: function(state) {
      var time = state.history[state.currentTime] || { state: {} };

      return state.view === 'by-time'
        ? timeView(state.history, state.currentTime, time)
        : actionView(state.history, state.currentTime, time)
    },
    subscriptions: function(state) {
      return [
        { effect: streamSubFx, action: addHistoryAction },
        { effect: dragAndDropSubFx, action: setHistoryAction }
      ]
    },
    timeTravelDebugger: false,
  })

  return {
    setState: wrappedSetState,
    dispatch: wrappedDispatch
  }
}
