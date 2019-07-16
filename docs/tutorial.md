# Tutorial

> A step-by-step walkthrough of building a Hyperapp app from scratch. Start here if you're new to Hyperapp.

Just an example for now. You can try it online [here](https://codepen.io/anon/pen/QXeZKz).

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
  node: document.getElementById("app"),
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
  subscriptions: state => interval(Tick, { delay: 1000 })
})
```
