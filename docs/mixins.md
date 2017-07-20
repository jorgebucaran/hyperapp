# Mixins

Use [mixins](/docs/api.md#mixins) to extend the state, actions and events of your application. You can use this mechanism to inject new functionality

```jsx
const ActionLogger = () => ({
  events: {
    action: (state, actions, { name, data }) => {
      console.group("Action Info")
      console.log("Name:", name)
      console.log("Data:", data)
      console.groupEnd()
    }
  }
})


app({
  // Your app!
  ...,
  mixins: [ActionLogger]
})
```



Mixins can compose other mixins as well.

```jsx
const Remix = () => ({
  events: {
    update: (state, actions)
  },
  mixins: [ActionLogger]
})

app({
  ...,
  mixins: [Remix]
})
```

Mixins receive the [`emit`](/docs/api.md#emit) function as the first argument. Use it to encapsulate custom event logic inside your mixin.

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

app({
  events: {
    hash: (state, actions, hash) => validateHash(hash)
  },
  mixins: [HashGuard]
})
```



