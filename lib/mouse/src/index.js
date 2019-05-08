var fx = function(props, dispatch) {
  var eventListener = function(event) {
    dispatch(props.action, event)
  }
  addEventListener("mousemove", eventListener)
  return function() {
    removeEventListener("mousemove", eventListener)
  }
}

export var onMouseMove = function(props) {
  return [fx, props]
}
