import { h, app } from "hyperapp"

// Module 1

interface Module1State extends Hyperapp.State {
  count: number
}

const module1InitialState: Module1State = {
  count: 0
}

interface Module1Actions extends Hyperapp.Actions<Module1State> {
  sub(value: number): Partial<Module1State>
  add(value: number): Partial<Module1State>
}

const module1Actions: Hyperapp.InternalActions<Module1State, Module1Actions> = {
  sub: (state, actions, value: number) => ({ count: state.count - value }),
  add: (state, actions, value: number) => ({ count: state.count + value })
}

// Module 2

interface Module2State {
  count: number
}

const module2InitialState: Module2State = {
  count: 0
}

interface Module2Actions extends Hyperapp.Actions<Module2State> {
  reset(): Partial<Module2State>
  add(value: number): Partial<Module2State>
}

const module2Actions: Hyperapp.InternalActions<Module2State, Module2Actions> = {
  reset: (state, actions) => ({ count: 0 }),
  add: (state, actions, value: number) => ({ count: state.count + value })
}

// Async Module
interface AsyncModuleState {
  value?: Error | number
}

const asyncModuleInitialState: AsyncModuleState = {}

interface AsyncModuleActions extends Hyperapp.Actions<AsyncModuleState> {
  fetch(url: string): Hyperapp.Thunk<AsyncModuleState>
}

const asyncModuleActions: Hyperapp.InternalActions<
  AsyncModuleState,
  AsyncModuleActions
> = {
  fetch: (state, actions, url: string) => {
    return (update: Hyperapp.Update<AsyncModuleState>) => {
      fetch(url)
        .then(res => {
          update({
            value: res.status
          })
        })
        .catch(err => {
          update({
            value: err
          })
        })
    }
  }
}

// app

interface State extends Hyperapp.State {
  module1: Module1State
  module2: Module2State
  async: AsyncModuleState
  // just to demonstrate there can be other attributes than the ones defined in actions
  unused?: number
  unused2: {
    foo: string
  }
}

const initialState: State = {
  module1: module1InitialState,
  module2: module2InitialState,
  async: asyncModuleInitialState,
  unused2: {
    foo: "bar"
  }
}

interface Actions extends Hyperapp.Actions<State> {
  module1: Module1Actions
  module2: Module2Actions
  async: AsyncModuleActions
}

const actions: Hyperapp.InternalActions<State, Actions> = {
  module1: module1Actions,
  module2: module2Actions,
  async: asyncModuleActions
}

const appActions = app<State, Actions>(
  {
    state: initialState,
    // no need to set the types here
    view: (state, actions) => (
      <main>
        <h1>Typescript Demo</h1>
        <h2>Module 1</h2>
        <p>
          <button onclick={() => actions.module1.sub(-1)}>-</button>
          {state.module1.count}
          <button onclick={() => actions.module2.add(2)}>+</button>
        </p>
        <h2>Module 2</h2>
        <p>
          <button onclick={() => actions.module2.reset()}>Reset</button>
          {state.module2.count}
          <button onclick={() => actions.module2.add(1)}>+</button>
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
    ),
    actions
  },
  document.getElementById("app")
)
