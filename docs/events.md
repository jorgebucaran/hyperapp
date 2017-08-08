# Events

Events are function called at various points in the life of your application.

Use events to get notified before the [state](/docs/state.md) is updated, your [view](/docs/view.md) is rendered, an [action](/docs/actions.md) is called, etc.

## Default Events

### load

The [`load`](/docs/api.md#load) event is fired before the first render. Use it to initialize your application, listen to global events, create a network request, etc.

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

### action

The [`action`](/docs/api.md#action) event is fired before an action is called. Use it to log action activity, extract information about actions, etc.

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

The [`resolve`](/docs/api.md#resolve) event is fired after an action is called, allowing you to intercept its return value. Use it to customize the types actions can return.

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

The [`update`](/docs/api.md#eventsupdate) event is fired before the state is updated. Use this event to log state changes, validate the new state before an update takes place, etc.

```jsx
app({
  events: {
    update(state, actions, nextState) {
      if (validate(nextState)) {
        return nextState
      }
    }
  }
})
```

### render

The [`render`](/docs/api.md#render) event is fired before the [view](/docs/view.md) function is called, allowing you to overwrite it or decorate it. If your application does not use a view, this event is never fired.

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
    externalEvent(state, actions, data) {
      actions.populate(data)
    }
  }
})

// ...

emit("externalEvent", yourData)
```




