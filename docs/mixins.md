# Mixins

Use [mixins](/docs/api.md#mixins) to extend your application state, actions and events modularly.

```jsx
const Logger = () => ({
  events: {
    action: (state, actions, data) => console.log(data)
  }
})

app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>{state}</h1>
      <button onclick={actions.up}>+1</button>
    </main>,
  actions: {
    up: state => state + 1
  },
  mixins: [Logger]
})
```

Mixins receive the [emit](/docs/api.md#emit) function. Use it to encapsulate custom event logic inside your mixin.

```jsx
// TODO: Add example using emit inside a mixin.
```

## Patterns

### Fragments

### Widgets

### Getters
