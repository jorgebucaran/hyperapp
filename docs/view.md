# View

The [view](/docs/api.md#view) is a function called every time the state receives an update and returns a [virtual node](/docs/virtual-nodes.md) tree.

```jsx
app({
  state: {
    breads: ["Pita", "Naan", "Pumpernickel"]
  },
  view: state => (
    <ul>
      {state.breads.map(bread => <li>{bread}</li>)}
    </ul>
  )
})
```
