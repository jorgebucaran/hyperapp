var fx = function(a) {
  return function(b) {
    return [a, b]
  }
}

export var focus = fx(function(_, id) {
  document.getElementById(id).focus()
})

export var blur = fx(function(_, id) {
  document.getElementById(id).blur()
})
