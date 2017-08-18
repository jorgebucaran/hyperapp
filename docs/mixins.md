# Mixins

Use [mixins](/docs/api.md#mixins) to encapsulate your application behavior into reusable modules, to share or just to organize your code.

```jsx
app({
  mixins: [MyMixin]
})
```

This mixin logs action information to the console.

```jsx
const SimpleLogger = () => ({
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

## Using `emit`

Mixins receive the [`emit`](/docs/api.md#emit) function as the first argument allowing you to create [custom events](/docs/events.md#custom-events).

This mixin listens to [`action`](/docs/events.md#action) and [`resolve`](/docs/events.md#resolve) events to time the duration between each action.

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

app({
  // ...
  events: {
    time(state, actions, { name, time }) {
      console.group("Action Performance")
      console.log("Name:", name)
      console.log("Time:", time)
      console.groupEnd()
    }
  },
  mixins: [ActionPerformanceTimer()]
})
```

This mixin adds a new application-level event that fires before the state is updated.

```jsx
const BeforeUpdate = emit => ({
  events: {
    resolve(state, actions, result) {
      typeof action === "function"
        ? update => result(withState => update(emit("beforeUpdate", withState)))
        : emit("beforeUpdate", result)
    }
  }
})
```

This mixin adds a new wildcard event that can intercept any other event.

```jsx
const CatchThemAll = events => emit => ({
  events: {
    ...events.reduce((result, event) => {
      return {
        ...result,
        ...{
          [event]: (state, actions, data) => {
            emit("all", { event, data })
          }
        }
      }
    }, {})
  }
})

app({
  events: {
    all(state, actions, { event, data }) {
      console.group("Event")
      console.log("Name:", event)
      console.log("Data:", data)
      console.groupEnd()
    }
  },
  mixins: [CatchThemAll([
    "action",
    "resolve",
    "update"
  ])]
})
```
