import { h, app } from "hyperapp"

// Sub-module (used by Module 1)

interface SubModuleState {
  count: number
}

interface SubModuleActions {
  sub(value: number): Partial<SubModuleState>
  add(value: number): Partial<SubModuleState>
}

// no need to specify OwnState and OwnActions here since it defaults to full state/actions
const submodule: Hyperapp.Module<SubModuleState, SubModuleActions> = {
  state: {
    count: 0
  },
  actions: {
    add: (state, actions) => (value: number) => ({
      count: state.count + value
    }),
    sub: (state, actions) => ({ count: state.count - 1 })
  }
}

// just to check that it compiles
function testSubmodule() {
  const actions = app<SubModuleState, SubModuleActions>(submodule)
  console.log(actions.add(6).count)
}

// Module 1 (utilize modules feature)

// only its own state
interface Module1OwnState {
  count: number
}
// state including sub-modules
interface Module1State extends Module1OwnState {
  submodule: SubModuleState
}
// only its own actions
interface Module1OwnActions {
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
    add: (state, actions) => (value: number) => ({
      count: state.count + value
    }),
    sub: (state, actions) => ({ count: state.count - 1 })
  },
  modules: {
    submodule
  }
}

function testModule1() {
  const actions = app<
    Module1State,
    Module1Actions,
    Module1OwnState,
    Module1OwnActions
  >(module1)
  console.log(actions.add(8).count)
}

// Async Module (without modules feature)

interface AsyncModuleState {
  value?: Error | number
}

const asyncModuleState: AsyncModuleState = {}

interface AsyncModuleActions {
  setResult(value: Error | number): void
  fetch(url: string): Promise<void>
}

const asyncModuleActions: Hyperapp.InternalActions<
  AsyncModuleState,
  AsyncModuleActions
> = {
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
  const actions = app<AsyncModuleState, AsyncModuleActions>({
    state: asyncModuleState,
    actions: asyncModuleActions
  })
  actions.fetch("blah").then(() => {
    console.log("Done!")
  })
}

// App's own state/actions (without modules)

interface OwnState {
  async: AsyncModuleState
  // just to demonstrate there can be other attributes than the ones defined in actions
  unused?: number
  unused2: {
    foo: string
  }
}

const state: OwnState = {
  async: asyncModuleState,
  unused2: {
    foo: "bar"
  }
}

interface OwnActions {
  async: AsyncModuleActions
}

const actions: Hyperapp.InternalActions<OwnState, OwnActions> = {
  async: asyncModuleActions
}

// App + modules actions/state

interface State extends OwnState {
  module1: Module1State
}

interface Actions extends OwnActions {
  module1: Module1Actions
}

// App

const appActions = app<State, Actions, OwnState, OwnActions>(
  {
    state,
    actions,
    modules: { module1 },
    view: (state, actions) => (
      <main>
        <h1>Typescript Demo</h1>
        <h2>Module 1</h2>
        <p>
          <button onclick={() => actions.module1.sub(1)}>-</button>
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
