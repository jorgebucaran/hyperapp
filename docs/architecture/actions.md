# Actions

An **action** is a message used within your app that signals the valid way to change [state](state.md). It is implemented by a deterministic function that produces no side-effects which describes a transition between the current state and the next state and in so doing may optionally list out [effects](#effects) to be run as well.

Actions are dispatched by either DOM events in your app, [effecters](#effecters), or [subscribers](subscriptions.md#subscribers). When dispatched, actions always implicitly receive the current state as their first argument.

---

## Simple State Transitions

The simplest possible action merely returns the current state:

```js
const Identity = (state) => state
```

It seems useless at first but can be helpful as a placeholder for other actions while prototyping a new app or [component](views.md#components).

Probably the most common way to use an action is to assign it as an event handler for one of the nodes in your view.

```js
h("button", { onclick: Identity }, text("Do Nothing"))
```

The next simplest type of action merely sets the state.

```js
const FeedFace = () => 0xFEEDFACE
```
<!-- "FEEDFACE" is an example of "hexspeak", a variant of English spelling using hexadecimal digits. -->

But you'll most likely want to do actual state transitions.

```js
const Increment = (state) => ({ ...state, value: state.value + 1 })

// ...

h("button", { onclick: Increment }, text("+"))
```

---

## Payloads

Actions can also accept an optional **payload** along with the current state.

```js
const AddBy = (state, amount) => ({ ...state, value: state.value + amount })
```

To give a payload to an action we'll want to use an **action descriptor**.

```js
h("button", { onclick: [AddBy, 5] }, text("+5"))
```

### Event Payloads

Actions used as event handlers receive the event object as the default payload.

If we were to use our `AddBy` action without specifying its payload:

```js
h("button", { onclick: AddBy }, text("+5"))
```

then it will receive the event object when the user clicks it and will attempt to directly "add" that to our state which would obviously be a bug.

However, if we wanted to make proper use of the event object we have a couple options:

- Rewrite `AddBy` to account for the possibility of receiving an event payload.
- Or preprocess the event object to make it work with `AddBy` as it is.

The latter option is preferred because it lets our action remain unconcerned with how its payload is sourced thereby maintaining its reusability.

Which brings us to...

---

## Wrapped Actions

Actions can return other actions. The simplest form of these basically acts like an alias.

```js
const PlusOne = () => Increment
```

A more useful form preprocesses payloads to use with other actions. We can make an event adaptor so our primary action can use event data without coupling to the event source.

```js
const AddByValue = (state, event) => [AddBy, +event.target.value]
```

We'll make use of `AddByValue` with an `input` node instead of the `button` from earlier because we want the event that gets preprocessed to have a `value` property we can extract:

```js
h("input", { value: state, oninput: AddByValue })
```

You can keep wrapping actions for as long as your sanity permits. The benefit is the ability to chain together payload adjustments.

```js
const AddBy = (state, amount) => ({ ...state, value: state.value + amount })
const AddByMore = (_, amount) => [AddBy, amount + 5]
const AddByEvenMore = (_, amount) => [AddByMore, amount + 10]

// ...

h(
  "button",
  { onclick: [AddByEvenMore, 1] },
  text("+16")
)
```

---

## Transforms

You may consider refactoring very large and/or complicated actions it into simpler, more manageable functions. If so, remember that actions are just messages and, conceptually speaking, are not composable like the functions that implement them. That being said, it can at times be advantageous to delegate some state processing to other functions. Each of these consituent functions is a **transform** and is intended for use by actions or other transforms.

```js
const Liokaiser = (state) => ({
  ...state,
  combined: true,
  leftArm: hellbat(state),
  rightArm: guyhawk(state),
  upperTorso: leozack(state),
  lowerTorso: jallguar(state),
  leftLeg: drillhorn(state),
  rightLeg: killbison(state),
})
```
<!-- In the '80s Japanese animated series "Transformers: Victory", Liokaiser is a Decepticon combiner made from the combination of the team of Leozack, Drillhorn, Guyhawk, Hellbat, Jallguar, and Killbison. -->

---

## Stopping Your App

You can cease all Hyperapp processes by transitioning to an `undefined` state. This can be useful if you need to do specific cleanup work for your app.

```js
const Stop = () => undefined
```

Once your app stops, several things happen:

- All of the app's subscriptions stop.
- The DOM is no longer touched.
- Event handlers stop working.

A stopped app cannot be restarted.

If you encounter a scenario where your app doesn't respond when you click stuff within it then your app might've been stopped by mistake.

---

## Effects

An **effect** is a representation used by actions to interact with some external process. As with [subscriptions](subscriptions.md), effects are used to deal with impure asynchronous interactions with the outside world in a safe, pure, and immutable way. Creating an HTTP request, giving focus to a DOM element, saving data to local storage, sending data over a WebSocket, and so on, are all examples of effects at a conceptual level.

### Using Effects

An action can associate its state transition with a list of one or more [effects](#effects) to run alongside the transition. It does this by returning an array containing the [state with effects](state.md#state-with-effects) where the first entry is the next state while the remaining entries are the effects to run.

```js
import { log } from "./fx"

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
const SayBye = (state, amount) => [
  { ...state, value: state.value + amount },
  log("bye"),
]

// ...

h("button", { onclick: [SayBye, 1] }, text("Bye"))
```

### Excluding Effects

If you don't include any effects in the return array then only the state transition happens.

Here, `OnlyIncrement` both behaves and is used similarly to `Increment` from earlier:

```js
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

### Defining Effects

Syntactically speaking, an effect takes the form of a tuple containing its [effecter](#effecters) and any associated data.

Technically, an effect can be used directly but using a function that creates the effect is recommended because it offers flexibility with how the tuple is created while looking a little cleaner overall.

```js
const massFx = (data) => [runNormandy, data]
```
<!-- `massFx` is a play on the title of the videogame series "Mass Effect". The SSV Normandy SR-1 is the spaceship the player travels in throughout the series. -->

### Effecters

An **effecter** is the function that actually carries out the effect. As with [subscribers](subscriptions.md#subscribers), effecters are allowed to use side-effects and can also manually [`dispatch`](dispatch.md) actions in order to inform your app of any pertinent results from their execution.

It's important to know that effecters are more than just a way to wrap any arbitrary impure code. Their purpose is to be a generalized bridge between your app's business logic and the impure code that needs to exist. By keeping the effecters as generic as we can we form a clean, manageable separation between what is requested to be done from how that request is done.

To demonstrate this approach take this ill-formed effecter for example:

```js
// This effecter is ill-formed.
const runHarvest = (dispatch, _payload) => {
  const tiberium = document.getElementById("tiberium")
  dispatch((state) => ({ ...state, tiberium }))
}
```
<!-- In the videogame series "Command & Conquer", Tiberium is a toxic alien crystalline substance that can be harvested for its energy. -->

Sure it runs but it's also coupled to our app's state and the element ID being referenced is also hard-coded.

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

#### Synchonization

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

#### Custom Events

The ideal scenario to use custom effects is when your Hyperapp application needs to communicate with a legacy app via custom events.

We can have our Hyperapp application use a custom effect for triggering custom events.

```js
// ./fx.js

const runEmit = (_dispatch, payload) =>
  dispatchEvent(new CustomEvent(type, { detail: payload }))

export const emit = (type, props) => [runEmit, props]
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
            emit("outgoing", { message: "hello" }),
          ],
        },
        text("Send greetings")
      ),
    ]),
  node: document.getElementById("app"),
})
```

---

## Other Considerations

### Naming

Actions are recommended to be named in `PascalCase` to signal to the developer that they should be thought of as messages intended for use by Hyperapp itself.

### Transitioning Array State

An array returned from an action carries [special meaning as already mentioned earlier](#using-effects). For this reason actual [array state](state.md#array-state) needs special consideration.

There are a couple options available:

- Wrap the return state within an [effectful state array](state.md#state-with-effects).

  ```js
  const ArrayAction = (state) => [[...state, "one"]]
  ```

- Or you can choose a different format for the state by setting it up as an object that contains the the array so actions can work with it like they would with any other object state.

  ```js
  const ObjectAction = (state) => ({ ...state, list: [...state.list, "one"] })
  ```

### Nonstandard Usage

- Using an anonymous function for an action has the disadvantage that it has no name for debugging tools to make use of. That's significant because it's recommended that actions have names.

- If you wanted to use curried functions to implement actions then you can use named function expressions.

  ```js
  const Meet = (name) => function AndGreet(state) {
    return `${state.salutation}, my name is ${name}.`
  }
  ```

- If you have some special requirements you can customize how actions are [dispatched](dispatch.md).

- Because of the way Hyperapp works internally, anywhere actions can be used literal values can be used instead to directly set state and possibly run effects.

  ```js
  h("button", { onclick: 55 }, text("55"))
  h("button", { onclick: [55, log] }, text("55 and log"))
  ```

  However, this conflicts with the notion that state transitions happen through the usage of actions. The valid way to achieve the same thing would be:

  ```js
  const FiftyFive = () => 55
  const FiftyFiveAndLog = () => [55, log]
  ```

  ```js
  h("button", { onclick: FiftyFive }, text("55"))
  h("button", { onclick: FiftyFiveAndLog }, text("55 and log"))
  ```

  The [`init`](../api/app.md#init) property of [`app()`](../api/app.md) is the only place where it's valid to either directly set the state or use an action to do it.

  That said, this type of usage is fascinating...

  ```js
  h("button", { onclick: state.startingOver ? "Begin" : MyCoolAction }, text("cool"))
  ```
