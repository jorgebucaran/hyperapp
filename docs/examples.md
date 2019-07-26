# Examples

## [Counter](https://codesandbox.io/s/hyperapp-playground-fwjlo)

```js
import { h, app } from "https://unpkg.com/hyperapp"

app({
  init: 0,
  view: state =>
    h("div", {}, [
      h("h1", {}, state),
      h("button", { onClick: state => state - 1 }, "-"),
      h("button", { onClick: state => state + 1 }, "+")
    ]),
  node: document.getElementById("app")
})
```

## [Calculator](https://codesandbox.io/s/elastic-sunset-rrl2z7nwrn)

```js
import { h, app } from "hyperapp"

const computer = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b
}

const initialState = {
  fn: "",
  carry: 0,
  value: 0,
  hasCarry: false
}

const Clear = () => initialState

const NewDigit = (state, number) => ({
  ...state,
  hasCarry: false,
  value: (state.hasCarry ? 0 : state.value) * 10 + number
})

const NewFunction = (state, fn) => ({
  ...state,
  fn,
  hasCarry: true,
  carry: state.value,
  value:
    state.hasCarry || !state.fn
      ? state.value
      : computer[state.fn](state.carry, state.value)
})

const Equal = state => ({
  ...state,
  hasCarry: true,
  carry: state.hasCarry ? state.carry : state.value,
  value: state.fn
    ? computer[state.fn](
        state.hasCarry ? state.value : state.carry,
        state.hasCarry ? state.carry : state.value
      )
    : state.value
})

const Calculator = state =>
  h("main", {}, [
    Display(state.value),
    Keypad([
      Functions({ keys: Object.keys(computer) }),
      Digits({ keys: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0] }),
      AC,
      EQ
    ])
  ])

const Display = value => h("div", { class: "display" }, value)

const Keypad = children => h("div", { class: "keys" }, children)

const Functions = props =>
  props.keys.map(fn =>
    h("button", { class: "function", onClick: [NewFunction, fn] }, fn)
  )

const Digits = props =>
  props.keys.map(digit =>
    h(
      "button",
      { class: { zero: digit === 0 }, onClick: [NewDigit, digit] },
      digit
    )
  )

const AC = h("button", { onClick: Clear }, "AC")
const EQ = h("button", { onClick: Equal, class: "equal" }, "=")

app({
  init: initialState,
  view: Calculator,
  node: document.getElementById("app")
})
```
