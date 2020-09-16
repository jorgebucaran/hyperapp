import {
  Dispatch, EffectData, EffectDescriptor, State, Transition,
  app, h, text,
} from "hyperapp"

type Test = { x: number }

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { x: 2 },
  view: (state) => h("button", {
    onclick: (state) => ({ ...state, x: state.x * 2 })
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { x: 2 },
  view: (state) => h("button", {
    onclick: (state) => [{ ...state, x: state.x * 2 }]
  }, [text(state.x)]),
  node: document.body
})

// -----------------------------------------------------------------------------

const runJustEcho = <S, P, D>(_dispatch: Dispatch<S, P, D>, data: EffectData<D>) => {
  console.log(data)
}

const justEcho = <P>(x: string): EffectDescriptor<Test, P> =>
  [runJustEcho, x]

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { x: 2 },
  view: (state) => h("button", {
    onclick: (state) => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { x: 2 },
  view: (state) => h("button", {
    onclick: (state: State<Test>): Transition<Test, MouseEvent> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { x: 2 },
  view: (state) => h("button", {
    onkeypress: (state: State<Test>): Transition<Test, KeyboardEvent> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { x: 2 },
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

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { x: 2 },
  view: (state) => h("button", {
    onclick: (state: State<Test>): Transition<Test, MouseEvent> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
    onkeypress: (state: State<Test>): Transition<Test, KeyboardEvent> => [
      { ...state, x: state.x * 2 },
      justEcho("hi"),
    ],
  }, [text(state.x)]),
  node: document.body
})
