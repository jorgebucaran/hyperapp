# View

Use the [view](/docs/api.md#view) to describe the user interface of your application. The view is a function called every time the state receives an update and returns a tree of [virtual nodes](/docs/virtual-nodes.md).

```jsx
app({
  state: {
    breads: ["Pita", "Naan", "Pumpernickel"]
  },
  view: state =>
    <ul>
      {state.breads.map(bread => <li>{bread}</li>)}
    </ul>
})
```

The view is passed the [actions](/docs/actions.md) object. Use it to bind actions to UI events.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <button onclick={actions.up}>{state}</button>
  ),
  actions: {
    up: state => state + 1
  }
})
```
