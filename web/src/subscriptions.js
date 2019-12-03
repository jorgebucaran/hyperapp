const fx = a => b => [a, b]

// WindowScrolled Subscription
export const WindowScrolled = fx((dispatch, props) => {
  const handleScroll = ev => {
    dispatch([props.action, { ev, scrollY: window.scrollY }])
  }
  addEventListener('scroll', handleScroll)
  return () => {
    removeEventListener('scroll', handleScroll)
  }
})

// PopState Subscription
export const PopState = fx((dispatch, props) => {
  const handleLocationChange = () => {
    dispatch([props.action, window.location.pathname + window.location.search])
  }
  addEventListener('popstate', handleLocationChange)
  return () => {
    removeEventListener('popstate', handleLocationChange)
  }
})
