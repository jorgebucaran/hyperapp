# Mixins

Use [mixins](/docs/api.md#mixins) to extend your application state, actions and events in a modular fashion.

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
      <button onclick={actions.addOne}>+1</button>
    </main>,
  actions: {
    addOne: state => state + 1
  },
  mixins: [Logger]
})
```

