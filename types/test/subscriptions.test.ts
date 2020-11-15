// TODO:

import type { Dispatch, State, Subscriber } from "hyperapp"

import { app, h, text } from "hyperapp"

const fooSubscription = <S>(_dispatch: Dispatch<S>): void => {
  console.log("foo sub")
}

type Test = { foo: number }

// $ExpectType Dispatch<Test>
app<Test>({
  init: { foo: 2 },
  view: (state) => h("p", {}, [text(state.foo)]),
  subscriptions: (_state: State<Test>): Subscriber<Test>[] => [
    fooSubscription,
  ],
  node: document.body
})
