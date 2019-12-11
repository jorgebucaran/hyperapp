import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)

// Change location FX
const historyFx = (dispatch, { to }) => {
  history.pushState(null, '', to)
}
export const UpdateHistory = ({ to }) => [historyFx, { to }]

export const highLightFx = () => {
  // Timeout so that effect runs after render
  setTimeout(() => {
    document.querySelectorAll('code').forEach((block) => {
      hljs.highlightBlock(block)
    })
  }, 50)
}

export const HighLight = () => [highLightFx]
