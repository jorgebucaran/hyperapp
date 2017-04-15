export default function(tag, data) {
  var children = []

  for (var i = 2; i < arguments.length; i++) {
    var val = arguments[i]
    if (Array.isArray(val)) {
      for (var j = 0; j < val.length; j++) {
        children.push(val[j])
      }
    }
    else if (val && val !== true) {
      if (typeof val === 'number') {
        val = val + ''
      }
      children.push(val)
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
