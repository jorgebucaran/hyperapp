import {
  removeElement,
  getKey,
  toVNode,
  clone,
  get,
  set,
  updateAttribute,
  lifecycleStack,
  updateElement as originalUpdateElement,
  createElement as originalCreateElement,
  patch as originalPatch,
} from './methods';

const updateElement = originalUpdateElement(lifecycleStack);
const createElement = originalCreateElement(lifecycleStack);
const patch = originalPatch(updateElement, createElement);

export function h(name, attributes /*, ...rest*/) {
  let node
  let rest = []
  let children = []
  let length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    if ((node = rest.pop()) && node.pop /* Array? */) {
      for (length = node.length; length--;) {
        rest.push(node[length])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  return typeof name === "function"
    ? name(attributes || {}, children)
    : {
      nodeName: name,
      attributes: attributes || {},
      children: children,
      key: attributes && attributes.key
    }
}

export function app(state, actions, view, container) {
  let renderLock
  let firstRender = true
  let rootElement = (container && container.children[0]) || null
  let oldNode = rootElement && toVNode(rootElement, [].map)
  let globalState = clone(state)
  let wiredActions = clone(actions)

  scheduleRender(wireStateToActions([], globalState, wiredActions))

  return wiredActions

  function render() {
    renderLock = !renderLock

    let next = view(globalState, wiredActions)
    if (container && !renderLock) {
      rootElement = patch(firstRender, container, rootElement, oldNode, (oldNode = next))
      firstRender = false
    }

    while ((next = lifecycleStack.pop())) next()
  }

  function scheduleRender() {
    if (!renderLock) {
      renderLock = !renderLock
      setTimeout(render)
    }
  }

  function wireStateToActions(path, state, actions) {
    for (let key in actions) {
      typeof actions[key] === "function"
        ? (function (key, action) {
          actions[key] = function (data) {
            if (typeof (data = action(data)) === "function") {
              data = data(get(path, globalState), actions)
            }

            if (
              data &&
              data !== (state = get(path, globalState)) &&
              !data.then // Promise
            ) {
              scheduleRender(
                (globalState = set(path, clone(state, data), globalState))
              )
            }

            return data
          }
        })(key, actions[key])
        : wireStateToActions(
          path.concat(key),
          (state[key] = clone(state[key])),
          (actions[key] = clone(actions[key]))
        )
    }
  }
}
