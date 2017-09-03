# Mixins

Use mixins to encapsulate your application behavior into reusable modules, to share or just to organize your code.

```jsx
const mixin = options => ({
  state,
  actions,
  events
})
```

This mixin logs action information to the console.

```jsx
const logger = ({ log = console.log } = {}) => ({
  events: {
    action(state, actions, info) {
      log(info)
    }
  }
})

app({
  mixins: [logger()]
})
```

A mixin can be a plain object if it takes no options.

```jsx
app({
  mixins: [
    {
      events: {
        action(state, actions, info) {
          console.log(info)
        }
      }
    }
  ]
})
```

## Creating Custom Events

A mixin function takes `emit` as the first argument allowing you to create [custom events](/docs/events.md#custom-events).

```js
const mixin = options => emit => ({
  // ...
})
```

This mixin adds a new application event that fires after an action is complete. To implement this mixin we intercept the action result inside [`resolve`](/docs/events.md#resolve) and wrap the thunk / update pipeline.

```jsx
const didAction = () => emit => ({
  events: {
    resolve(state, actions, result) {
      const resolve = (result, update) =>
        typeof result === "function"
          ? update(state => resolve(result(state), update))
          : emit("didAction", result)

      return typeof result === "function"
        ? update => result(state => resolve(state, update))
        : resolve(result)
    }
  }
})

app({
  mixins: [
    didAction()
  ]
})
```

## Intercepting Events

This mixin adds a wildcard event that can be used to intercept any other event.

```jsx
const catchThemAll = (events = []) => emit => ({
  events: {
    ...events.reduce(
      (partial, event) => ({
        ...partial,
        ...{
          [event]: (state, actions, data) => {
            emit("all", { event, data })
          }
        }
      }),
      {}
    )
  }
})

app({
  events: {
    all(state, actions, event) {
      console.log("Event", event)
    }
  },
  mixins: [catchThemAll([
    "action",
    "resolve",
    "update"
  ])]
})
```

## Timing Action Duration

This mixin measures the elapsed time between actions and logs the result to the console. Action metadata is only available inside [`action`](/docs/events.md#action), so we use a stack to collect and share action information with other events.

```jsx
function actionPerformanceTimer({ ignore = [] } = {}) {
  const actionStack = []

  return {
    events: {
      action(state, actions, { name }) {
        actionStack.push({ name, time: performance.now() })
      },
      resolve(state, actions, result) {
        if (typeof result === "function") {
          const action = actionStack.pop()

          return update =>
            result(result => {
              actionStack.push(action)
              return update(result)
            })
        }
      },
      update(state, actions, nextState) {
        const { name, time } = actionStack.pop()

        if (!ignore.includes(name)) {
          console.group("Action Performance")
          console.log("Name:", name)
          console.log("Time:", performance.now() - time)
          console.groupEnd()
        }
      }
    }
  }
}

app({
  mixins: [
    actionPerformanceTimer()
  ]
})
```
