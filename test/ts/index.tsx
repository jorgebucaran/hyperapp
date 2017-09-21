import { h, app } from "hyperapp"

interface State extends Hyperapp.State {
  count: number
}

interface Actions extends Hyperapp.Actions<State> {
  sub(state: State, actions: ActionCallers, value: number): Partial<State>
  add(state: State, actions: ActionCallers, value: number): Partial<State>
}

interface ActionCallers extends Hyperapp.ActionCallers<State, Actions> {}

interface Events extends Hyperapp.Events<State, Actions> {
  log: (state: State, actions: ActionCallers, value: string) => void
}

const emit = app<State, Actions, Events>({
  state: {
    count: 0
  },
  view: (state, actions: ActionCallers) => (
    <main>
      <h1>{state.count}</h1>
      <button onclick={() => actions.sub(1)}>-</button>
      <button onclick={() => actions.add(2)}>+</button>
    </main>
  ),
  actions: {
    sub: (state, actions, value) => ({ count: state.count - value }),
    add: (state, actions, value) => ({ count: state.count + value })
  },
  events: {
    log(state, actions, value) {
      console.log(value + " " + state.count)
    }
  },
  root: document.getElementById("app")
})

emit("log", "Hello")
