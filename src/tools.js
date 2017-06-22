function merge(a, b) {
  var obj = {}

  if (typeof b !== "object" || Array.isArray(b)) {
    return b
  }

  for (var i in a) {
    obj[i] = a[i]
  }
  for (var i in b) {
    obj[i] = b[i]
  }

  return obj
}

function mediator() {

}

export {
  merge,
  mediator
}
