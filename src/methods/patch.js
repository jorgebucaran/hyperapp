import getKey from './getKey'
import removeElement from './removeElement'

export const patch = (updateElement, createElement) => {
  return (firstRender, parent, element, oldNode, node, isSVG, nextSibling) => {
    if (node === oldNode) {
    } else if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element)
    } else if (node.nodeName && node.nodeName === oldNode.nodeName) {
      updateElement(firstRender, element, oldNode.attributes, node.attributes, (isSVG = isSVG || node.nodeName === "svg"))

      let oldElements = []
      let oldKeyed = {}
      let newKeyed = {}

      for (let i = 0; i < oldNode.children.length; i++) {
        oldElements[i] = element.childNodes[i]

        let oldChild = oldNode.children[i]
        let oldKey = getKey(oldChild)

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElements[i], oldChild]
        }
      }

      let i = 0
      let j = 0

      while (j < node.children.length) {
        let oldChild = oldNode.children[i]
        let newChild = node.children[j]

        let oldKey = getKey(oldChild)
        let newKey = getKey(newChild)

        if (newKeyed[oldKey]) {
          i++
          continue
        }

        if (newKey == null) {
          if (oldKey == null) {
            patch(updateElement, createElement)(firstRender, element, oldElements[i], oldChild, newChild, isSVG)
            j++
          }
          i++
        } else {
          let recyledNode = oldKeyed[newKey] || []

          if (oldKey === newKey) {
            patch(updateElement, createElement)(firstRender, element, recyledNode[0], recyledNode[1], newChild, isSVG)
            i++
          } else if (recyledNode[0]) {
            patch(updateElement, createElement)(firstRender, element, element.insertBefore(recyledNode[0], oldElements[i]), recyledNode[1], newChild, isSVG)
          } else {
            patch(updateElement, createElement)(firstRender, element, oldElements[i], null, newChild, isSVG)
          }

          j++
          newKeyed[newKey] = newChild
        }
      }

      while (i < oldNode.children.length) {
        let oldChild = oldNode.children[i]
        if (getKey(oldChild) == null) {
          removeElement(element, oldElements[i], oldChild)
        }
        i++
      }

      for (let i in oldKeyed) {
        if (!newKeyed[oldKeyed[i][1].key]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
        }
      }
    } else if (node.nodeName === oldNode.nodeName) {
      element.nodeValue = node
    } else {
      element = parent.insertBefore(
        createElement(node, isSVG),
        (nextSibling = element)
      )
      removeElement(parent, nextSibling, oldNode)
    }
    return element
  }
}