
import { Navigate } from '../../actions'

const Link = ({ to, ...props }, children) => (
  <a
    href={to}
    onClick={[[Navigate, to], ev => ev.preventDefault()]}
    {...props}
  >
    {children}
  </a>
)

export default Link
