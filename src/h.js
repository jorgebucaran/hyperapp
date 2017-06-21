export default function (outerEvents) {
  return function (tag, data) {
    var node
    var stack = []
    var children = []

    for (var i = arguments.length; i-- > 2;) {
      stack[stack.length] = arguments[i]
    }

    while (stack.length) {
      if (Array.isArray((node = stack.pop()))) {
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

    var output
    if (typeof tag === "string") {
      output = {
        tag: tag,
        data: data || {},
        children: children
      }
    } else if (typeof tag === "object") {
      output = {
        tag: "div",
        data: { "data-id": data.id + "" },
        children: [outerEvents.get("child", { component: tag, props: data, children })]
      }
    } else {
      output = tag(data, children)
    }

    return output
  }
}
