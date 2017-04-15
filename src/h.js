function addChild(children, val) {
  if (Array.isArray(val)) {
    for (var j = 0; j < val.length; j++) {
      children.push(val[j])
    }
  }
  else if (val != null && val !== true && val !== false) {
    if (typeof val === 'number') {
      val = val + ''
    }
    children.push(val)
  }
}

export default function(tag, data, values) {
  var children = []

  if (Array.isArray(values)) {
    for (var i = 0; i < values.length; i++) {
      addChild(children, values[i])
    }
  }
  else {
    addChild(children, values)
  }

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
