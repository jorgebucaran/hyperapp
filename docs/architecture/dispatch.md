# Dispatch

_Definition:_

> The **dispatch** function controls Hyperapp’s core dispatching process which executes [actions](actions.md), applies state transitions, runs [effects](effects.md), and starts/stops [subscriptions](subscriptions.md) that need it.

You can augment the dispatcher to tap into the dispatching process for debugging/instrumentation purposes. Such augmentation is loosely comparable to middleware used in other frameworks.

---

## Dispatch Initializer

The dispatch initializer accepts the default dispatch as its sole argument and must give back a dispatch in return. Hyperapp’s default dispatch initializer is equivalent to:

```js
// Dispatch : (DispatchFn) -> SameDispatchFn
const boring = (dispatch) => dispatch;
```

In your own initializer you’ll likely want to return a variant of the regular dispatch.

---

## Augmented Dispatching

A dispatch function accepts as its first argument an [action](actions.md) or anything an action can return, and its second argument is the default [payload](actions.md#payloads) if there is one. The payload will be used if the first argument is an action function.

The action will then be carried out and its resulting state transition will be applied and then any effects it requested to be run will be run.

```js
// DispatchFn : (Action, Payload?) -> void
const dispatch = (action, payload) => {
  // Do your custom work here.
  // ...

  // Afterwards, carry on normally.
  dispatch(action, payload);
};
```

Hyperapp’s default dispatch function is a little too involved to showcase here but suffice it to say you’ll most likely want to leverage it.

---

## Example

Let’s say we’re working on a project where we want to always log the current state. Creating a custom dispatch for this purpose makes sense because it lets us accomplish this without having to change any of our existing actions to request our logging effect to run.

```js
import { log } from "./fx";

const middleware = (dispatch) => (action, payload) => {
  dispatch((state) => [state, log(state)]);
  dispatch(action, payload);
};
```

Great! Now let’s learn how to use it.

---

## Usage

The [`app()`](../api/app.md) function will check to see if you have a dispatch initializer assigned to the [`dispatch:`](../api/app.md#dispatch) property while instantiating your application. If so, your app will use it instead of the default one.

The only time the dispatch initializer gets used is once during the instantiation of your app.

Only one dispatch initializer can be defined per app. Consequently, only one dispatch can be defined per app.

---

## Other Considerations

- [`app()`](../api/app.md) returns the dispatch function to allow [dispatching externally](../api/app.md#instrumentation).

- If you’re feeling truly adventurous and/or know what you’re doing you can choose to have your dispatch initializer return a completely custom dispatch from the ground up. For what purpose? You tell me! However, a completely custom dispatch won’t have access to some important internal framework functions, so it’s unlikely to be something useful without building off of the original dispatch.
