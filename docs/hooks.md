# Hooks


<!--
# Events

Events are functions called at various points in the life of your application. Use them to inspect and intercept [actions](/docs/actions.md), cancel [state](/docs/state.md) updates, overwrite the [view](/docs/view.md) function, etc.

## Default Events

### `load`

Use `load` to initialize your application before the initial [view](/docs/view.md) render, listen to global events, etc.

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

Be careful not to inadvertently return a value from the `load` event unless you are [hydrating](#hydration) pre-rendered HTML.

#### Hydration

To enable DOM re-[hydration](/docs/hydration.md) you must return a [vnode](/docs/vnodes.md) that matches your rendered HTML.

```jsx
app({
  events: {
    load(state, actions, element) {
      return walk(element, (node, children) => ({
        tag: node.tagName.toLowerCase(),
        props: {},
        children
      }))
    }
  }
})
```

### `action`

Use `action` to log, inspect or extract information about actions before they are called.

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

### `resolve`

Use `resolve` to validate the result of an action or modify its return type. This event is fired immediately after an action is called.

Allow actions to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```jsx
app({
  events: {
    resolve(state, actions, result) {
      if (result && typeof result.then === "function") {
        return update => result.then(update) && result
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

### `update`

Use `update` to record, validate or prevent state updates.

Return `false` to cancel the update and prevent the view from re-rendering.

```jsx
app({
  events: {
    update(state, actions, nextState) {
      if (Object.keys(nextState).some(prop => !(prop in schema))) {
        console.warn("Invalid state schema: %o.", nextState)
        return false
      }
    }
  }
})
```

### `render`

Use `render` to overwrite the [view](/docs/view.md) function before it is called. If your application does not consume a view this event is not fired.

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

Create custom events with the `emit` function.

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

The `emit` function is available as the return value of the app function call.

```jsx
const emit = app({
  // ...
})
```

Or inside [mixin](/docs/mixins.md#creating-custom-events) functions.

### Interoperability

Custom events can be useful in situations where your application is a part of a larger system and you want to communicate with it from the outside.

```jsx
const emit = app({
  events: {
    populate(state, actions, data) {
      if (actions.populate(data)) {
        actions.toggle(data.index)
      }
    }
  }
})

// ...

emit("populate", yourData)
```

If you find yourself mapping events to actions often, you can encapsulate this functionality in a mixin.

```jsx
const dispatcher = () => ({
  events: {
    dispatch(state, actions, { type, data }) {
      return actions[type](data)
    }
  }
})

const emit = app({
  mixins: [dispatcher()]
})
```

You can now use emit to call any action.

```jsx
emit("dispatch", {
  type: "toggle",
  data: {
    index: 0
  }
})
```

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

```jsx
const mixin = options => emit => ({
  // ...
})
```

This mixin adds a new application event that fires after an action is complete. To implement this mixin we intercept the action result inside [`resolve`](/docs/events.md#resolve) and wrap the thunk / update pipeline.

```jsx
const didAction = () => emit => ({
  events: {
    resolve(state, actions, result) {
      const deepUpdate = (state, result) =>
        typeof result === "function"
          ? deepUpdate(state, result(state))
          : emit("didAction", result)

      return typeof result === "function"
        ? update => result(next => update(state => deepUpdate(state, next)))
        : deepUpdate(state, result)
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

This mixin adds an event that can be used to intercept any other event.

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

 -->
