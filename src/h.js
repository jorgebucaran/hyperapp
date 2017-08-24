var i
var stack = []
var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator || '@@iterator'

export function h(tag, data) {
  var node
  var children = []
  var iterator
  var next
  var subStack

  for (i = arguments.length; i-- > 2; ) {
    stack.push(arguments[i])
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (i = node.length; i--; ) {
        stack.push(node[i])
      }
    } else if (node != null && typeof node === "object" && typeof node[ITERATOR_SYMBOL] === "function") {
      iterator = node[ITERATOR_SYMBOL]()
      subStack = []
      while(!(next = iterator.next()).done) {
        subStack.push(next.value)
      }
      stack.push(subStack)
    } else if (node != null && node !== true && node !== false) {
      if (typeof node === "number") {
        node = node + ""
      }
      children.push(node)
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
