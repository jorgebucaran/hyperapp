var isArray = Array.isArray

export function createNode(tag, data, values) {
  var children = []

  for (var i = 0; i < values.length; i++) {
    var val = values[i]
    if (val && val !== true && val !== false) {
      if (isArray(val)) {
        for (var j = 0; j < val.length; j++) {
          children.push(val[j])
        }
      }
      else {
        children.push(typeof val === 'number' ? val + '' : val)
      }
    }
  }

  return typeof tag === "string"
    ? {
        tag: tag,
        data: data || {},
        children: children
      }
    : tag(data, children)
}

export function h(tag, data, values) {
  if (!isArray(values)) {
    values = []
    for (var i = 2; i < arguments.length; i++) {
      values.push(arguments[i])
    }
  }

  return createNode(tag, data, values || [])
}
