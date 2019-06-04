var fx = function(a) {
  return function(b) {
    return [a, b]
  }
}

var throttledEvent = function(name) {}

var rawEvent = function(name) {
  return fx(function(dispatch, action) {
    var listener = function(event) {
      dispatch(action, event)
    }
    addEventListener(name, listener)
    return function() {
      removeEventListener(name, listener)
    }
  })
}

// Mouse
export var onMouseEnter = rawEvent("mouseenter")
export var onMouseLeave = rawEvent("mouseleave")
export var onMouseMove = rawEvent("mousemove")
export var onMouseOut = rawEvent("mouseout")
export var onMouseOver = rawEvent("mouseover")
export var onMouseUp = rawEvent("mouseup")

// Keyboard
export var onKeyDown = rawEvent("keydown")
export var onKeyUp = rawEvent("keyup")

// Window
export var onFocus = rawEvent("focus")
export var onBlur = rawEvent("blur")

// AnimationFrame
export var onAnimationFrame = fx(function(dispatch, action) {
  var id = requestAnimationFrame(function frame(timestamp) {
    dispatch(action, timestamp)
    id = requestAnimationFrame(frame)
  })
  return function() {
    cancelAnimationFrame(id)
  }
})

// Other
export var eventKey = event => event.key
export var targetChecked = event => event.target.checked
export var targetValue = event => event.target.value

export var eventOptions = fx(function(_, props, event) {
  for (var key in props) {
    if (props[key]) event[key]()
  }
})

export var preventDefault = [
  function(_, props, event) {
    if (props == null || props === true) event.preventDefault()
  }
]

export var stopPropagation = [
  function(_, props, event) {
    if (props == null || props === true) event.stopPropagation()
  }
]
