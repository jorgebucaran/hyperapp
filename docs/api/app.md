# `app()`

Initializes and mounts a Hyperapp application.

```elm
app : ({ Init, View, Node, Subscriptions?, Dispatch? }) -> DispatchFn
```

| Prop                             | Type                                                                        | Required?                        |
| -------------------------------- | --------------------------------------------------------------------------- | -------------------------------- |
| [init:](#init)                   | <ul><li>[State](../architecture/state.md)</li><li>[[State](../architecture/state.md), ...[Effect](../architecture/effects.md)[]]</li><li>[Action](../architecture/actions.md)</li><li>[[Action](../architecture/actions.md), any]</li></ul> | No                               |
| [view:](#view)                   | [View](../architecture/views.md)                                            | No                               |
| [node:](#node)                   | DOM element                                                                 | **Yes when `view:` is present.** |
| [subscriptions:](#subscriptions) | Function                                                                    | No                               |
| [dispatch:](#dispatch)           | [Dispatch Initializer](../architecture/dispatch.md#dispatch-initializer)    | No                               |

| Return Value                            | Type     |
| --------------------------------------- | -------- |
| [dispatch](../architecture/dispatch.md) | Function |

```js
import { app, h, text } from "hyperapp"

app({
  init: { message: "Hello World!" },
  view: (state) => h("p", {}, text(state.message)),
  node: document.getElementById("app"),
})
```

## `init:`

_(default value: `{}`)_

Initializes the app by either setting the initial value of the [state](../architecture/state.md) or taking an [action](../architecture/actions.md). It takes place before the first view render and subscriptions registration.

### Forms of `init:`

- `init: state`

  Sets the initial state directly.

  ```js
  app({
    init: { counter: 0 },
    // ...
  })
  ```

- `init: [state, ...effects]`

  Sets the initial state and then runs the given list of [effects](../architecture/effects.md).

  ```js
  app({
    init: [
      { loading: true },
      log("Loading..."),
      load("myUrl?init", DoneAction),
    ],
    // ...
  })
  ```

- `init: Action`

  Runs the given [Action](../architecture/action.md).

  This form is useful when the action can be reused later. The state passed to the action in this case is `undefined`.

  ```js
  const Reset = (_state) => ({ counter: 0 })

  app({
    init: Reset,
    // ...
  })
  ```

- `init: [Action, payload]`

  Runs the given [Action](../architecture/actio.md) with a payload.

  ```js
  const SetCounter = (_state, n) => ({ counter: n })

  app({
    init: [SetCounter, 10],
    // ...
  })
  ```

## `view:`

The [top-level view](../architecture/views.md#top-level-view) that represents the app as a whole. There can only be one top-level view in your app. Hyperapp uses this to map your state to your UI for rendering the app. Every time the [state](../architecture/state.md) of the application changes, this function will be called to render the UI based on the new state, using the logic you've defined inside of it.

```js
app({
  // ...
  view: (state) => h("main", {}, [
    outworld(state),
    netherrealm(state),
  ]),
})
```

<!-- "Outworld" and "Netherrealm" are two of several realms in the "Mortal Kombat" videogame series. -->

## `node:`

The DOM element to render the virtual DOM over (the **mount node**). The given element is replaced by a Hyperapp application. This process is called **mounting**. It's common to define an intentionally empty element in your HTML which has an ID that your app can use for mounting. If the mount node had content within it then Hyperapp will attempt to [recycle](../architecture/views.md#recycling) that content.

```html
<main id="app"></main>
```

```js
app({
  // ...
  node: document.getElementById("app"),
})
```

## `subscriptions:`

A function that returns an array of [subscriptions](../architecture/subscriptions.md) for a given state. Every time the [state](../architecture/state.md) of the application changes, this function will be called to determine the current subscriptions.

If a subscription entry is falsy then the subscription that was at that spot, if any, will be considered unsubscribed from and will be cleaned up.

If `subscriptions:` is omitted the app has no subscriptions. It behaves the same as if you were using: `subscriptions: (state) => []`

```js
import { onKey } from "./subs"

app({
  // ...
  subscriptions: (state) => [
    onKey("w", MoveForward),
    onKey("a", MoveBackward),
    onKey("s", StrafeLeft),
    onKey("d", StrafeRight),
    state.playingDOOM1993 || onKey(" ", Jump),
  ],
})
```

<!-- The 1993 videogame DOOM did not have jumping as a movement option. -->

## `dispatch:`

A [dispatch initializer](../architecture/dispatch.md#dispatch-initializer) that can create a [custom dispatch function](../architecture/dispatch.md#custom-dispatching) to use instead of the default dispatch. Allows tapping into dispatches for debugging, testing, telemetry etc.

## Return Value

`app()` returns the [dispatch](../architecture/dispatch.md) function your app uses. This can be handy if you want to control your app externally, ie where only a subsection of your app is implemented with Hyperapp.

Calling the dispatch function with no arguments frees the app's resources and runs every active subscription's cleanup function.

## Other Considerations

- You can embed your Hyperapp application within another already existing Hyperapp application or an app that was built with some other framework.

- Multiple Hyperapp applications can coexist on the page simultaneously. They each have their own state and behave independently relative to each other. They can communicate with each other using subscriptions and effects (i.e. using events).
