# Events

Events are functions called at various points in the life of your application.

Use events to intercept [actions](/docs/actions.md), cancel [state](/docs/state.md) updates, etc.

## Default Events

### load

Use [`load`](/docs/api.md#load) to initialize your application before the [view](/docs/view.md) is rendered for the first time.

```jsx
app({
  events: {
    load(state, actions) {
      actions.initialize()
    }
  }
})
```

Setting the state synchronously inside this event will not trigger a re-rendering. Use `load` to listen to global events, fetch a remote resource, access the local [Storage], etc.

[Try it Online](https://codepen.io/hyperapp/pen/Bpyraw?editors=0010)

```jsx
app({
  state: { x: 0, y: 0 },
  view: state => state.x + ", " + state.y,
  actions: {
    move: (state, actions, { x, y }) => ({ x, y })
  },
  events: {
    load(state, actions) {
      addEventListener("mousemove", e =>
        actions.move({
          x: e.clientX,
          y: e.clientY
        })
      )
    }
  }
})
```

#### Hydration

You can use this event to hydrate a statically rendered [`root`](/docs/root.md) into a [virtual node](/docs/virtual-nodes.md).

```jsx
app({
  events: {
    load(state, actions, root) {
      return hydrate(root)
    }
  }
})
```

See [Hydration](/docs/hydration.md) for details.

### action

Use [`action`](/docs/api.md#action) to log, inspect or extract information about actions before they are called.

```jsx
app({
  events: {
    action(state, actions, { name, data }) {
      console.group("Action Info")
      console.log("Name:", name)
      console.log("Data:", data)
      console.groupEnd()
    }
  }
})
```

### resolve

Use [`resolve`](/docs/api.md#resolve) to validate the result of an action or modify its return type. This event is fired immediately after an action is called.

Allow actions to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```jsx
app({
  events: {
    resolve(state, actions, result) {
      if (result && typeof result.then === "function") {
        return result.then(update) && result
      }
    }
  }
})
```

Allow actions to return an [Observable](https://github.com/tc39/proposal-observable).

```jsx
app({
  events: {
    resolve(state, actions, result) {
      if (result && typeof result.subscribe == "function") {
        return update => result.subscribe({ next: update })
      }
    }
  }
})
```

### update

Use [`update`](/docs/api.md#update_event) to record state changes, validate or prevent state updates.

Return `false` to cancel the update and prevent the view from re-rendering.

```jsx
app({
  events: {
    update(state, actions, nextState) {
      if (Object.keys(nextState).some(prop => !(prop in schema))) {
        console.warn("Invalid state schema: %o.", nextState)
        return false
      }
    }
  }
})
```

### render

Use [`render`](/docs/api.md#render) to overwrite the [view](/docs/view.md) function before it is called. If your application has no view, this event is not fired.

```jsx
app({
  events: {
    render(state, actions, view) {
      return location.pathname === "/" ? defaultView : notFoundView
    }
  }
})
```

## Custom Events

Create custom events with the [`emit`](/docs/api.md#emit) function.

```jsx
emit("myEvent", data)
```

Then subscribe to them like any other event.

```jsx
app({
  events: {
    myEvent(state, actions, data) {
      // ...
      return newData
    }
  }
})
```

The `emit` function is available as the return value of the [`app`](/docs/api.md#app) function call itself.

```js
const emit = app({
  // ...
})
```

Or in mixins, as the first argument to the function.

```js
function MyMixin(emit) {
  // ...
}
```

The `emit` function returns the supplied data, reduced by successively calling each event handler of the specified event.

### Interoperability

Custom events can be useful in situations where your application is a part of a larger system and you want to communicate with it from the outside.

```js
const emit = app({
  events: {
    populate(state, actions, data) {
      if (actions.populate(data)) {
        actions.toggle(data.index)
      }
    }
  }
})
```

Fire the event.

```jsx
emit("populate", yourData)
```

If you find yourself wrapping events to actions often, use a mixin to encapsulate it.

```jsx
const Dispatcher = () => ({
  events: {
    dispatch(state, actions, { action, data }) {
      return actions[action](data)
    }
  }
})

const emit = app({
  mixins: [Dispatcher]
})
```

You can now call any action with a data payload via emit.

```jsx
emit("dispatch", {
  action: "toggle",
  data: {
    index: 0
  }
})
```




