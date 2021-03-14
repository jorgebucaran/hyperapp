import type { Dispatch, Effect, Payload, State, StateWithEffects } from "hyperapp"

import { app, h, text } from "hyperapp"

type Test = { x: number, y: number }

// $ExpectType void
app<Test>({
  init: { x: 2, y: 4 },
  view: (state) => h("div", {}, [
    h("button", {
      onclick: (state) => ({ ...state, x: state.x * 2 })
    }, [text(state.x)]),
    h("button", {
      onclick: (state) => [{ ...state, x: state.x * 2 }]
    }, [text(state.x)]),
  ]),
  node: document.body
})

// -----------------------------------------------------------------------------

const runJustEcho = (_dispatch: Dispatch<Test>, data?: Payload<string>): void => {
  console.log(data)
}

const justEcho: Effect<Test, string> = (x) => [runJustEcho, x]

// $ExpectType void
app<Test>({
  init: { x: 2, y: 4 },
  view: (state) => h("button", {
    onclick: (state) => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType void
app<Test>({
  init: { x: 2, y: 4 },
  view: (state) => h("button", {
    onclick: (state: State<Test>): StateWithEffects<Test> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType void
app<Test>({
  init: { x: 2, y: 4 },
  view: (state) => h("button", {
    onkeypress: (state: State<Test>): StateWithEffects<Test> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType void
app<Test>({
  init: { x: 2, y: 4 },
  view: (state) => h("button", {
    onclick: (state) => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
    onkeypress: (state) => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType void
app<Test>({
  init: { x: 2, y: 4 },
  view: (state) => h("button", {
    onclick: (state: State<Test>): StateWithEffects<Test> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
    onkeypress: (state: State<Test>): StateWithEffects<Test> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})
