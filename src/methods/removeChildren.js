const removeChildren = (element, node, attributes) => {
  if ((attributes = node.attributes)) {
    for (let i = 0; i < node.children.length; i++) {
      removeChildren(element.childNodes[i], node.children[i])
    }

    if (attributes.ondestroy) {
      attributes.ondestroy(element)
    }
  }
  return element
}

export default removeChildren