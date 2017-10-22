# Initialization

The `init` function is run when the app starts. Use this for interacting with the world outside Hyperapp in ways such as subscribing to mouse / keyboard events, starting timers, and fetching resources. This is also available on [`modules`](modules.md).

```js
app({
  init(state, actions) {
    // Subscribe to global events, start timers, fetch resources & more!
  }
})
```
