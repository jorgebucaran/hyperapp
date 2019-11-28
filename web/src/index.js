/* eslint-disable indent */
import { app } from 'hyperapp'

import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'

import 'highlight.js/styles/github.css'

// App init imports
import { WindowScrolled, PopState } from './subscriptions'
import { WindowScroll, ParseUrl } from './actions'

// Components
import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import Page from './pages/Page'
import Tutorial from './pages/Tutorial'
import Ecosystem from './pages/Ecosystem'
import Sponsor from './pages/Sponsor'
import Guides from './pages/Guides'
import Api from './pages/Api'

import FourOhFour from './pages/FourOhFour'
import Search from './pages/Search'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)

// Initialize the app on the #app div
app({
  init: ParseUrl({
    menuOpened: false,
    showPreview: false,
    count: 0
  }, window.location.pathname + window.location.search),
  view: (state) => {
    return (
      <div class={{
        app: true,
        noBodyScroll: state.menuOpened
      }}>
        <Header {...state} />
        <main key={state.location.path} class="main-content">
          {
            state.location.path === '/' ? <Home {...state} />
            : state.location.path === '/page' ? <Page />
            : state.location.path === '/tutorial' ? <Tutorial />
            : state.location.path === '/ecosystem' ? <Ecosystem />
            : state.location.path === '/sponsor' ? <Sponsor />
            : state.location.path === '/guides' ? <Guides />
            : state.location.path === '/api' ? <Api />
            : state.location.path === '/search' ? <Search {...state} />
            : <FourOhFour />
          }
        </main>
        <Footer />
      </div>
    )
  },
  node: document.getElementById('app'),
  subscriptions: () => [
    WindowScrolled({ action: WindowScroll }),
    PopState({ action: ParseUrl })
  ]
})

// TODO: make an effect for this
setTimeout(() => {
  document.querySelectorAll('code').forEach((block) => {
    hljs.highlightBlock(block)
  })
}, 50)
