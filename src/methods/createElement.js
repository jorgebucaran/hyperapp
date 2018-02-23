import updateAttribute from './updateAttribute'

export const createElement = (lifecycleStack) => {
  return (node, isSVG) => {
    let element =
      typeof node === "string" || typeof node === "number"
        ? document.createTextNode(node)
        : (isSVG = isSVG || node.nodeName === "svg")
          ? document.createElementNS(
            "http://www.w3.org/2000/svg",
            node.nodeName
          )
          : document.createElement(node.nodeName)

    if (node.attributes) {
      if (node.attributes.oncreate) {
        lifecycleStack.push(function () {
          node.attributes.oncreate(element)
        })
      }

      for (let i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(lifecycleStack)(node.children[i], isSVG))
      }

      for (let name in node.attributes) {
        updateAttribute(element, name, node.attributes[name], isSVG)
      }
    }

    return element
  }
}