import type { Dispatch, Payload, State, Unsubscribe } from "hyperapp"

import { app, h, text } from "hyperapp"

type Test = {
  foo: number
  keepGoing: boolean
  stopping: boolean
}

const onKey = (...keys: string[]) => <S>(dispatch: Dispatch<S>, payload: Payload<any>): Unsubscribe => {
  const listener = (event: KeyboardEvent) => {
    if (keys.includes(event.key)) {
      window.requestAnimationFrame(() => dispatch(payload.action))
    }
  }
  document.addEventListener("keydown", listener)
  return () => document.removeEventListener("keydown", listener)
}

const Decrease = <S extends Test>(state: State<S>) => ({ ...state, foo: state.foo - 1 })
const Increase = <S extends Test>(state: State<S>) => ({ ...state, foo: state.foo + 1 })

// $ExpectType void
app<Test>({
  init: {
    foo: 2,
    keepGoing: true,
    stopping: false,
  },
  view: (state) =>
    h("div", {}, [
      h("button", { onclick: Decrease }, text("-one")),
      text(state.foo),
    ]),
  subscriptions: (state) => [
    [onKey("i"), { action: Increase }],
    state.keepGoing && [onKey("i"), { action: Increase }],
    state.stopping || [onKey("i"), { action: Increase }],
  ],
  node: document.body
})
