export default function (tag, data) {
  var node
  var stack = []
  var children = []

  for (var i = arguments.length; i-- > 2;) {
    stack[stack.length] = arguments[i]
  }

  while (stack.length) {
    if (Array.isArray(node = stack.pop())) {
      for (var i = node.length; i--;) {
        stack[stack.length] = node[i]
      }
    } else if (node != null && node !== true && node !== false) {
      if (typeof node === "number") {
        node = node + ""
      }
      children[children.length] = node
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

