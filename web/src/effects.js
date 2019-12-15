import Prism from './lib/prism'
import './lib/prism.css'

// Change location FX
const historyFx = (_dispatch, { to }) => {
  history.pushState(null, '', to)
}
export const UpdateHistory = ({ to }) => [historyFx, { to }]

const highLightFx = () => {
  // Timeout so that effect runs after render
  setTimeout(() => {
    Prism.highlightAllUnder(document.body)
  }, 50)
}

export const HighLight = () => [highLightFx]

const focusFx = (_dispatch, { selector }) => {
  setTimeout(() => {
    const el = document.querySelector(selector)
    if (el) {
      el.focus()
    }
  }, 50)
}

export const Focus = ({ selector }) => [focusFx, { selector }]
