import Link from '../Link'

const SmartLink = ({ to, class: className, props }, children) => (
  <Link
    to={to}
    class={{
      active: to === window.location.pathname,
      ...className && { [className]: true }
    }}
    {...props}
  >
    {children}
  </Link>
)

export default SmartLink
