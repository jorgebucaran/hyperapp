function isValid(val) {
  return (val != null && val !== true && val !== false)
}

function sanitize(val) {
  return typeof val === 'number' ? val + '' : val
}

function addChild(children, val) {
  if (Array.isArray(val)) {
    for (var j = 0; j < val.length; j++) {
      children.push(val[j])
    }
  }
  else if (isValid(val)) {
    children.push(sanitize(val))
  }
}

export default function(tag, data, values) {
  var children = Array.isArray(values)
    ? values
    : isValid(values)
      ? [sanitize(values)]
      : []

  for (var i = 3; i < arguments.length; i++) {
    addChild(children, arguments[i])
  }

  return typeof tag === "string"
    ? {
        tag: tag,
        data: data || {},
        children: children
      }
    : tag(data, children)
}
