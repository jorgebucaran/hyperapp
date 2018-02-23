const toVNode = (element, map) => {
  return {
    nodeName: element.nodeName.toLowerCase(),
    attributes: {},
    children: map.call(element.childNodes, element => {
      return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue
        : toVNode(element, map)
    })
  }
}

export default toVNode
