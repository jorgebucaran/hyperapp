import { h, app } from "hyperapp"
import * as style from "./index.css"
// @jsx h

const state = {
  count: 0
}

const actions = {
  down: value => state => ({ count: state.count - value }),
  up: value => state => ({ count: state.count + value })
}

const view = (state, actions) =>
  state.count > 3 ? (
    <div>
      upper than 3<h2>{state.count}</h2>
      <button onclick={() => actions.down(1)} disabled={state.count <= 0}>
        ー
      </button>
      <button onclick={() => actions.up(1)}>＋</button>
    </div>
  ) : (
    <main>
      <h1>{state.count}</h1>
      <button onclick={() => actions.down(1)} disabled={state.count <= 0}>
        ー
      </button>
      <button onclick={() => actions.up(1)}>＋</button>
    </main>
  )

app(state, actions, view, document.body)
