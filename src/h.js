var nodePool = []

function reuseNode(node, tag, data, children) {
  node.tag = tag
  node.data = data
  node.children = children
  return node
}

export function getNode(tag, data, children) {
  if (nodePool.length > 0) {
    return reuseNode(nodePool.pop(), tag, data, children)
  } else {
    return { tag: tag, data: data, children: children }
  }
}

export function recoverNode(node) {
  if (typeof node !== "string") {
    nodePool.push(node)
  }
}

export function h(tag, data) {
  var node
  var stack = []
  var children = []

  for (var i = arguments.length; i-- > 2; ) {
    stack[stack.length] = arguments[i]
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (var i = node.length; i--; ) {
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
