# Actions

**_Definition:_**

> An **action** is a message used within your app that signals the valid way to change [state](state.md).

An action is implemented by a deterministic function that produces no side-effects which describes a transition between the current state and the next state and in so doing may optionally list out [effects](effects.md) to be run as well.

Actions are dispatched by either DOM events in your app, [effecters](effects.md#effecters), or [subscribers](subscriptions.md#subscribers). When dispatched, actions always implicitly receive the current state as their first argument.

**_Signature:_**

```elm
Action : (State, Payload?) -> NextState
                              | [NextState, ...Effects]
                              | OtherAction
                              | [OtherAction, Payload?]
```

**_Naming Recommendation:_**

Actions are recommended to be named in `PascalCase` to signal to the developer that they should be thought of as messages intended for use by Hyperapp itself. It is also recommended to use a verb (for instance `Add`) or a verb-noun phrase (`AddArticle`) for the name. The verb can be either in its imperative form, like `IncrementBy`, `ToggleVisibility`, `GetPizzas` or `SaveAddress`, or in the past tense form, for instance `GotData`, `StoppedCounting` – especially when the action is used for a "final" state transition at the end of an action-effect-chain.

---

## Simple State Transitions

The simplest possible action merely returns the current state:

```js
// Action : (State) -> SameState
const Identity = (state) => state
```

It seems useless at first but can be helpful as a placeholder for other actions while prototyping a new app or [component](views.md#components).

Probably the most common way to use an action is to assign it as an event handler for one of the nodes in your view.

```js
h("button", { onclick: Identity }, text("Do Nothing"))
```

The next simplest type of action merely sets the state.

```js
// Action : () -> ForcedState
const FeedFace = () => 0xfeedface
```

<!-- "FEEDFACE" is an example of "hexspeak", a variant of English spelling using hexadecimal digits. -->

<a name="actual-state-transition"></a>
But you'll most likely want to do actual state transitions.

```js
// Action : (State) -> NewState
const Increment = (state) => ({ ...state, value: state.value + 1 })

// ...

h("button", { onclick: Increment }, text("+"))
```

---

## Payloads

Actions can also accept an optional **payload** along with the current state.

```js
// Action : (State, Payload?) -> NewState
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
// Action : () -> OtherAction
const PlusOne = () => Increment
```

A more useful form preprocesses payloads to use with other actions. We can make an event adaptor so our primary action can use event data without coupling to the event source.

```js
// Action : (State, EventPayload) -> [OtherAction, Payload]
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

You may consider refactoring very large and/or complicated actions it into simpler, more manageable functions. If so, remember that actions are just messages and, conceptually speaking, are not composable like the functions that implement them. That being said, it can at times be advantageous to delegate some state processing to other functions. Each of these constituent functions is a **transform** and is intended for use by actions or other transforms.

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
// Action : () -> undefined
const Stop = () => undefined
```

Once your app stops, several things happen:

- All of the app's subscriptions stop.
- The DOM is no longer touched.
- Event handlers stop working.

A stopped app cannot be restarted.

If you encounter a scenario where your app doesn't respond when you click stuff within it, then your app might have been stopped by mistake.

---

## Other Considerations

### Transitioning Array State

An array returned from an action carries [special meaning as already mentioned earlier](effects.md#using-effects). For this reason an actual [array state](state.md#array-state) needs special consideration.

There are a couple of options available:

- Wrap the return state within an [effectful state array](state.md#state-with-effects). Mention also that init: option of app() function must also be wrapped.

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
  const Meet = (name) =>
    function AndGreet(state) {
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
