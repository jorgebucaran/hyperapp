var timeFx = function(fx) {
  return function(action, props) {
    return [fx, { action: action, delay: props.delay }]
  }
}

export var timeout = timeFx(function(dispatch, props) {
  setTimeout(function() {
    dispatch(props.action)
  }, props.delay)
})

export var interval = timeFx(function(dispatch, props) {
  var id = setInterval(function() {
    dispatch(props.action, Date.now())
  }, props.delay)
  return function() {
    clearInterval(id)
  }
})


// export var now
// export var retry
// export var debounce
// export var throttle
// export var idleCallback?
