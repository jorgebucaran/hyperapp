# Events

Events are functions called at various points in the life of your application. Use them to inspect and intercept [actions](/docs/actions.md), cancel [state](/docs/state.md) updates, overwrite the [view](/docs/view.md) function, etc.

## Default Events

### `load`

Use `load` to initialize your application before the initial [view](/docs/view.md) render, listen to global events, etc.

[Try it Online](https://codepen.io/hyperapp/pen/Bpyraw?editors=0010)

```js
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

To enable DOM re-[hydration](/docs/hydration.md) you can return a [virtual node](/docs/vnodes.md) that matches your rendered HTML.

```js
app({
  events: {
    load(state, actions, element) {
      return walk(element, (node, children) => ({
        tag: node.tagName.toLowerCase(),
        data: {},
        children
      }))
    }
  }
})
```

### `action`

Use `action` to log, inspect or extract information about actions before they are called.

```js
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

### `resolve`

Use `resolve` to validate the result of an action or modify its return type. This event is fired immediately after an action is called.

Allow actions to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```js
app({
  events: {
    resolve(state, actions, result) {
      if (result && typeof result.then === "function") {
        return update => result.then(update) && result
      }
    }
  }
})
```

Allow actions to return an [Observable](https://github.com/tc39/proposal-observable).

```js
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

### `update`

Use `update` to record, validate or prevent state updates.

Return `false` to cancel the update and prevent the view from re-rendering.

```js
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

### `render`

Use `render` to overwrite the [view](/docs/view.md) function before it is called. If your application does not consume a view this event is not fired.

```js
app({
  events: {
    render(state, actions, view) {
      return location.pathname === "/" ? defaultView : notFoundView
    }
  }
})
```

## Custom Events

Create custom events with the `emit` function.

```js
emit("myEvent", data)
```

Then subscribe to them like any other event.

```js
app({
  events: {
    myEvent(state, actions, data) {
      // ...
      return newData
    }
  }
})
```

The `emit` function is available as the return value of the app function call.

```js
const emit = app({
  // ...
})
```

Or inside [mixin](/docs/mixins.md#creating-custom-events) functions.

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

// ...

emit("populate", yourData)
```

If you find yourself mapping events to actions often, you can encapsulate this functionality in a mixin.

```js
const dispatcher = () => ({
  events: {
    dispatch(state, actions, { type, data }) {
      return actions[type](data)
    }
  }
})

const emit = app({
  mixins: [dispatcher()]
})
```

You can now use emit to call any action.

```js
emit("dispatch", {
  type: "toggle",
  data: {
    index: 0
  }
})
```
