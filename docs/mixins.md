# Mixins

Use [mixins](/docs/api.md#mixins) to encapsulate your application behavior into reusable modules, to share or just to organize your code.

This mixin listens to [beforeAction](/docs/events.md#beforeAction) events to log action information to the console.

```jsx
const ActionLogger = () => ({
  events: {
    beforeAction(state, actions, { name, data }) {
      console.group("Action Info")
      console.log("Name:", name)
      console.log("Data:", data)
      console.groupEnd()
    }
  }
})
```

Use it like this.

```jsx
app({
  // ...
  mixins: [ActionLogger]
})
```

## Emitting Events

Mixins receive the [`emit`](/docs/api.md#emit) function as the first argument allowing you to create [custom events](/docs/events.md#custom-events).

This mixin listens to [beforeAction](/docs/events.md#beforeAction) and [afterAction](/docs/events.md#afterAction) events to time and log action performance to the console.

```jsx
const ActionPerformance = (ignored = [], cache = []) => emit => ({
  events: {
    beforeAction(state, actions, { name }) {
      cache.push({
        name,
        time: performance.now()
      })
    },
    afterAction() {
      const { name, time } = cache.pop()

      if (ignored.length === 0 || !ignored.includes(name)) {
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
  // ...
  events: {
    time(state, actions, { name, time }) {
      console.group("Action Time Info")
      console.log("Name:", name)
      console.log("Time:", time)
      console.groupEnd()
    }
  },
  mixins: [ActionPerformance()]
})
```

## Presets

Group mixins under the same category to create a preset. Then use it like any other mixin.

```jsx
const DevTools = () => ({
  mixins: [Logger, Debugger, Replay]
})
```
