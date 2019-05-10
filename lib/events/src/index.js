var fx = function(a) {
  return function(b) {
    return [a, b]
  }
}

var throttledEvent = function(name) {}

var rawEvent = function(name) {
  return fx(function(action, dispatch) {
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
export var onAnimationFrame
