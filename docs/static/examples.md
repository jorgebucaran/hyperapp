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

## [Calculator](https://codesandbox.io/s/hyperapp-calculator-v8y5h)

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

## [Simple Clock](https://codesandbox.io/s/hyperapp-simple-clock-uhk59)

```js
import { h, app } from "hyperapp"
import { interval } from "@hyperapp/time"

const timeToUnits = t => [t.getHours(), t.getMinutes(), t.getSeconds()]

const formatTime = (hours, minutes, seconds, use24) =>
  (use24 ? hours : hours > 12 ? hours - 12 : hours) +
  ":" +
  `${minutes}`.padStart(2, "0") +
  ":" +
  `${seconds}`.padStart(2, "0") +
  (use24 ? "" : ` ${hours > 12 ? "PM" : "AM"}`)

const posixToHumanTime = (time, use24) =>
  formatTime(...timeToUnits(new Date(time)), use24)

const Tick = (state, time) => ({
  ...state,
  time
})

const ToggleFormat = state => ({
  ...state,
  use24: !state.use24
})

const getInitialState = time => ({
  time,
  use24: false
})

app({
  init: getInitialState(Date.now()),
  view: state =>
    h("div", {}, [
      h("h1", {}, posixToHumanTime(state.time, state.use24)),
      h("fieldset", {}, [
        h("legend", {}, "Settings"),
        h("label", {}, [
          h("input", {
            type: "checkbox",
            checked: state.use24,
            onInput: ToggleFormat
          }),
          "Use 24 Hour Clock"
        ])
      ])
    ]),
  subscriptions: state => interval(Tick, { delay: 1000 }),
  node: document.getElementById("app")
})
```

## [Todo App](https://codesandbox.io/s/hyperapp-todo-app-m3ctx)

```js
import { h, app } from "hyperapp"
import { preventDefault, targetValue } from "@hyperapp/events"

const getInitialState = items => ({ items, value: "" })

const newItem = value => ({
  value,
  lastValue: "",
  isEditing: false,
  id: Math.random().toString(36)
})

const NewValue = (state, value) => ({ ...state, value })

const Add = state =>
  state.value.length === 0
    ? state
    : {
        ...state,
        value: "",
        items: state.items.concat(newItem(state.value))
      }

const TodoList = items =>
  h("ol", {}, items.map(item => h("li", {}, item.value)))

app({
  init: getInitialState([newItem("Take out the trash")]),
  view: state =>
    h("div", {}, [
      h("h1", {}, "What needs done?"),
      TodoList(state.items),
      h("form", { onSubmit: preventDefault(Add) }, [
        h("label", {}, [
          h("input", {
            value: state.value,
            onInput: [NewValue, targetValue]
          })
        ]),
        h("button", {}, `New #${state.items.length + 1}`)
      ])
    ]),
  node: document.getElementById("app")
})
```
