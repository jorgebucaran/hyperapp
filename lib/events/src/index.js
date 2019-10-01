var throttledEvent = function(name) {}

var fx = function(a) {
  return function(b) {
    return [a, b]
  }
}

var rawEvent = function(name) {
  return (function(fx) {
    return function(action) {
      return [fx, { action: action }]
    }
  })(function(dispatch, props) {
    var listener = function(event) {
      dispatch(props.action, event)
    }
    addEventListener(name, listener)
    return function() {
      removeEventListener(name, listener)
    }
  })
}

// CustomEvents
export var dispatchCustomEvent = fx(function(_, props) {
  dispatchEvent(
    new CustomEvent(props.name, {
      detail: props
    })
  )
})

export var createOnCustomEvent = function(eventName) {
  return rawEvent(eventName)
}

export var eventDetail = function(event) {
  return event.detail
}

// AnimationFrame
export var onAnimationFrame = (function(fx) {
  return function(action) {
    return [fx, { action: action }]
  }
})(function(dispatch, props) {
  var id = requestAnimationFrame(function frame(timestamp) {
    id = requestAnimationFrame(frame)
    dispatch(props.action, timestamp)
  })
  return function() {
    cancelAnimationFrame(id)
  }
})

// Mouse
export var onMouseUp = rawEvent("mouseup")
export var onMouseDown = rawEvent("mousedown")
export var onMouseEnter = rawEvent("mouseenter")
export var onMouseLeave = rawEvent("mouseleave")
export var onMouseMove = rawEvent("mousemove")
export var onMouseOver = rawEvent("mouseover")
export var onMouseOut = rawEvent("mouseout")

// Touch
export var onTouchStart = rawEvent("touchstart")
export var onTouchMove = rawEvent("touchmove")
export var onTouchEnd = rawEvent("touchend")

// Keyboard
export var onKeyDown = rawEvent("keydown")
export var onKeyUp = rawEvent("keyup")

// Window
export var onFocus = rawEvent("focus")
export var onBlur = rawEvent("blur")

// Event options
export var eventOptions = (function(fx) {
  return function(props) {
    return [fx, props]
  }
})(function(dispatch, props) {
  if (props.preventDefault) props.event.preventDefault()
  if (props.stopPropagation) props.event.stopPropagation()
  if (props.action != undefined) dispatch(props.action, props.event)
})

export var preventDefault = function(action) {
  return function(state, event) {
    return [
      state,
      eventOptions({ preventDefault: true, action: action, event: event })
    ]
  }
}

export var stopPropagation = function(action) {
  return function(state, event) {
    return [
      state,
      eventOptions({ stopPropagation: true, action: action, event: event })
    ]
  }
}

// Other
export var eventKey = function(event) {
  return event.key
}

export var targetValue = function(event) {
  return event.target.value
}

export var targetChecked = function(event) {
  return event.target.checked
}
