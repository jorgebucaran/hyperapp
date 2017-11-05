import { h, app } from "hyperapp"

// Sub-module (used by Module 1)

interface SubModuleState extends Hyperapp.State {
  count: number
}

interface SubModuleActions extends Hyperapp.Actions<Module1State> {
  sub(value: number): Partial<Module1State>
  add(value: number): Partial<Module1State>
}

// no need to specify OwnState and OwnActions here since it defaults to full state/actions
const submodule: Hyperapp.Module<SubModuleState, SubModuleActions> = {
  state: {
    count: 0
  },
  actions: {
    sub: (state, actions, value: number) => ({ count: state.count - value }),
    add: (state, actions, value: number) => ({ count: state.count + value })
  }
}

// Module 1 (utilize modules feature)

// only its own state
interface Module1OwnState extends Hyperapp.State {
  count: number
}
// state including sub-modules
interface Module1State extends Module1OwnState {
  submodule: SubModuleState
}
// only its own actions
interface Module1OwnActions extends Hyperapp.Actions<Module1OwnState> {
  sub(value: number): Partial<Module1State>
  add(value: number): Partial<Module1State>
}
// actions including sub-modules
interface Module1Actions extends Module1OwnActions {
  submodule: SubModuleActions
}

const module1: Hyperapp.Module<
  Module1State,
  Module1Actions,
  Module1OwnState,
  Module1OwnActions
> = {
  state: {
    count: 0
  },
  actions: {
    sub: (state, actions, value: number) => ({ count: state.count - value }),
    add: (state, actions, value: number) => ({ count: state.count + value })
  },
  modules: {
    submodule
  }
}

// Async Module (without modules feature)

interface AsyncModuleState {
  value?: Error | number
}

const asyncModuleState: AsyncModuleState = {}

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

// App's own state/actions (without modules)

interface AppState extends Hyperapp.State {
  async: AsyncModuleState
  // just to demonstrate there can be other attributes than the ones defined in actions
  unused?: number
  unused2: {
    foo: string
  }
}

const state: AppState = {
  async: asyncModuleState,
  unused2: {
    foo: "bar"
  }
}

interface AppActions extends Hyperapp.Actions<AppState> {
  async: AsyncModuleActions
}

const actions: Hyperapp.InternalActions<AppState, AppActions> = {
  async: asyncModuleActions
}

// App + modules actions/state

interface State extends AppState {
  module1: Module1State
}

interface Actions extends AppActions {
  module1: Module1Actions
}

// App

const appActions = app<State, Actions, AppState, AppActions>(
  {
    state: state,
    actions,
    modules: {
      module1
    },
    // no need to set the types here
    view: (state, actions) => (
      <main>
        <h1>Typescript Demo</h1>
        <h2>Module 1</h2>
        <p>
          <button onclick={() => actions.module1.sub(-1)}>-</button>
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
