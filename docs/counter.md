# Counter

In this example we'll learn how to use [actions](/docs/actions.md) to update the state of your application.

[Try it online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010)

```jsx
app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>
        {state}
      </h1>
      <button onclick={actions.add}>＋</button>
      <button onclick={actions.sub} disabled={state <= 0}>ー</button>
    </main>,
  actions: {
    add: state => state + 1,
    sub: state => state - 1
  }
})
```

The state is a number and its initial value is 0.

```jsx
state: 0
```

The view function receives the state as the first argument and uses it to display the current value of the counter inside an `<h1>` tag.

```jsx
<h1>{state}</h1>
```

The view also defines two buttons with `onclick` handlers attached to them. The handlers are available in the actions object that is passed to the view as the second argument.

```jsx
<button onclick={actions.add}>+</button>
<button onclick={actions.sub} disabled={state <= 0}>-</button>
```

The `disabled` attribute is dynamically toggled depending on the value of the counter. This prevents the decrement button from being clicked when the counter reaches zero.

```jsx
disabled={state <= 0}
```

Note that neither of the actions update the state directly, instead, they return a new state.

```jsx
add: state => state + 1,
sub: state => state - 1
```

When the state is updated as a result of calling an action, the view function is called and the application is rendered again.

<br/>

[Back to Tutorials](/docs/tutorials.md)
