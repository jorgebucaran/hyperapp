# Effects

_**Definition:**_

> An **effect** is a representation used by actions to interact with some external process.

As with [subscriptions](subscriptions.md), effects are used to deal with impure asynchronous interactions with the outside world in a safe, pure, and immutable way. Creating an HTTP request, giving focus to a DOM element, saving data to local storage, sending data over a WebSocket, and so on, are all examples of effects at a conceptual level.

**_Signature:_**

```elm
Effect : EffecterFn | [EffecterFn, Payload]
```

**_Naming Recommendation:_**

Effects are recommended to be named in `camelCase` using a verb (for instance `log`) or verb-noun phrase (like `saveAsPDF`) in its imperative form for the name.

## Using Effects

An action can associate its state transition with a list of one or more [effects](#effects) to run alongside the transition. It does this by returning an array containing the [state with effects](state.md#state-with-effects) where the first entry is the next state while the remaining entries are the effects to run.

```js
import { log } from "./fx"

// Action : (State) -> [NextState, ...Effects]
const SayHi = (state) => [
  { ...state, value: state.value + 1 },
  log("hi"),
  log("there"),
]

// ...

h("button", { onclick: SayHi }, text("Say Hi"))
```

Actions can of course receive payloads and use effects simultaneously.

```js
// Action : (State, Payload) -> [NextState, ...Effects]
const SayBye = (state, amount) => [
  { ...state, value: state.value + amount },
  log("bye"),
]

// ...

h("button", { onclick: [SayBye, 1] }, text("Bye"))
```

## Excluding Effects

If you don't include any effects in the return array then only the state transition happens.

Here, `OnlyIncrement` both behaves and is used similarly to `Increment` [shown here](actions.md#actual-state-transition):

```js
// Action : (State) -> [NextState]
const OnlyIncrement = (state) => [{ ...state, value: state.value + 1 }]

// ...

h("button", { onclick: OnlyIncrement }, text("+"))
```

Such a single-element array may seem redundant at first but it can come into play if you have an action that conditionally runs effects.

For example, compare this:

```js
const DoIt = (state) => {
  let transition = { ...state, value: "MacGuffin" }
  if (state.eating) {
    transition = [transition, log("eating")]
  }
  if (state.drinking) {
    transition = Array.isArray(transition)
      ? [...transition, log("drinking")]
      : [transition, log("drinking")]
  }
  return transition
}
```

<!-- In fiction, a MacGuffin is something that's necessary to the plot and the motivation of the characters but unimportant in itself. -->

with this:

```js
const DoItBetter = (state) => {
  let transition = [{ ...state, value: "MacGuffin" }]
  if (state.eating) {
    transition = [...transition, log("eating")]
  }
  if (state.drinking) {
    transition = [...transition, log("drinking")]
  }
  return transition
}
```

Admittedly, these examples are a bit contrived but the latter is less complex.

However, for these examples in particular we can do even better by taking advantage of the fact that any "effects" that are actually falsy values are ignored.

```js
const DoItBest = (state) => [
  { ...state, value: "MacGuffin" },
  state.eating && log("eating"),
  state.drinking && log("drinking"),
]
```

## Defining Effects

Syntactically speaking, an effect takes the form of a tuple containing its [effecter](#effecters) and any associated data.

Technically, an effect can be used directly but using a function that creates the effect is recommended because it offers flexibility with how the tuple is created while looking a little cleaner overall.

```js
const massFx = (data) => [runNormandy, data]
```

<!-- `massFx` is a play on the title of the videogame series "Mass Effect". The SSV Normandy SR-1 is the spaceship the player travels in throughout the series. -->

## Effecters

**_Definition:_**

> An **effecter** is the function that actually carries out an effect.

**_Signature:_**

```elm
EffecterFn : (DispatchFn, Payload?) -> void
```

As with [subscribers](subscriptions.md#subscribers), effecters are allowed to use side-effects and can also manually [`dispatch`](dispatch.md) actions in order to inform your app of any pertinent results from their execution.

It's important to know that effecters are more than just a way to wrap any arbitrary impure code. Their purpose is to be a generalized bridge between your app's business logic and the impure code that needs to exist. By keeping the effecters as generic as we can, we form a clean, manageable separation between what is requested to be done from how that request is done.

To demonstrate this approach take this ill-formed effecter for example:

```js
// This effecter is ill-formed.
const runHarvest = (dispatch, _payload) => {
  const tiberium = document.getElementById("tiberium")
  dispatch((state) => ({ ...state, tiberium }))
}
```

<!-- In the videogame series "Command & Conquer", Tiberium is a toxic alien crystalline substance that can be harvested for its energy. -->

Sure it runs, but it's also coupled to our app's state and the element ID being referenced is also hard-coded.

Let's address this by first decoupling our callback action from the effecter by leveraging our ability to give the effecter a payload:

```js
const runHarvest = (dispatch, payload) => 
  dispatch(payload.action, document.getElementById("tiberium"))
```

Let's further utilize our payload by using it to pass in data our effecter needs to work:

```js
const runHarvest = (dispatch, payload) => 
  dispatch(payload.action, document.getElementById(payload.id))
```

Finally, we should rename the effecter to reflect its generic nature:

```js
const runGetElement = (dispatch, payload) => 
  dispatch(payload.action, document.getElementById(payload.id))
```

A well-formed effecter is as generic as it can be.

### Synchronization

Effecters which run some asynchronous operation and wish to report the results of it back to your app will need to ensure that the timing of their communication dispatch happens in alignment with Hyperapp's repaint cycle. This is important to ensure the state is set correctly.

Hyperapp's repaint cycle stays synchronized with the browser's natural repaint cycle, so asynchronous effecters must do the same. The preferred way to do this is with [`requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). If for some reason that method is unavailable, the fallback is [`setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).

Let's see an example of an ill-formed asynchronous effecter:

```js
// This effecter is ill-formed.
const runBrotherhood = async (dispatch, payload) => {
  const response = await fetch(payload.lookForKaneHere)
  const kaneLives = response.json()
  requestAnimationFrame(() => {
    dispatch((state) => ({
      ...state,
      message: kaneLives ? "One vision! One purpose!" : "",
    }))
  })
}
```

<!-- In the videogame series "Command & Conquer", Kane is the leader of the Brotherhood of Nod and has cheated death at least once. One of his catchphrases is "One vision! One purpose!" -->

Now let's see a more well-formed asynchronous effecter:

```js
const runSimpleFetch = async (dispatch, payload) => {
  const response = await fetch(payload.url)
  requestAnimationFrame(() => dispatch(payload.action, response.json()))
}
```

### Custom Events

The ideal scenario to use custom effects is when your Hyperapp application needs to communicate with a legacy app via custom events.

We can have our Hyperapp application use a custom effect for triggering custom events.

```js
// ./fx.js

const runEmit = (_dispatch, payload) => 
  dispatchEvent(new CustomEvent(payload.type, { detail: payload.detail }))

export const emit = (type, detail) => [runEmit, { type, detail }]
```

```js
import { h, text, app } from "hyperapp"
import { emit } from "./fx"

app({
  view: () =>
    h("main", {}, [
      h(
        "button",
        {
          onclick: (state) => [
            state, 
            emit("outgoing", { message: "hello" })
          ],
        },
        text("Send greetings")
      ),
    ]),
  node: document.querySelector("main"),
})
```
