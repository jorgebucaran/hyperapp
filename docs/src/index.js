/* eslint-disable indent */
import { app } from 'hyperapp'

import { request } from '../../lib/http/src/index'

// App init imports
import { WindowScrolled, PopState } from './subscriptions'
import { WindowScroll, ParseUrl, SetSearchData } from './actions'
import { HighLight, Focus } from './effects'

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

// Initialize the app on the #app div
app({
  init: [
    ParseUrl({
        menuOpened: false,
        showPreview: false,
        count: 0
      },
      window.location.pathname + window.location.search
    ),
    HighLight(),
    request({
      url: '/pages-data.json',
      expect: 'json',
      action: SetSearchData
    }),
    window.location.search.startsWith('?q') && Focus({ selector: '#search' })
  ],
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
