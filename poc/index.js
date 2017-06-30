// to run this, go to the poc folder and run
// npm install -g beefy
// npm install browserify babelify babel-preset-es2015 babel-preset-react
// beefy index.js -- -t [babelify --presets [react es2015] ]

import { app, h, Provider, connect } from '../src/index.js'
// import { h, Provider, connect } from './connect.js'
/** @jsx h */
console.log(1)

const Controls = connect((props, children) => (
  <div>
    <button onclick={props.context.add}>+</button>
    <button onclick={props.context.sub}>-</button>
    <p>{props.regularPropsWork}</p>
  </div>
))

app({
  state: 0,
  view: (state, actions) => (
    <main>
      <Provider context={actions} />
      <h1>{state}</h1>
      <Controls regularPropsWork="just fine" />
    </main>
  ),
  actions: {
    add: state => state + 1,
    sub: state => state - 1
  }
})
