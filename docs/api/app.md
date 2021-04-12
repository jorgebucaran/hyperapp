# `app()`

_Definition:_

> A function that initializes and mounts a Hyperapp application.

_Signature:_

```elm
app : ({ Init, View, Node, Subscriptions?, Dispatch? }) -> DispatchFn
```

_Sample Usage:_

```js
import { app } from "hyperapp"

// ...

app(props)
```

_Parameter Overview:_

| Input Parameter | Type   | Required? |
| --------------- | ------ | --------- |
| [props](#props) | Object | yes       |

| Output Parameter                        | Type     |
| --------------------------------------- | -------- |
| [dispatch](../architecture/dispatch.md) | Function |

---

## Parameters

### `props`

There are only a handful of props you can use to configure your app.

| Prop                            | Type                                                                      | Required? |
| ------------------------------- | ------------------------------------------------------------------------- | --------- |
| [init](#init)                   | [State](../architecture/state.md) or [Action](../architecture/actions.md) | yes       |
| [view](#view)                   | [View](../architecture/views.md)                                          | yes       |
| [node](#node)                   | DOM element                                                               | yes       |
| [subscriptions](#subscriptions) | Function                                                                  | no        |
| [dispatch](#dispatch)           | [Dispatch](../architecture/dispatch.md)                                   | no        |

#### `init:`

Initial value of the [state](../architecture/state.md) or an [action](../architecture/actions.md) to take to initialize the state.

You can simply set the initial state directly:

```js
app({
  // ...
  init: { problems: 99 },
})
```

<!-- The initial state is a play on Jay-Z’s song “99 Problems”. -->

Or you can use the various types of [actions](../architecture/actions.md) to do things like fetching initial data for your app.

```js
import { butASPAAintOne } from "./fx"

app({
  // ...
  init: (problems = 99) => [
    { loading: true }, 
    butASPAAintOne(problems)
  ],
})
```

<!-- The initial action taken is a play on Jay-Z’s song “99 Problems”. -->

Note that if you leave `init:` undefined the state will be set to an empty object (`{}`) by default.

#### `view:`

The [top-level view](../architecture/views.md#top-level-view) that represents the app as a whole. There can only be one top-level view in your app.

Hyperapp uses this to map your state to your UI for rendering the app. Every time the state of your application changes, this function will be called again to render the UI based on the new state, using the logic you’ve defined inside of it.

```js
app({
  // ...
  view: (state) => h("main", {}, [
    outworld(state), 
    netherrealm(state)
  ]),
})
```

<!-- “Outworld” and “Netherrealm” are two of several realms in the “Mortal Kombat” videogame series. -->

#### `node:`

The DOM element to render the virtual DOM over. Also known as the **mount node**. It’s common to define an intentionally empty element in your HTML which has an ID that your app can use for mounting.

```html
<main id="app"></main>
```

```js
app({
  // ...
  node: document.getElementById("app"),
})
```

##### Mounting

The process of **mounting** means that a given DOM node is replaced by a Hyperapp application that gets initialized.

If the **mount node** had content within it then Hyperapp will attempt to [recycle](../architecture/views.md#recycling) that content.

#### `subscriptions:`

A function that returns an array of [subscriptions](../architecture/subscriptions.md) for a given state.

In a similar fashion to how [views](../architecture/views.md) are used to dynamically add and remove DOM elements based on the state, this _subscriptions_ function is used for dynamically adding and removing subscriptions to the app.

```js
import { onKey } from "./subs"

// ...

app({
  view: (state) => 
    h("div", {}, [
      state.playing && viewLevel(), 
      h("p", {}, text("Rip and Tear!"))
    ]),
  subscriptions: (state) => [
    onKey("w", MoveForward),
    onKey("a", MoveBackward),
    onKey("s", StrafeLeft),
    onKey("d", StrafeRight),
    state.playingDOOM1993 || onKey(" ", Jump),
  ],
})
```

<!-- The 1993 videogame DOOM did not have jumping as a movement option. “Rip and Tear!” was one of the infamous quotes of the protagonist DoomGuy in the 1996 Doom comic “Knee Deep in the Dead”. -->

#### `dispatch:`

A dispatch initializer that can create a [custom dispatch function](../architecture/dispatch.md#custom-dispatching) to use instead of the default dispatch.

---

## Instrumentation

`app()` returns the [dispatch](../architecture/dispatch.md) function your app uses. This can be handy if you want to [control your app externally](#usage-within-non-hyperapp-projects).

---

## Examples

### Regular Usage

```js
app({
  init: { message: "Hello, World!" },
  view: (state) => h("body", {}, h("p", {}, text(state.message))),
  node: document.body,
})
```

<!-- A “Hello, World!” program is traditionally the first program you would write when learning a new programming language. -->

### Full Usage

```js
app({
  init: { message: "Hello, World!" },
  view: (state) => h("body", {}, h("p", {}, text(state.message))),
  node: document.body,
  subscriptions: (state) => [sub1, sub2],
  dispatch: (dispatch) => (action, payload) => {
    dispatch((state) => ({ ...state, message: `${state.message}!` }))
    dispatch(action, payload)
  },
})
```

---

## Other Considerations

### Usage Within Non-Hyperapp Projects

You can embed your Hyperapp application within an already existing app that was built with some other framework. This can be useful for migrating to Hyperapp in a systematic way or just using Hyperapp for a particular purpose.

### Multiple Apps

Multiple Hyperapp applications can coexist on the page simultaneously. They each have their own state and behave independently relative to each other.

If they need to communicate with each other, then subscriptions and effects for each app can be used for that purpose.

However, if one is nested within another, then the containing app would naturally have more control over the nested app, not only by controlling what can be used for the nested app’s [mount node](#node) but also by utilizing the nested app’s [returned dispatch function](#instrumentation).
