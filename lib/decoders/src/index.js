var compose = function(decoder){
  return function(fn){
    var next = fn || function(arg){ return arg }
    return function(){
      return decoder(next.apply(this, arguments))
    }
  }
}

export var preventDefault = compose(function(event){
  event.preventDefault()
  return event
})

export var stopPropagation = compose(function(event){
  event.stopPropagation()
  return event
})

export var formData = compose(function(event){
  var data = {}
  var form = new FormData(event.currentTarget)
  for(var prop of form.entries()) {
    data[prop[0]] = prop[1]
  }
  return data
})