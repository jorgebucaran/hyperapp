# View

The [view](/docs/api.md#view) represents the user interface in your application. The view function is called every time the state receives an update and returns a [virtual node](/docs/virtual-nodes.md).

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

The view receives the [actions](/docs/actions.md) object as the second argument. Use it to bind actions to UI events.

[Try it Online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010)

```jsx
app({
  state: {
    count: 0
  },
  view: (state, actions) =>
    <main>
      <h1>{state.count}</h1>
      <button onclick={actions.sub}>ー</button>
      <button onclick={actions.add}>＋</button>
    </main>,
  actions: {
    sub: state => ({ count: state.count - 1 }),
    add: state => ({ count: state.count + 1 })
  }
})
```


