import { app, h, text } from "hyperapp"

app()             // $ExpectError
app(true)         // $ExpectError
app(false)        // $ExpectError
app(0)            // $ExpectError
app(2424)         // $ExpectError
app(-123)         // $ExpectError
app(-Infinity)    // $ExpectError
app(Infinity)     // $ExpectError
app(NaN)          // $ExpectError
app("")           // $ExpectError
app("hi")         // $ExpectError
app({})           // $ExpectError
app(new Set())    // $ExpectError
app([])           // $ExpectError
app(Symbol())     // $ExpectError
app(() => {})     // $ExpectError
app(null)         // $ExpectError
app(undefined)    // $ExpectError

// -----------------------------------------------------------------------------

type Test = { bar?: number, foo: number }

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { foo: 2 },
  view: (state) => h("p", {}, [text(state.bar ?? "")]),
  node: document.body
})

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { foo: 2 },
  view: (state) => h("div", {}, [
    text(state.foo),
    text(state.bar ?? ""),
    h("button", {
      onclick: (state) => ({ ...state, bar: state.foo * 2 })
    }, [text("clicky")]),
  ]),
  node: document.body
})

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { foo: 2 },
  view: (state) => h("div", {}, [
    text(state.foo),
    text(state.bar ?? ""),
    h("button", {
      onclick: (state) => ({ ...state, bar: state.foo * 2 }),
      onchange: (state, event) => {
        if (!event) return state
        const target = event.target as HTMLInputElement
        return ({ ...state, bar: target.checked ? 20 : 10 })
      },
    }, [text("clicky")]),
  ]),
  node: document.body
})

// -----------------------------------------------------------------------------

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { foo: 2 },
  view: (state) => h("p", {}, [text(state.foo)]),
  node: document.body,
  middleware: (dispatch) => dispatch
})

// $ExpectType Dispatch<Test, unknown, unknown>
app<Test>({
  init: { foo: 2 },
  view: (state) => h("p", {}, [text(state.foo)]),
  node: document.body,
  middleware: (dispatch) => (action, props) => {
    console.log(action)
    console.log(props)
    dispatch(action, props)
  }
})
