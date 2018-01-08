import { h, app, View, StateType, UnwiredActions, UnwiredAction } from 'hyperapp'

namespace Counter {
  export interface State extends StateType {
    count: number
    clickCount: number
  }

  export interface Actions extends UnwiredActions<State, Actions> {
    down: UnwiredAction<State, Actions>
    up: UnwiredAction<State, Actions, number>
    addClickCount: UnwiredAction<State, Actions>
  }

  export const state: State = {
    count: 0,
    clickCount: 0,
  }

  export const actions: Actions = {
    down: () => (state, actions) => {
      actions.addClickCount()
      return { count: state.count - 1 }
    },
    up: (value = 1) => (state, actions) => {
      actions.addClickCount()
      return { count: state.count + value }
    },
    addClickCount: () => state => ({ clickCount: state.clickCount + 1 }),
  }
}

const view: View<Counter.State, Counter.Actions> = (state, actions) => (
  <main>
    <div>{state.count}</div>
    <button onclick={actions.down}>-</button>
    <button onclick={() => actions.up()}>+</button>
    <button onclick={() => actions.up(5)}>+5</button>
  </main>
)

const main = app<Counter.State, Counter.Actions>(
  Counter.state,
  Counter.actions,
  view,
  document.body
)

main.up()
