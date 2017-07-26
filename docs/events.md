# Events

Use events to get notified when your app is initialized, an action is called, before a [view](/docs/view.md) is rendered, etc.

[Try it online](https://codepen.io/hyperapp/pen/Bpyraw?editors=0010)

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

## Default Events

### load

The load event fires before the first render. This is a good place to initialize your application, create network requests, access the local [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage), etc.

### action

The beforeAction event fires before an action is called. This event can be useful to log action activity, extract action information, etc.

### resolve

The resolve event fires after an action returns, allowing you to intercept its return value. Use this event to customize what types an action is allowed to return or modify the default state update mechanism.

For example to allow actions to return an [Observable](https://github.com/tc39/proposal-observable).

```jsx
app({
  //...
  events: {
    resolve(state, actions, { result }) {
      if (data != null && typeof data.subscribe == "function") {
        return update => result.subscribe({ next: update })
      }
    }
  }
})
```

### update

The update event fires before the state is updated. This event can be useful to validate the new state before an update takes place.

### render

The render event fires every time the view is rendered, allowing you to overwrite the default view. For a practical example see the [Router](https://github.com/hyperapp/router).

```jsx
app({
  // ...
  events: {
    render: (state, actions, view) =>
      location.pathanem === "/" ? view : notFoundView
  }
})
```

## Custom Events

Create custom events using the [`emit`](/docs/api.md#emit) function.

```jsx
emit("myEvent", data)
```

Then subscribe to them in your application or [mixin](/docs/mixins.md).

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
const mixin = emit => ({
  // ...
})
```

The `emit` function returns the supplied data reduced by successively calling each event handler of the specified event.

### Interoperatiblity

Custom events can be useful in situations where your application is a part of a larger system and you want to communicate with it from the outside.

```js
const emit = app({
  // ...
  events: {
    externalEvent(state, actions, data) {
      actions.populate(data)
    }
  }
})

// ...

emit("externalEvent", yourData)
```




