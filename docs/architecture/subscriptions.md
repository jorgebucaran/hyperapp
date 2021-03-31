# Subscriptions

A **subscription** function represents a dependency your app has on some external process. As with [effects](actions.md#effects), subscriptions deal with impure, asynchronous interactions with the outside world in a safe, pure, and immutable way. They are a streamlined way of responding to events happening outside our application such as time or location changes. They handle resource management for us that we would otherwise need to worry about like adding and removing event listeners, closing connections, etc.

There are several official Hyperapp packages that provide subscriptions for some commonly used APIs from [The Web Platform](https://platform.html5.org/). For instance, you can schedule recurrent tasks using [`@hyperapp/time`](../../../packages/time), or listen to global events like mouse or keyboard events using [`@hyperapp/events`](../../../packages/events).

---

## Using Subscriptions

Subscriptions are setup and managed through the [`subscriptions:`](../api/app.md#subscriptions) property used with [`app()`](../api/app.md) when instantiating your app.

```js
import { every } from "@hyperapp/time"

// ...

app({
  init: { delayInMilliseconds: 1000 },
  subscriptions: (state) => [
    // Dispatch `RequestResource` every `delayInMilliseconds`.
    every(state.delayInMilliseconds, RequestResource),
  ],
})
```

You can control if subscriptions are active or not by using boolean values.

```js
app({
  subscriptions: (state) => [
    state.toBe && every(state.delay, ThatIsTheQuestion),
    state.notToBe || every(state.delay, ThatIsTheQuestion),
  ],
})
```
<!-- In William Shakespeare's play "Hamlet", Prince Hamlet gives a soliloquy in Act 3, Scene 1 where he begins with "To be, or not to be", basically questioning life. -->

### Subscriptions Array Format

Hyperapp expects the subscriptions array to be of a fixed size with each entry being either a boolean value or a particular subscription function that stays in the same array position. Using dynamic arrays won't work. Inlining subscription functions also won't work because they would just reset on every state change.

### Subscription Lifecycle

On every state change, Hyperapp will check each subscriptions array entry to see if they're active and compare that with how they were in the previous state. This comparison determines how subscriptions are handled.

| Previously Active | Currently Active | What Happens
| ----------------- | ---------------- | ------------
| no                | no               | Nothing.
| no                | :100:            | Subscription starts up.
| :100:             | no               | Subscription shuts down and gets cleaned up.
| :100:             | :100:            | Subscription remains active.

To restart a subscription you must first deactivate it and then, during the next state change, reactivate it.

---

## Custom Subscriptions

There may be times when an official Hyperapp subscription package is unavailable for our needs. For those scenarios we'll need to make our own custom subscriptions.

### Subscribers

A **subscriber** is a function which implements an active subscription. As with [runners](actions.md#runners), subscribers are allowed to use side-effects and can also manually [`dispatch`](dispatch.md) actions in order to inform your app of any pertinent results from their execution.

Subscribers can be given a data `payload` for their use.

Well-formed subscribers, as it is with runners, should be as generic as possible. However, unlike with runners, they should return a function that handles cleaning up the subscription if it gets cancelled.

### Example

Let's say we're embedding our Hyperapp application within a legacy vanilla JavaScript project.

Somewhere within the legacy portion of our project a custom event gets emitted:

```js
// Somewhere in our legacy app...

const triggerSpecialEvent = () => {
  dispatchEvent(new CustomEvent("secret", { detail: 42 }))
}

// ...

triggerSpecialEvent()
```
<!-- In "The Hitchhiker's Guide to the Galaxy" the number 42 is given as The Answer to the Ultimate Question of Life, The Universe, and Everything by the computer Deep Thought. -->

Our embedded Hyperapp application will need a custom subscription to be able to deal with custom events:

```js
// ./subs.js

const listenToEvent = (dispatch, props) => {
  const listener = (event) =>
    requestAnimationFrame(() => dispatch(props.action, event.detail))
  addEventListener(props.type, listener)
  return () => removeEventListener(props.type, listener)
}

export const listen = (type, action) => [listenToEvent, { type, action }]
```

In case you're wondering why `listenToEvent()`'s listener is using `requestAnimationFrame` it has to do with [synchonization](actions.md#synchonization).

Now we can use our custom subscription in our Hyperapp application. Since it will be embedded we'll wrap our call to [`app()`](../api/app.md) within an exported function our legacy app can make use of:

```js
import { h, text, app } from "hyperapp"
import { listen } from "./subs"

const Response = (state, payload) => ({ ...state, payload })

export const myApp = (node) =>
  app({
    init: () => ({ payload: null }),
    view: ({ payload }) =>
      h("main", {}, [
        payload && h("p", {}, text(`Payload received: ${JSON.stringify(payload)}`)),
      ]),
    subscriptions: () => [listen("secret", Response)],
    node,
  })
```

---

## Other Considerations

### Destructuring Gotcha

Since a well-formed subscriber returns a cleanup function, it's possible that the cleanup function would want to communicate back to your app that the cleanup took place.

```js
const listenToEvent = (dispatch, props) => {
  const listener = (event) =>
    requestAnimationFrame(() => dispatch(props.action, event.detail))
  addEventListener(props.type, listener)
  return () => {
    removeEventListener(props.type, listener)
    dispatch(props.action, "<done>")
  }
}
```

So, using `props` directly works well. However, if instead you tried to use destructuring then the cleanup function won't be able to communicate back to your app in all scenarios:

```js
const listenToEvent = (dispatch, { action, type }) => {
  const listener = (event) =>
    requestAnimationFrame(() => dispatch(action, event.detail))
  addEventListener(type, listener)
  return () => {
    removeEventListener(type, listener)
    dispatch(action, "cleaned-up")    // <-- uh, oh!
  }
}
```

The reason is because destructuring the `props` parameter will create local copies of the props listed. This means the cleanup function's closure will be referring to the `action` function that existed at the moment the cleanup function was created and returned, not the moment the cleanup function gets invoked. This is a subtle yet significant difference depending on how you use your actions with this type of subscriber.

The scenario in which this comes into play is if you use an anonymous function for the `action`. An example of where you may consider doing this is if you wanted a way to seletively prevent default event behavior when a subscriber responds to an event.

```js
// ./fx.js

const runPreventDefault = (dispatch, payload) => {
  payload.event.preventDefault()
  dispatch(payload.action)
}

export const preventDefault = (action, event) =>
  [runPreventDefault, { action, event }]
```

```js
// ./actions.js

import { preventDefault } from "./fx"

export const skipDefault = (action) => (state, event) =>
  [state, preventDefault(action, event)]

export const MyAction = (state) => ({ ...state })
```

```js
// ./subs.js

const subOnThatThing = (dispatch, props) => {
  // Do stuff...
}

export const onThatThing = (action, props) =>
  [subOnThatThing, { ...props, action }]
```

```js
// ./main.js

import { onThatThing } from "./subs"
import { skipDefault } from "./actions"

app({
  subscriptions: (state) => [
    state.isActive &&
      onThatThing(skipDefault(MyAction), {
        foo: 42 + state.index,
      }),
  ],
})
```

Now when the subscription function runs per state update, the wrapped action is generated anew which results in a new function reference for the subscription's `action`. So, `subOnThatThing` must use `props` instead of destructuring to ensure the right function reference is available.
