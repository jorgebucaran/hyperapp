var fx = function(props, dispatch) {
  var id = setInterval(function() {
    dispatch(props.action, {
      time: Date.now()
    })
  }, props.interval)
  return function() {
    clearInterval(id)
  }
}

export var tick = function(props) {
  return [fx, props]
}
