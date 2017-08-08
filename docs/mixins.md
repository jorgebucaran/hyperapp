# Mixins

Use [mixins](/docs/api.md#mixins) to encapsulate your application behavior into reusable modules, to share or just to organize your code.

```jsx
app({
  //...,
  mixins: [MyMixin]
})
```

## Emitting Events

Mixins receive the [`emit`](/docs/api.md#emit) function as the first argument allowing you to create [custom events](/docs/events.md#custom-events).

This mixin listens to [action](/docs/events.md#action) and [resolve](/docs/events.md#resolve) events to time the duration between each action.

```jsx
const ActionPerformanceTimer = (ignored = [], cache = []) => emit => ({
  events: {
    action(state, actions, { name }) {
      cache.push({
        name,
        time: performance.now()
      })
    },
    resolve() {
      const { name, time } = cache.pop()

      if (!ignored.includes(name)) {
        emit("time", {
          name,
          time: performance.now() - time
        })
      }
    }
  }
})
```

```jsx
app({
  events: {
    time(state, actions, { name, time }) {
      console.group("Action Time Info")
      console.log("Name:", name)
      console.log("Time:", time)
      console.groupEnd()
    }
  },
  mixins: [ActionPerformanceTimer()]
})
```

## Presets

Group mixins under the same category to create a preset. Then use it like any other mixin.

```jsx
const DevTools = () => ({
  mixins: [Logger, Debugger, Replayer]
})
```
