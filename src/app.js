export function app(props) {
  var state = {}
  var actions = {}
  var events = {}
  var mixins = []
  var view = props.view
  var root = props.root || document.body
  var node
  var element
  var locked = false

  for (var i = -1; i < mixins.length; i++) {
    props = mixins[i] ? mixins[i](emit) : props

    Object.keys(props.events || []).map(function(key) {
      events[key] = (events[key] || []).concat(props.events[key])
    })

    iterate(actions, props.actions)
    mixins = mixins.concat(props.mixins || [])
    state = merge(state, props.state || state)
  }

  schedule(
    (node = hydrate((element = root.querySelector("[data-ssr]")), [].map))
  )

  return emit("load")

  function update(withState) {
    if (withState) {
      schedule((state = emit("update", merge(state, withState))))
    }
  }

  function schedule() {
    if (!locked) {
      requestAnimationFrame(render, (locked = !locked))
    }
  }

  function hydrate(element, map) {
    return element
      ? {
          tag: element.tagName,
          data: {},
          children: map.call(element.childNodes, function(element) {
            hydrate(element, map)
          })
        }
      : element
  }

  function render() {
    element = patch(
      root,
      element,
      node,
      (node = emit("render", view)(state, actions))
    )
    locked = !locked
  }

  function iterate(namespace, children, lastName) {
    Object.keys(children || []).map(function(key) {
      var action = children[key]
      var name = lastName ? lastName + "." + key : key

      if (typeof action === "function") {
        namespace[key] = function(data) {
          emit("action", { name: name, data: data })
          var result = emit("resolve", action(state, actions, data))
          return typeof result === "function" ? result(update) : update(result)

          // return result && result.then && result.then(update)
          //   ? result
          //   : typeof result === "function" ? result(update) : update(result)
        }
      } else {
        iterate(namespace[key] || (namespace[key] = {}), action, name)
      }
    })
  }

  function emit(event, withData) {
    return (events[event] || []).map(function(cb) {
      withData = cb(state, actions, withData)
    }), withData
  }

  function merge(from, to) {
    for (var i in from) {
      if (!(i in to)) {
        to[i] = from[i]
      }
    }
    return to
  }

  function getKey(node) {
    if (node && (node = node.data)) {
      return node.key
    }
  }

  function createElement(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node)
    } else {
      var element = (isSVG = isSVG || node.tag === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
        : document.createElement(node.tag)

      for (var i = 0; i < node.children.length; ) {
        element.appendChild(createElement(node.children[i++], isSVG))
      }

      for (var i in node.data) {
        if (i === "oncreate") {
          node.data[i](element)
        } else {
          setElementData(element, i, node.data[i])
        }
      }
    }

    return element
  }

  function setElementData(element, name, value, oldValue) {
    if (
      name === "key" ||
      name === "oncreate" ||
      name === "onupdate" ||
      name === "onremove"
    ) {
    } else if (name === "style") {
      for (var i in merge(oldValue, (value = value || {}))) {
        element.style[i] = value[i] || ""
      }
    } else {
      try {
        element[name] = value
      } catch (_) {}

      if (typeof value !== "function") {
        if (value) {
          element.setAttribute(name, value)
        } else {
          element.removeAttribute(name)
        }
      }
    }
  }

  function updateElementData(element, oldData, data) {
    for (var name in merge(oldData, data)) {
      var value = data[name]
      var oldValue = oldData[name]

      if (value !== oldValue && value !== element[name]) {
        setElementData(element, name, value, oldValue)
      }
    }

    if (data && data.onupdate) {
      data.onupdate(element, oldData)
    }
  }

  function removeElement(parent, element, data) {
    if (data && data.onremove) {
      data.onremove(element)
    } else {
      parent.removeChild(element)
    }
  }

  function patch(parent, element, oldNode, node, isSVG, lastElement) {
    if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element)
    } else if (node.tag != null && node.tag === oldNode.tag) {
      updateElementData(element, oldNode.data, node.data)

      isSVG = isSVG || node.tag === "svg"

      var len = node.children.length
      var oldLen = oldNode.children.length
      var reusableChildren = {}
      var oldElements = []
      var newKeys = {}

      for (var i = 0; i < oldLen; i++) {
        var oldElement = element.childNodes[i]
        oldElements[i] = oldElement

        var oldChild = oldNode.children[i]
        var oldKey = getKey(oldChild)

        if (null != oldKey) {
          reusableChildren[oldKey] = [oldElement, oldChild]
        }
      }

      var i = 0
      var j = 0

      while (j < len) {
        var oldElement = oldElements[i]
        var oldChild = oldNode.children[i]
        var newChild = node.children[j]

        var oldKey = getKey(oldChild)
        if (newKeys[oldKey]) {
          i++
          continue
        }

        var newKey = getKey(newChild)

        var reusableChild = reusableChildren[newKey] || []

        if (null == newKey) {
          if (null == oldKey) {
            patch(element, oldElement, oldChild, newChild, isSVG)
            j++
          }
          i++
        } else {
          if (oldKey === newKey) {
            patch(element, reusableChild[0], reusableChild[1], newChild, isSVG)
            i++
          } else if (reusableChild[0]) {
            element.insertBefore(reusableChild[0], oldElement)
            patch(element, reusableChild[0], reusableChild[1], newChild, isSVG)
          } else {
            patch(element, oldElement, null, newChild, isSVG)
          }

          j++
          newKeys[newKey] = newChild
        }
      }

      while (i < oldLen) {
        var oldChild = oldNode.children[i]
        var oldKey = getKey(oldChild)
        if (null == oldKey) {
          removeElement(element, oldElements[i], oldChild.data)
        }
        i++
      }

      for (var i in reusableChildren) {
        var reusableChild = reusableChildren[i]
        var reusableNode = reusableChild[1]
        if (!newKeys[reusableNode.data.key]) {
          removeElement(element, reusableChild[0], reusableNode.data)
        }
      }
    } else if (
      (lastElement = element) != null &&
      node !== oldNode &&
      node !== element.nodeValue
    ) {
      parent.replaceChild((element = createElement(node, isSVG)), lastElement)
    }

    return element
  }
}
