# Hooks

Hooks are functions called at various points in the life of your application. Use them to initialize your state, subscribe to external events, inspect and intercept [actions](/docs/actions.md), etc.

### Initialize

Initialize your application, subscribe to external events, e.g., Keyboard and Mouse input, etc.

[Try it Online](https://codepen.io/hyperapp/pen/Bpyraw?editors=0010)

```jsx
app({
  state: { x: 0, y: 0 },
  view: state => state.x + ", " + state.y,
  actions: {
    move: (state, actions, { x, y }) => ({ x, y })
  },
  hooks: [
    (state, actions) => {
      addEventListener("mousemove", e =>
        actions.move({
          x: e.clientX,
          y: e.clientY
        })
      )
    }
  ]
})
```

### Before Action

Inspect or extract action information before it runs.

```jsx
app({
  hooks: [
    () => ({ name, data }) => {
      console.group("hooks:action")
      console.log("name:", name)
      console.log("data:", data)
      console.groupEnd()
    }
  ]
})
```

### After Action

Validate the result of an action or modify its return type.

Allow actions to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```jsx
app({
  hooks: [
    () => () => result => (
      result && typeof result.then === "function"
        ? update => result.then(update) && result
        : result
    )
  ]
})
```

Allow actions to return an [Observable](https://github.com/tc39/proposal-observable).

```jsx
app({
  hooks: [
    () => () => result => (
      result && typeof result.subscribe === "function"
        ? update => result.subscribe({ next: update })
        : result
    )
  ]
})
```
