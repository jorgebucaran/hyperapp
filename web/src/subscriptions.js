
// WindowScrolled Subscription
const scrolledFx = a => b => [a, b]
export const WindowScrolled = scrolledFx((dispatch, props) => {
  const handleScroll = ev => {
    dispatch([props.action, { ev, scrollY: window.scrollY }])
  }
  addEventListener('scroll', handleScroll)
  return () => {
    removeEventListener('scroll', handleScroll)
  }
})

// PopState Subscription
const subFx = a => b => [a, b]
export const PopState = subFx((dispatch, props) => {
  const handleLocationChange = () => {
    dispatch([props.action, window.location.pathname + window.location.search])
  }
  addEventListener('popstate', handleLocationChange)
  return () => {
    removeEventListener('popstate', handleLocationChange)
  }
})
