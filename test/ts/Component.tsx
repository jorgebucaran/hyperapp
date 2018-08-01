import {
  h,
  app,
  LazyComponent,
  Component,
  View,
  ActionType,
  ActionsType
} from "hyperapp"

interface State {
  count: number
}

const state: State = { count: 10 }

interface Actions {
  down: ActionType<State, Actions>
  up: ActionType<State, Actions>
}

const actions: ActionsType<State, Actions> = {
  down: () => state => ({ count: state.count - 1 }),
  up: (value: number) => state => ({
    count: state.count + value
  })
}

interface ComponentParams {
  count: number
  up: () => void
  down: () => void
}
const Counter: Component<ComponentParams> = ({ count, up, down }) => (
  <div>
    <div>{count}</div>
    <button onclick={down}>-</button>
    <button onclick={up}>+</button>
  </div>
)

interface LazyComponentParams {
  label: string
}
const LazyCounter: LazyComponent<LazyComponentParams, State, Actions> = ({
  label
}) => (state, actions) => (
  <div>
    <div>
      {label}: {state.count}
    </div>
    <button onclick={actions.down}>-</button>
    <button
      onclick={() => {
        actions.up(2)
      }}
    >
      +
    </button>
  </div>
)

const view: View<State, Actions> = (state, actions) => (
  <main>
    <Counter count={state.count} up={() => actions.up(2)} down={actions.down} />
    <LazyCounter label={"Lazy"} />
  </main>
)

app<State, Actions>(state, actions, view, document.body)
