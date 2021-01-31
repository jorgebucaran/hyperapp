const listeners = {}

const fx = (subscriber) => (action) => [subscriber, action]

const globalListener = (event) => {
  for (const [dispatch, actions] of listeners[event.type])
    for (const action of actions) dispatch(action, event)
}

const on = (type) =>
  fx((dispatch, action) => {
    if (!listeners[type]) {
      listeners[type] = new Map()
      addEventListener(type, globalListener)
    }

    listeners[type].set(
      dispatch,
      (listeners[type].get(dispatch) || []).concat(action)
    )

    return () => {
      const actions = listeners[type].get(dispatch).filter((a) => a !== action)

      listeners[type].set(dispatch, actions)

      if (
        actions.length === 0 &&
        listeners[type].delete(dispatch) &&
        listeners[type].size === 0
      ) {
        delete listeners[type]
        removeEventListener(type, globalListener)
      }
    }
  })

export const onMouseMove = on("mousemove")
export const onMouseDown = on("mousedown")
export const onMouseUp = on("mouseup")
export const onKeyDown = on("keydown")
export const onKeyUp = on("keyup")
export const onClick = on("click")
export const onFocus = on("focus")
export const onBlur = on("blur")
