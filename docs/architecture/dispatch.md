# Dispatch

The **dispatch** function controls how to execute [actions](actions.md) and apply the state transitions and effect running that they request to be done.

Custom dispatchers are loosely comparable to middleware used in other frameworks with the difference being that they are just intended to augment the regular dispatching process for specialized purposes you may have for your project, particularly in relation to dev tooling.

---

## Dispatch Initializer

The dispatch initializer accepts the default dispatch as its sole argument and must give back a dispatch in return. Hyperapp's default dispatch initializer is equivalent to:

```js
const boring = (dispatch) => dispatch
```

Of course, in your own initializer you'll likely want to return a variant of the regular dispatch.

---

## Custom Dispatching

A dispatch function accepts an [action](actions.md) and its [payload](actions.md#payloads) if it has one. The action will then be carried out and its resulting state transition will be applied and then any effects it requested to be run will be run.

```js
const dispatch = (action, payload) => {
  // Magic happens!
}
```

Hyperapp's default dispatch function is a little too involved to showcase here but suffice it to say you'll most likely want to leverage it when crafting your own dispatching.

---

## Example

Let's say we're working on a project where we want to always log the current state. Creating a custom dispatch for this purpose makes sense because it lets us accomplish this without having to change any of our existing actions to request our logging effect to run.

```js
import { log } from "./fx"

const middleman = (dispatch) => (action, payload) => {
  dispatch((state) => [state, log(state)])
  dispatch(action, payload)
}
```

Great! Now let's learn how to use it.

---

## Usage

The [`app()`](../api/app.md) function will check to see if you have a dispatch initializer assigned to the [`dispatch:`](../api/app.md#dispatch) property while instantiating your application. If so, your app will use it instead of the default one.

The only time the dispatch initializer gets used is once during the instantiation of your app.

Only one dispatch initializer can be defined per app. Consequently, only one dispatch can be defined per app.

---

## Other Considerations

- [`app()`](../api/app.md) returns the dispatch function to allow [dispatching externally](../api/app.md#instrumentation).

- If you're feeling truly adventurous and/or know what you're doing you can choose to have your dispatch initializer return a completely custom dispatch from the ground up. For what purpose? You tell me!
