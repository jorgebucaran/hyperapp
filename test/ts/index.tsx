import { h, app } from "hyperapp"

// Module 1

interface Module1State extends Hyperapp.State {
  count: number
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

interface Module2Actions extends Hyperapp.Actions<Module2State> {
  reset(): Partial<Module2State>
  add(value: number): Partial<Module2State>
}

const module2Actions: Hyperapp.InternalActions<Module2State, Module2Actions> = {
  reset: (state, actions) => ({ count: 0 }),
  add: (state, actions, value: number) => ({ count: state.count + value })
}

// app

interface State extends Hyperapp.State {
  module1: Module1State
  module2: Module2State
  // just to demonstrate there can be other attributes than the ones defined in actions
  unused?: number
  unused2: {
    foo: string
  }
}

interface Actions extends Hyperapp.Actions<State> {
  module1: Module1Actions
  module2: Module2Actions
}

const actions: Hyperapp.InternalActions<State, Actions> = {
  module1: module1Actions,
  module2: module2Actions
}

interface Events extends Hyperapp.Events<State, Actions> {
  log: (state: State, actions: Actions, value: string) => void
}

const emit = app<State, Actions, Events>({
  state: {
    module1: {
      count: 0
    },
    module2: {
      count: 0
    },
    unused2: {
      foo: "I have to set a value here, otherwise compilation error."
    }
  },
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
    </main>
  ),
  actions,
  events: {
    log(state, actions, value) {
      console.log(value + " " + state.module1.count)
    }
  },
  root: document.getElementById("app")
})

emit("log", "Hello")
