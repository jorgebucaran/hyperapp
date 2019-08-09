var isArray = Array.isArray

var randomFx = function(fx) {
  return function(action, generator) {
    return [fx, { action: action, generator: generator }]
  }
}

var id = function(any) {
  return any
}

var resolve = function(obj) {
  if (isArray(obj)) {
    return obj.map(resolve)
  } else if (typeof obj === "function") {
    return obj(Math.random())
  }
}

export var number = function(map) {
  return map || id
}

export var generate = randomFx(function(dispatch, props) {
  dispatch(props.action, resolve(props.generator))
})
