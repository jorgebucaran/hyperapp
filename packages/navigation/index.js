const fx = (argsToProps, fx) => (...args) => [fx, argsToProps(args)]

const HYPERAPP_PUSHSTATE = "hyperapp-pushstate"
const URL_CHANGE_EVENTS = ["popstate", HYPERAPP_PUSHSTATE]

export const pushUrl = fx(
  ([url]) => ({ url }),
  (_, { url }) => {
    history.pushState({}, "", url)
    dispatchEvent(new CustomEvent(HYPERAPP_PUSHSTATE))
  }
)

export const onUrlChange = fx(
  ([action]) => ({ action }),
  (dispatch, { action }) => {
    const popstate = (_) => dispatch(action, location.href)

    URL_CHANGE_EVENTS.map((e) =>
      addEventListener(e, popstate)
    )

    return () =>
      URL_CHANGE_EVENTS.map((e) =>
        removeEventListener(e, popstate)
      )
  }
)

export const onUrlRequest = fx(
  ([action]) => ({ action }),
  (dispatch, { action }) => {
    const clicks = (event) => {
      let target = event.target;
      while (target && !target.matches("a")) target = target.parentElement;
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        target
      ) {
        event.preventDefault()
        const href = target.getAttribute("href")
        dispatch(action, { pathname: href })
      }
    }
    addEventListener("click", clicks)
    return () => removeEventListener("click", clicks)
  }
)
