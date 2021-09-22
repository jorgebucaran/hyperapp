const justFocus = (_, { id, ...props }) =>
  requestAnimationFrame(() => document.getElementById(id).focus(props))

const justBlur = (_, id) => document.getElementById(id).blur()

export const focus = (id, { preventScroll } = {}) => [
  justFocus,
  { id, preventScroll },
]
export const blur = (id) => [justBlur, id]
