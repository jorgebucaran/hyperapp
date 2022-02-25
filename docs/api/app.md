# `app()`

<big><pre>
app : ({ <a href="#init">init?</a>, <a href="#view">view</a>, <a href="#node">node</a>, <a href="#subscriptions">subscriptions?</a>, <a href="#dispatch">dispatch?</a> }) -> DispatchFn
</pre></big>

Initialize and mount a Hyperapp application.  
`init`, `subscriptions` and `dispatch` are optional.

```js
import { app } from "hyperapp"

app({
  init: { message: 'hello world' },
  view: state => h("p", {}, text(state.message)),
  node: document.getElementById('app'),
  subscriptions: state => [ onKey("w", MoveForward) ],  
})
```
<br/>

### `init:`

```js
init: { state }
      | [state, ...effects ]
      | Action
      | [Action, payload? ]
```

Initialize the app. Takes place before the first view render and subscriptions registration.  

If omitted the state will be set to an empty object (`{}`) by default.
<br/>

**Signatures:** 

- `init: { state }` sets the initial state directly:

  ```js
  app({
    init: { counter: 0 },
    // ...
  })
  ```

- `init: [state, ...effects ]` sets the initial state and run the given [effects](../architecture/effects.md):

  ```js
  app({
    init: [ { loading: true }, fetch('myurl?init', DoneAction) ],
    // ...
  })
  ```

- `init: Action` and `init: [Action, payload? ]` run the given [Action](../architecture/action.md):

  This form is useful when the Action can be reused later.  
  The state passed to the Action in this case is `undefined`  

  ```js
  const Reset = state => { counter: 0 }

  app({
    init: Reset,
    // ...
  }
  ```
<br/>

### `view:`

The [top-level view](../architecture/views.md#top-level-view) that represents the app as a whole. There can only be one top-level view in your app.

Hyperapp uses this to map your state to your UI for rendering the app. Every time the [state](../architecture/state.md) of the application changes, this function will be called to render the UI based on the new state, using the logic you've defined inside of it.

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
<br/>

### `node:`

The DOM element to render the virtual DOM over (the "mount node"). The given element is replaced by a Hyperapp application ("mounting").  
It's common to define an intentionally empty element in your HTML which has an ID that your app can use for mounting.  
If the mount node had content within it then Hyperapp will attempt to [recycle](../architecture/views.md#recycling) that content.

```html
<main id="app"></main>
```

```js
app({
  // ...
  node: document.getElementById("app"),
})
```
<br/>

### `subscriptions:`

A function that returns an array of [subscriptions](../architecture/subscriptions.md) for a given state.  
Every time the [state](../architecture/state.md) of the application changes, this function will be called to determine the current subscriptions.  
If omitted the app has no subscriptions (`subscriptions: state => []`)
```js
import { onKey } from "./subs"

app({
  // ...
  subscriptions: state => [
    onKey("w", MoveForward),
    onKey("a", MoveBackward)
  ]
})
```
<br/>

### `dispatch:`

A [Dispatch Initializer](../architecture/dispatch.md#dispatch-initializer) that can create a [custom dispatch function](../architecture/dispatch.md#custom-dispatching) to use instead of the default dispatch.  
Mainly used for middleware and debugging.

<br/>

### Return

`app()` returns the [dispatch](../architecture/dispatch.md) function your app uses. This can be handy if you want to control your app externally (instrumentation).  
Calling `dispatch` with no arguments frees the app's resources and runs any running subscriptions cleanup functions.

<br/>

### Other Considerations

- You can embed your Hyperapp application within an already existing app that was built with some other framework. 

- Multiple Hyperapp applications can coexist on the page simultaneously. They each have their own state and behave independently relative to each other. They can communicate with each other using subscriptions and effects (ie using events).
