# Counter

In this example we'll learn how to use [actions](/docs/actions.md) to update the [state](/docs/state.md).

[Try it Online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010)

```jsx
app({
  state: {
    count: 0
  },
  view: (state, actions) =>
    <main>
      <h1>
        {state.count}
      </h1>
      <button onclick={actions.down} disabled={state.count <= 0}>—</button>
      <button onclick={actions.up}>+</button>
    </main>,
  actions: {
    down: state => ({ count: state.count - 1 }),
    up: state => ({ count: state.count + 1 })
  }
})
```

The state consists of a single property: `count` which is initialized to 0.

```jsx
state: {
  count: 0
}
```

The view function receives the state as the first argument and uses it to display the current value of the counter inside an `<h1>` tag.

```jsx
<h1>{state.count}</h1>
```

The + and – buttons `onclick` handlers are handled by your actions, passed to the view as the second argument.

```jsx
<button onclick={actions.down} disabled={state.count <= 0}>-</button>
<button onclick={actions.up}>+</button>
```

The `disabled` attribute is dynamically toggled depending on the value of the counter. This prevents the decrement button from being clicked when the counter reaches zero.

```jsx
disabled={state.count <= 0}
```

Actions never update the state directly, instead, they return a new state.

```jsx
down: state => ({ count: state.count - 1 }),
up: state => ({ count: state.count + 1 })
```

When the state is updated as a result of calling an action, the view is called and the application is re-rendered.
