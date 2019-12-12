import Prism from './lib/prism'
import './lib/prism.css'

// Change location FX
const historyFx = (dispatch, { to }) => {
  history.pushState(null, '', to)
}
export const UpdateHistory = ({ to }) => [historyFx, { to }]

export const highLightFx = () => {
  // Timeout so that effect runs after render
  setTimeout(() => {
    Prism.highlightAllUnder(document.body)
  }, 50)
}

export const HighLight = () => [highLightFx]
