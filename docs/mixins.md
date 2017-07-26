# Mixins

Use [mixins](/docs/api.md#mixins) to encapsulate your application behavior into reusable modules, to share or just to organize your code.

```jsx
const ActionsLogger = () => ({
  events: {
    beforeAction: (state, actions, { name, data }) => {
      console.group("Action Info")
      console.log("Name:", name)
      console.log("Data:", data)
      console.groupEnd()
    }
  }
})
```

This mixin listens to [beforeAction](/docs/events.md#beforeAction) events to log action information to the console.

```jsx
app({
  // Your app!
  ...,
  mixins: [ActionsLogger]
})
```

## Emitting Events

### Example #1

Mixins receive the [`emit`](/docs/api.md#emit) function as the first argument. Use it to create new events, etc.

```jsx
const ActionPerformance = (ignore = [], cache = []) => emit => ({
  events: {
    beforeAction(state, actions, { name }) {
      cache.push({
        name,
        time: performance.now()
      })
    },
    afterAction() {
      const { name, time } = cache.pop()

      if (ignore.length === 0 || !ignore.includes(name)) {
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
  // Your app!
  ...,
  events: {
    time: (state, actions, { name, time }) => {
      console.group("Action Time Info")
      console.log("Name:", name)
      console.log("Time:", time)
      console.groupEnd()
    }
  },
  mixins: [ActionPerformance()]
})
```

### Example #2

This mixin emits a `hash` event every time a fragment identifier of the URL changes allowing the user to validate the `location.hash`.

```jsx
const HashGuard = emit => ({
  events: {
    loaded() {
      addEventListener("hashchange", () => {
        const validHash = emit("hash", location.hash)

        if (location.hash !== validHash) {
          location.hash = validHash
        }
      })
    }
  }
})
```

```jsx
app({
  events: {
    hash: (state, actions, hash) => validateHash(hash)
  },
  mixins: [HashGuard]
})
```

## Presets

Mixins can be used to create presets of other mixins. Then use it like any

```jsx
const MyPreset = () => ({
  mixins: [MyMixin1, MyMixin2]
})
```
