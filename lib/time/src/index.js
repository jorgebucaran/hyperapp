var fx = function(a) {
  return function(b) {
    return [a, b]
  }
}

export var interval = fx(function(props, dispatch) {
  var id = setInterval(function() {
    dispatch(props.action, Date.now())
  }, props.delay)
  return function() {
    clearInterval(id)
  }
})

export var timeout = fx(function(props, dispatch) {
  setTimeout(function() {
    dispatch(props.action)
  }, props.delay)
})

// TODO
// now
// here
// retry
// debounce
// throttle
// idleCallback?
