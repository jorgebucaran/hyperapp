// TODO:

import type { Dispatch, State, Subscription } from "hyperapp"

import { app, h, text } from "hyperapp"

const fooSubscription = <S>(_dispatch: Dispatch<S>): void => {
  console.log("foo sub")
}

type Test = { foo: number }

// $ExpectType void
app<Test>({
  init: { foo: 2 },
  view: (state) => h("p", {}, [text(state.foo)]),
  subscriptions: (_state: State<Test>): Subscription<Test>[] => [
    fooSubscription,
  ],
  node: document.body
})
