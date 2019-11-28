import { getPathInfo } from './utils'
import { UpdateHistory } from './effects'
// State transitions
export const WindowScroll = (state, { scrollY }) => ({
  ...state,
  scrollY,
  scrollDirection: state.scrollY < scrollY ? 'down' : 'up',
  isScrolled: scrollY > 32
})

export const ParseUrl = (state, path) => ({
  ...state,
  location: getPathInfo(path)
})

export const Navigate = (state, to) => [
  ParseUrl(state, to),
  UpdateHistory({ to })
]
