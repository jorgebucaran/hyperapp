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
    const popstate = (_) => dispatch(action, location.href)

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
      let target = event.target;
      while (target && !target.matches("a")) target = target.parentElement;
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        target
      ) {
        const href = target.getAttribute("href")
        const dest = new URL(href, location.href);
        if (dest.protocol == location.protocol && dest.hostname == location.hostname) {
          event.preventDefault()
          dispatch(action, { pathname: href })  
        }
      }
    }
    addEventListener("click", clicks)
    return () => removeEventListener("click", clicks)
  }
)
