import quickstart from './quickstart.md'
import counterCode from './counterCode'

import './style.css'

const Down = (state) => ({ ...state, count: state.count - 1 })
const Up = (state) => ({ ...state, count: state.count + 1 })

const OnSubmit = (state, ev) => {
  ev.preventDefault()
  return {
    ...state,
    submitting: true,
    joinFormSuccess: 'This form has not been implemented yet. Maybe you\'re the one who\'s going to do it? :) https://github.com/jorgebucaran/hyperapp'
  }
}

const ShowPreview = (state) => ({
  ...state,
  showPreview: true
})

const ShowCode = (state) => ({
  ...state,
  showPreview: false
})

export default (state) => (
  <div class="home-page">

    <nav class="secondary-menu">
      <a href="#hyperapp">what's hyperapp</a>
      <a href="#quickstart">quick start</a>
      <a href="#join-us">join us</a>
    </nav>

    <header class="home-header">
      <a class="arrow-link" href="https://github.com/jorgebucaran/hyperapp" target="_blank" rel="noopener noreferrer">2.0.3</a>
      <marquee>this site is a wip, stay in touch!</marquee>
    </header>

    <h1 class="home-title" id="hyperapp">purely functional, declarative web apps in javascript</h1>

    <div class="home-grid">
      <div class="small-card">
        <img src={require('../../assets/faster-than-react.svg')} alt="faster than react" />
        <h2>2x</h2>
        <h5>faster than react</h5>
      </div>
      <div class="small-card">
        <img style={{ marginTop: '2rem' }} src={require('../../assets/so-small-cant-even.svg')} alt="it's so small, I can't even" />
        <h2>1.8kB</h2>
        <h5>it's so small, I can't even</h5>
      </div>
      <div class="small-card">
        <img src={require('../../assets/time-to-interactive.svg')} alt="time to interactive" />
        <h2>10ms</h2>
        <h5>time to interactive</h5>
      </div>
      <h2 class="home-secondary-title">the tiny framework for building web interfaces</h2>
      <div class="home-right-text">
        <img src={require('../../assets/do-more-with-less.svg')} alt="do more with less" />
        <h2>do more with less</h2>
        <p>We have minimized the concepts you need to learn to be productive. views, actions, effects, and subscriptions are all pretty easy to get to grips with and work together seamlessly.</p>
        <img src={require('../../assets/write-what-not-how.svg')} alt="write what, not how" />
        <h2>write what, not how</h2>
        <p>With a declarative syntax that's easy to read and natural to write, Hyperapp is your tool of choice to develop purely functional, feature-rich, browser-based applications.</p>
        <img src={require('../../assets/hypercharged.svg')} alt="hypercharged" />
        <h2>hypercharged</h2>
        <p>Hyperapp is a modern VDOM engine, state management solution, and application design pattern all-in-one. once you learn to use it, there'll be no end to what you can do.</p>
      </div>
    </div>

    <div class="home-content" innerHTML={quickstart} />

    <div class="live-example-tabs">
      <button
        class={{
          code: true,
          current: !state.showPreview
        }}
        type="button"
        onclick={ShowCode}
      >
        code
      </button>
      <button
        class={{
          preview: true,
          current: state.showPreview
        }}
        type="button"
        onclick={ShowPreview}
      >
        live preview
      </button>
    </div>
    <div class="live-example">
      <pre class={{
        shown: !state.showPreview
      }}>
        <code class="language-js">{counterCode}</code>
      </pre>
      <div
        class={{
          'counter-link': true,
          shown: state.showPreview
        }}
      >
        <a class="arrow-link" href="https://codesandbox.io/s/hyperapp-playground-fwjlo" target="_blank" rel="noopener noreferrer">edit on CodeSandbox</a>
      </div>
      <div
        class={{
          counter: true,
          shown: state.showPreview
        }}
      >
        <h1>{state.count}</h1>
        <button class="primary-button" onclick={Down}>substract</button>
        <button class="primary-button" onclick={Up}>add</button>
      </div>
    </div>

    <form id="join-us" class="join-us" method="post" onsubmit={OnSubmit}>
      <h2>join us</h2>
      <p class="join-us-text">We love to talk javascript and hyperapp. if you've hit a stumbling block or got stuck, hop on the hyperapp slack to get help.</p>
      <div class={{
        'nice-input': true,
        error: !!state.joinFormError
      }}>
        <input
          type="email"
          placeholder="enter your email"
          name="email"
          required
        />
        <button class="square-button" type="submit">submit</button>
        {state.joinFormSuccess && <small class="success">{state.joinFormSuccess}</small>}
        {state.joinFormError && <small class="error">{state.joinFormError}</small>}
      </div>
    </form>
  </div>
)
