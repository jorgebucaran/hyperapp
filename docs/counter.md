# Counter

In this section we'll walk through a simple counter example.

[View Online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010)

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.add}>+</button>
      <button onclick={actions.sub} disabled={state <= 0}>-</button>
    </main>
  ),
  actions: {
    add: state => state + 1,
    sub: state => state - 1
  }
})
```

The entire state is a number and its initial value is 0.

```jsx
state: 0
```

When the <samp>app</samp> function runs for the first time, the state is passed to the view and its value is displayed inside an <samp>\<h1\></samp> tag.

```jsx
<h1>{state}</h1>
```

There are also two buttons in the view that have <samp>onclick</samp> handlers attached to them. The handlers are the actions that get passed to the view as the second argument.

```jsx
<button onclick={actions.add}>+</button>
<button onclick={actions.sub} disabled={state <= 0}>-</button>
```

The <samp>disabled</samp> attribute is dynamically toggled depending on the value of the counter. This prevents the decrement button from being clicked when the counter reaches zero.

```jsx
disabled={state <= 0}
```

Notice that neither <samp>actions.add</samp> or <samp>actions.sub</samp> update the state directly, instead, they return a new state.

```jsx
add: state => state + 1,
sub: state => state - 1
```

When the state is updated as a result of calling an action, the view function is called and the application is rendered again.
