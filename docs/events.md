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

## Default Events

### init

The init event fires before the first render. This is a good place to initialize your application, create a network request, access the local [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage), etc.

### loaded

The loaded event fires after the first render. This event is useful if you need to access actual DOM nodes after initialization.

### beforeAction

The beforeAction event fires before an action is called. This event can be useful to implement middleware, developer tools, etc.

### afterAction

The afterAction event fires after an action is called. This event can be useful to implement middleware, developer tools, etc.

### update

The update event fires before the state is updated. This event can be useful to validate the state before an update takes place.

### render

The render event fires every time before the view is rendered. You can use this event to overwrite the current view by returning a new one.

```jsx
app({
  view: state => <h1>Hi.</h1>,
  events: {
    render(state, actions) {
      if (location.pathname === "/warp") {
        return state => <h1>Welcome to warp zone!</h1>
      }
    }
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
      // return new data
    }
  }
})
```

The `emit` function is available as the return value of the [`app`](/docs/api.md#app) function call itself.

```js
const emit = app({ ... })
```

Or in mixins, as the first argument to the function.

```js
const MyMixin = emit => ({ ... })
```

The `emit` function returns the supplied data reduced by successively calling each event handler of the specified event.

### Interoperatiblity

Custom events can be useful in situations where your application is a part of a larger system and you want to communicate with it from the outside.

```js
const emit = app({
  ...
  events: {
    externalEvent: (state, actions, data) => actions.setData(data)
  }
})

...

emit("externalEvent", {
  data: 42
})
```




