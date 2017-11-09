import { h, app } from "hyperapp"

// A counter "module"

interface CounterState {
  count: number
}

interface CounterActions {
  sub(): Partial<CounterState>
  add(value: number): Partial<CounterState>
}

const counterState: CounterState = {
  count: 0
}

const counterActions: Hyperapp.InternalActions<CounterState, CounterActions> = {
  sub: (state, actions) => ({ count: state.count - 1 }),
  add: (state, actions) => (value: number) => ({
    count: state.count + value
  })
}

// just to check that it compiles
function testCounter() {
  const actions = app<CounterState, CounterActions>({
    state: counterState,
    actions: counterActions
  })
  console.log(actions.add(6).count)
}

// Module 1 (uses the counter)

interface Module1State {
  count: number
  counter: CounterState
}

interface Module1Actions {
  counter: CounterActions
  sub(): Partial<Module1State>
  add(value: number): Partial<Module1State>
}

const module1State: Module1State = {
  counter: counterState,
  count: 0
}

const module1Actions: Hyperapp.InternalActions<Module1State, Module1Actions> = {
  counter: counterActions,
  sub: (state, actions) => ({ count: state.count - 1 }),
  add: (state, actions) => (value: number) => ({
    count: state.count + value
  })
}

function testModule1() {
  const actions = app<Module1State, Module1Actions>({
    state: module1State,
    actions: module1Actions
  })
  console.log(actions.add(8).count)
  console.log(actions.counter.sub().count)
}

// Async Module

interface AsyncState {
  value?: Error | number
}

interface AsyncActions {
  setResult(value: Error | number): void
  fetch(url: string): Promise<void>
}

const asyncState: AsyncState = {}

const asyncActions: Hyperapp.InternalActions<AsyncState, AsyncActions> = {
  setResult: (state, actions) => (value: number | Error) => ({ value }),
  fetch: (state, actions) => (url: string) =>
    fetch(url)
      .then(res => res.json())
      .then(value => {
        actions.setResult(value)
      })
      .catch(err => {
        actions.setResult(err)
      })
}

function testAsync() {
  const actions = app<AsyncState, AsyncActions>({
    state: asyncState,
    actions: asyncActions
  })
  actions.fetch("blah").then(() => {
    console.log("Done!")
  })
}

// App's own state/actions (without modules)

interface State {
  module1: Module1State
  async: AsyncState
  count: number
  // just to demonstrate there can be other attributes than the ones defined in actions
  unused?: number
  unused2: {
    foo: string
  }
}

const state: State = {
  module1: module1State,
  async: asyncState,
  count: 0,
  unused2: {
    foo: "bar"
  }
}

interface Actions {
  module1: Module1Actions
  async: AsyncActions
  add(value: number): Partial<State>
}

const actions: Hyperapp.InternalActions<State, Actions> = {
  module1: module1Actions,
  async: asyncActions,
  add: (state, actions) => (value: number) => ({
    count: state.count + value
  })
}

// App

const appActions = app<State, Actions>(
  {
    state,
    actions,
    view: (state, actions) => (
      <main>
        <h1>Typescript Demo</h1>
        <h2>Module 1</h2>
        <p>
          <button onclick={() => actions.module1.sub()}>-</button>
          {state.module1.count}
          <button onclick={() => actions.module1.add(2)}>+</button>
        </p>
        <h2>Async</h2>
        <p>
          <button
            onclick={() => actions.async.fetch("https://hyperapp.js.org/")}
          >
            Fetch
          </button>
          <pre>{state.async.value}</pre>
        </p>
      </main>
    )
  },
  document.getElementById("app")
)
