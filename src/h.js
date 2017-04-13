export default function (tag, data) {
  var node
  var canConcat
  var oldCanConcat

  var stack = []
  var children = []

  for (var i = arguments.length; i-- > 2;) {
    stack.push(arguments[i])
  }

  while (stack.length) {
    if (Array.isArray(node = stack.pop())) {
      i = node.length

      while (i--) {
        stack.push(node[i])
      }
    } else if (node != null && node !== true && node !== false) {
      i = children.length

      if (typeof node === "number") {
        node = node + ""
      }

      canConcat = typeof node === "string"

      if (canConcat && oldCanConcat) {
        children[i - 1] += node
      } else {
        children[i] = node
        oldCanConcat = canConcat
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
