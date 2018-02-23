import removeChildren from './removeChildren';

const removeElement = (parent, element, node, cb) => {
  const done = () => parent.removeChild(removeChildren(element, node))  

  if (node.attributes && (cb = node.attributes.onremove)) {
    cb(element, done)
  } else {
    done()
  }
}

export default removeElement