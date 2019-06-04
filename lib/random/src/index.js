var isArray = Array.isArray

var randomFx = function(fx) {
  return function(action, generator) {
    return [fx, { action: action, generator: generator }]
  }
}

var id = function(any) {
  return any
}

var toRandom = function(obj) {
  if (isArray(obj)) {
    return obj.map(toRandom)
  } else if (typeof obj !== "object") {
  } else if (obj.type === 0) {
    return obj.map(Math.random())
  }
}

export var number = function(map) {
  return { type: 0, map: map || id }
}

export var generate = randomFx(function(dispatch, props) {
  dispatch(props.action, toRandom(props.generator))
})
