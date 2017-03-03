var i, node, children, stack = []

export default function (tag, data) {
  var canConcat, oldCanConcat

  children = []
  i = arguments.length

  while (i-- > 2) {
    stack.push(arguments[i])
  }

  while (stack.length) {
    if (Array.isArray(node = stack.pop())) {
      i = node.length

      while (i--) {
        stack.push(node[i])
      }
    } else if (node != null && node !== true && node !== false) {
      // Ignore nulls and booleans; this is conditional rendering.

      if (typeof node === "number") {
        node = node + ""
      }

      // Concatenate contiguous number/string nodes into one string.
      // The idea is to avoid creating unnecessary text nodes.

      canConcat = typeof node === "string"

      if (canConcat && oldCanConcat) {
        children[children.length - 1] += node
      } else {
        children.push(node)
        oldCanConcat = canConcat
      }
    }
  }

  if (typeof tag === "function") {
    return tag(data, children)
  }

  if (tag === "svg") {
    svg(tag, data, children)
  }

  return {
    tag: tag,
    data: data || {},
    children: children
  }
}

function svg(tag, data, children) {
  data.ns = "http://www.w3.org/2000/svg"

  for (var i = 0; i < children.length; i++) {
    var node = children[i]
    if (node.data) {
      svg(node.tag, node.data, node.children)
    }
  }
}
