# Actions

Use actions to update the state.

```jsx
app({
  state: "Hi.",
  view: (state, actions) => (
    <h1 onclick={actions.ucase}>{state}</h1>
  ),
  actions: {
    ucase: state => state.toUpperCase()
  }
})
```

To be able to update the state, an action must return a new state or a part of it.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOne}>+1</button>
    </main>
  ),
  actions: {
    addOne: state => state + 1
  }
})
```

You can pass data to actions as well.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button
        onclick={() => actions.addSome(1)}>More
      </button>
    </main>
  ),
  actions: {
    addSome: (state, actions, data = 0) => state + data
  }
})
```

Actions are not required to have a return value. You can use them to call other actions, for example after an asynchronous operation has completed.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOneDelayed}></button>
    </main>
  ),
  actions: {
    addOne: state => state + 1,
    addOneDelayed: (state, actions) => {
      setTimeout(actions.addOne, 1000)
    }
  }
})
```

An action may return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This enables you to use [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

```jsx
const delay = seconds =>
  new Promise(done => setTimeout(done, seconds * 1000))

app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOneDelayed}>+1</button>
    </main>
  ),
  actions: {
    addOne: state => state + 1,
    addOneDelayed: async (state, actions) => {
      await delay(1)
      actions.addOne()
    }
  }
})
```

## Namespaces

Namespaces let you organize actions into categories and help reduce name collisions as your application grows larger.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <button onclick={actions.counter.add}>+</button>
      <h1>{state}</h1>
      <button onclick={actions.counter.sub}>-</button>
    </main>
  ),
  actions: {
    counter: {
      add: state => state + 1,
      sub: state => state - 1
    }
  }
})
```
