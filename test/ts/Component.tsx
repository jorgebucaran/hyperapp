import { h, Component } from "hyperapp"

interface State {
  count: number
}

interface Actions {
  down(): State
  up(value: number): State
}

const Counter: Component<{ state: State; actions: Actions }> = ({
  state,
  actions
}) => (
  <div>
    <div>{state.count}</div>
    <button onclick={actions.down}>-</button>
    <button onclick={actions.up}>+</button>
  </div>
)

const LazyCounter: Component<{}, State, Actions> = () => (state, actions) => (
  <div>
    <div>{state.count}</div>
    <button onclick={actions.down}>-</button>
    <button onclick={actions.up}>+</button>
  </div>
)
