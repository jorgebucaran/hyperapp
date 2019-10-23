var fx = function(a) {
  return function(b) {
    return [a, b]
  }
}
export var get = fx((dispatch, props) => {})
