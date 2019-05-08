var fx = function(props, dispatch) {
  var eventListener = function(event) {
    dispatch(props.action, event)
  }
  addEventListener("keydown", eventListener)
  return function() {
    removeEventListener("keydown", eventListener)
  }
}

export var onKeyDown = function(props) {
  return [fx, props]
}
