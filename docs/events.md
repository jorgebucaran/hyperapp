# Events

Use [events](/docs/api.md#events) to get notified when your app is initialized, an action is called, before a view is rendered, etc.

```jsx
app({
  state: { x: 0, y: 0 },
  view: state => (
    <h1>{state.x + ", " + state.y}</h1>
  ),
  actions: {
    move: (state, { x, y }) => ({ x, y })
  },
  events: {
    init: (state, actions) =>
      addEventListener("mousemove", e =>
        actions.move({
          x: e.clientX,
          y: e.clientY
        })
      )
  }
})
```

Events can be used to hook into the update and render pipeline.

```jsx
app({
  view: state => <h1>Hi.</h1>,
  events: {
    render: (state, actions, data) => {
      if (location.pathname === "/warp") {
        return state => <h1>Welcome to warp zone!</h1>
      }
    }
  }
})
```

For a practical example see the implementation of the [Router](https://github.com/hyperapp/router/blob/master/src/router.js).

## Custom Events

The [app](/docs/api.md#app) call returns the [emit](/docs/api.md#emit) function, making it possible to trigger custom events.

```jsx
const emit = app({
  view: (state, { fail }) =>
    <button onclick={fail}>Fail</button>,
  actions: {
    fail: (state, actions, data) => emit("error", "Fail")
  },
  events: {
    error: (state, actions, error) => {
      throw error
    }
  }
})
```

Custom events can be useful in situations where your application is a part of a larger system and you want to communicate with it from the outside.

```js
const emit = app({
  state: 0,
  actions: {
    setData: (state, actions, data) => data
  },
  view: state => <h1>{state}</h1>,
  events: {
    "outside:data": (state, actions, data) =>
      actions.setData(data)
  }
})

...

emit("outside:data", 1)
```
