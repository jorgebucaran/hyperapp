var fx = function(a) {
  return function(b) {
    return [a, b]
  }
}

export var request = fx((dispatch, props) => {
  var url = props.url
  var action = props.action
  var options = props.options || {}
  var expect = props.expect || "text"

  return fetch(url, options)
    .then(function(response) {
      if (!response.ok) {
        throw response
      }
      return response
    })
    .then(function(body) {
      return body[expect]()
    })
    .then(function(result) {
      dispatch(action, result)
    })
    .catch(function(error) {
      dispatch(action, error)
    })
})
