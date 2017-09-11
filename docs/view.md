# View

Use the view to describe your application user interface as a function of the [state](/docs/state.md).

```jsx
app({
  state: {
    herbs: ["Basil", "Parsley", "Coriander"]
  },
  view: state =>
    <main>
      <h1>Herbs</h1>
      {state.herbs.map(herb =>
        <p>
          {herb}
        </p>
      )}
    </main>
})
```

Then bind user events and [actions](/docs/actions.md) together to create interactive applications.

[Try it Online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010)

```jsx
app({
  state: {
    count: 0
  },
  view: (state, actions) =>
    <main>
      <h1>{state.count}</h1>
      <button onclick={actions.down}>ー</button>
      <button onclick={actions.up}>＋</button>
    </main>,
  actions: {
    down(state) {
      return { count: state.count - 1 }
    },
    up(state) {
      return { count: state.count + 1 }
    },
  }
})
```

The view function is called every time we need to generate new [virtual nodes](/docs/vnodes.md) as a result of state changes triggered by actions.
