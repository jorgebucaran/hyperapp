import {
  Dispatch, Effect, EffectDescriptor, EffectfulState, Payload, State,
  app, h, text,
} from "hyperapp"

type Test = { x: number, y: number }

// $ExpectType Dispatch<Test>
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

const justEcho = (x: string): EffectDescriptor<Test, string> =>
  [runJustEcho, x]

// $ExpectType Dispatch<Test>
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

// $ExpectType Dispatch<Test>
app<Test>({
  init: { x: 2, y: 4 },
  view: (state) => h("button", {
    onclick: (state: State<Test>): EffectfulState<Test> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType Dispatch<Test>
app<Test>({
  init: { x: 2, y: 4 },
  view: (state) => h("button", {
    onkeypress: (state: State<Test>): EffectfulState<Test> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType Dispatch<Test>
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

// $ExpectType Dispatch<Test>
app<Test>({
  init: { x: 2, y: 4 },
  view: (state) => h("button", {
    onclick: (state: State<Test>): EffectfulState<Test> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
    onkeypress: (state: State<Test>): EffectfulState<Test> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})
