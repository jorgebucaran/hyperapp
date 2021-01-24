const fx = (argsToProps, fx) => (...args) => [fx, argsToProps(args)]

export const pushUrl = fx(
  ([url]) => ({ url }),
  (_, { url }) => {
    history.pushState({}, "", url)
    dispatchEvent(new CustomEvent("hyperapp-pushstate"))
  }
)

export const onUrlChange = fx(
  ([action]) => ({ action }),
  (dispatch, { action }) => {
    const popstate = (_) => dispatch(action, location)

    addEventListener("popstate", popstate)
    addEventListener("hyperapp-pushstate", popstate)

    return () =>
      ["popstate", "hyperapp-pushstate"].map((e) =>
        removeEventListener(e, popstate)
      )
  }
)

export const onUrlRequest = fx(
  ([action]) => ({ action }),
  (dispatch, { action }) => {
    const clicks = (event) => {
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        event.target.matches("a")
      ) {
        event.preventDefault()
        const href = event.target.getAttribute("href")
        dispatch(action, { pathname: href })
      }
    }
    addEventListener("click", clicks)
    return () => addEventListener("click", clicks)
  }
)
