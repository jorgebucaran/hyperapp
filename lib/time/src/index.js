var fx = function(props, dispatch) {
  var id = setInterval(function() {
    dispatch(props.action, Date.now())
  }, props.interval)
  return function() {
    clearInterval(id)
  }
}

export var every = function(props) {
  return [fx, props]
}
