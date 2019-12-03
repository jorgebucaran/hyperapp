import { getPathInfo } from './utils'
import { UpdateHistory } from './effects'

export const OpenMenu = (state) => ({
  ...state,
  menuOpened: true
})

export const CloseMenu = (state) => ({
  ...state,
  menuOpened: false
})

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
  CloseMenu(ParseUrl(state, to)),
  UpdateHistory({ to })
]
