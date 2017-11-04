import { h } from "./h"

export function app(props, container) {
  var root = (container = container || document.body).children[0]
  var node = toVNode(root, [].map)
  var callbacks = []
  var skipRender
  var globalState
  var globalActions

  repaint(
    flush(
      initModule(
        props,
        (globalState = {}),
        (globalActions = {}),
        updateGlobalState,
        function() {
          return globalState
        }
      )
    )
  )

  return globalActions

  function repaint() {
    if (props.view && !skipRender) {
      requestAnimationFrame(render, (skipRender = !skipRender))
    }
  }

  function render() {
    flush(
      (root = patchElement(
        container,
        root,
        node,
        (node = props.view(globalState, globalActions)),
        (skipRender = !skipRender)
      ))
    )
  }

  function flush(cb) {
    while ((cb = callbacks.pop())) cb()
  }

  function toVNode(element, map) {
    return (
      element &&
      h(
        element.tagName.toLowerCase(),
        {},
        map.call(element.childNodes, function(element) {
          return element.nodeType === 3
            ? element.nodeValue
            : toVNode(element, map)
        })
      )
    )
  }

  /**
   * Initializes the given module:
   *  - computes the initial state
   *  - initalize all actions
   *  - add module.init() to be called before the first render
   *  - initialize sub-modules
   * 
   * @param module the module to initialize
   * @param state the initial state (updated by this function)
   * @param actions the actions object (updated by this function)
   * @param update the update() function for the current state slice
   * @param getState function () => state that returns the current (up-to-date) state slice
   */
  function initModule(module, state, actions, update, getState) {
    if (module.init) {
      callbacks.push(function() {
        module.init(state, actions)
      })
    }

    assign(state, module.state)

    initModuleActions(state, actions, module.actions, update, getState)

    for (var key in module.modules) {
      initModule(
        module.modules[key],
        // do not override state is already exist in current module
        state[key] || (state[key] = {}),
        // do not override actions is already exist in current module
        actions[key] || (actions[key] = {}),
        updateFor(update, getState, key),
        getStateFor(getState, key)
      )
    }
  }

  /**
   * Initializes the given actions:
   *  - bind the moduleActions to the current state slice/actions
   *  - set state = {} for children actions, if needed
   *  - recursively initialize children actions
   * 
   * @param moduleActions the current module's actions, contains actions and other action objects
   * @param state the initial state object, this is passed here to avoid undefined state when 
   *              computing and action's state slice
   * @param actions the initalized actions object (updated by this function)
   * @param update the update() function for the actions' relevant state slices
   * @param getState function: () => state that return the relevant state slice for the actions
   */
  function initModuleActions(state, actions, moduleActions, update, getState) {
    Object.keys(moduleActions || {}).map(function(key) {
      if (typeof moduleActions[key] === "function") {
        actions[key] = function(data) {
          return typeof (data = moduleActions[key](
            getState(),
            actions,
            data
          )) === "function"
            ? data(update)
            : update(data)
        }
      } else {
        initModuleActions(
          state[key] || (state[key] = {}),
          (actions[key] = {}),
          moduleActions[key],
          updateFor(update, getState, key),
          getStateFor(getState, key)
        )
      }
    })
  }

  /**
   * Merge the global state with the given result and triggers a repaint.
   * This is the update() function for the app's prop.
   * @param result the result to merge it, a function (globalState) => result, or falsy to not trigger repaint
   * @returns globalState
   */
  function updateGlobalState(result) {
    return (
      typeof result === "function"
        ? updateGlobalState(result(globalState))
        : result && repaint((globalState = merge(globalState, result))),
      globalState
    )
  }

  /**
   * Wraps the given update() function and return a new update() that can be used for the state slice getState()[prop].
   * 
   * @param update the update() function to wrap
   * @param getState function: () => state that returns the parrent's state slice 
   *                 (getState()[prop] contains the current state slice)
   * @param prop the property of the state slice to create the update() function for
   * @param parentResult internal variable added to avoid declaration (saves 1 "var "), should not be set
   * 
   * @returns the new update function specialized for the given state slice
   */
  function updateFor(update, getState, prop, parentResult) {
    return function(result) {
      ;(parentResult = {})[prop] = merge(
        getState()[prop],
        typeof result === "function" ? result(getState()[prop]) : result
      )
      return update(parentResult)[prop]
    }
  }

  /**
   * Function: (getState: () => state, prop: string) => () => state[prop].
   * 
   * @param getState the getter for the state: () => state that gets wrapped
   * @param prop the state slice to get
   * @returns a new state getter function: () => getState()[prop]
   */
  function getStateFor(getState, prop) {
    return function() {
      return getState()[prop]
    }
  }

  function assign(target, source) {
    for (var i in source) {
      target[i] = source[i]
    }
    return target
  }

  function merge(target, source) {
    return assign(assign({}, target), source)
  }

  function createElement(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node)
    } else {
      var element = (isSVG = isSVG || node.type === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.type)
        : document.createElement(node.type)

      if (node.props && node.props.oncreate) {
        callbacks.push(function() {
          node.props.oncreate(element)
        })
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i], isSVG))
      }

      for (var i in node.props) {
        setElementProp(element, i, node.props[i])
      }
    }
    return element
  }

  function setElementProp(element, name, value, oldValue) {
    if (name === "key") {
    } else if (name === "style") {
      for (var name in merge(oldValue, (value = value || {}))) {
        element.style[name] = value[name] || ""
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

  function updateElement(element, oldProps, props) {
    for (var i in merge(oldProps, props)) {
      var value = props[i]
      var oldValue = i === "value" || i === "checked" ? element[i] : oldProps[i]

      if (value !== oldValue) {
        setElementProp(element, i, value, oldValue)
      }
    }

    if (props && props.onupdate) {
      callbacks.push(function() {
        props.onupdate(element, oldProps)
      })
    }
  }

  function removeElement(parent, element, props) {
    if (
      props &&
      props.onremove &&
      typeof (props = props.onremove(element)) === "function"
    ) {
      props(remove)
    } else {
      remove()
    }

    function remove() {
      parent.removeChild(element)
    }
  }

  function getKey(node) {
    if (node && node.props) {
      return node.props.key
    }
  }

  function patchElement(parent, element, oldNode, node, isSVG, nextSibling) {
    if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element)
    } else if (node.type != null && node.type === oldNode.type) {
      updateElement(element, oldNode.props, node.props)

      isSVG = isSVG || node.type === "svg"

      var len = node.children.length
      var oldLen = oldNode.children.length
      var oldKeyed = {}
      var oldElements = []
      var keyed = {}

      for (var i = 0; i < oldLen; i++) {
        var oldElement = (oldElements[i] = element.childNodes[i])
        var oldChild = oldNode.children[i]
        var oldKey = getKey(oldChild)

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElement, oldChild]
        }
      }

      var i = 0
      var j = 0

      while (j < len) {
        var oldElement = oldElements[i]
        var oldChild = oldNode.children[i]
        var newChild = node.children[j]

        var oldKey = getKey(oldChild)
        if (keyed[oldKey]) {
          i++
          continue
        }

        var newKey = getKey(newChild)

        var keyedNode = oldKeyed[newKey] || []

        if (null == newKey) {
          if (null == oldKey) {
            patchElement(element, oldElement, oldChild, newChild, isSVG)
            j++
          }
          i++
        } else {
          if (oldKey === newKey) {
            patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG)
            i++
          } else if (keyedNode[0]) {
            element.insertBefore(keyedNode[0], oldElement)
            patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG)
          } else {
            patchElement(element, oldElement, null, newChild, isSVG)
          }

          j++
          keyed[newKey] = newChild
        }
      }

      while (i < oldLen) {
        var oldChild = oldNode.children[i]
        var oldKey = getKey(oldChild)
        if (null == oldKey) {
          removeElement(element, oldElements[i], oldChild.props)
        }
        i++
      }

      for (var i in oldKeyed) {
        var keyedNode = oldKeyed[i]
        var reusableNode = keyedNode[1]
        if (!keyed[reusableNode.props.key]) {
          removeElement(element, keyedNode[0], reusableNode.props)
        }
      }
    } else if (element && node !== element.nodeValue) {
      if (typeof node === "string" && typeof oldNode === "string") {
        element.nodeValue = node
      } else {
        element = parent.insertBefore(
          createElement(node, isSVG),
          (nextSibling = element)
        )
        removeElement(parent, nextSibling, oldNode.props)
      }
    }
    return element
  }
}
