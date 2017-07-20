# Actions

Use [actions](/docs/api.md#actions) to update the state.

```jsx
app({
  state: "Hi.",
  view: (state, actions) =>
    <h1 onclick={actions.ucase}>
      {state}
    </h1>,
  actions: {
    ucase: state => state.toUpperCase()
  }
})
```

An action must return a new state or a part of it in order to update the state.

```jsx
app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>
        {state}
      </h1>
      <button onclick={actions.up}>+</button>
    </main>,
  actions: {
    up: state => state + 1
  }
})
```

You can pass data to actions as well.

```jsx
app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>
        {state}
      </h1>
      <button onclick={() => actions.up(1)}>+</button>
    </main>,
  actions: {
    up: (state, actions, data = 0) => state + data
  }
})

```

Actions are not required to have a return value. You can use them to call other actions, for example after an async operation has completed.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.upLater}>+</button>
    </main>
  ),
  actions: {
    up: state => state + 1,
    upLater: (state, actions) => {
      setTimeout(actions.up, 1000)
    }
  }
})
```

Actions can return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This enables you to use [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

```jsx
const delay = seconds =>
  new Promise(done => setTimeout(done, seconds * 1000))

app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.upLater}>+1</button>
    </main>
  ),
  actions: {
    upLater: async (state, actions) => {
      await delay(1)
      return state + 1
    }
  }
})
```

## Namespaces

Namespaces let you organize actions into categories or domains.

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

## Updating a Complex State

Suppose we have a complex state object and wish to update a given property avoiding mutation.

```jsx
const state = {
  players: [
    {
      name: "Mario",
      lives: 1
    },
    ...
  ]
}
```

Here is one way we could achieve this using [Ramda](https://github.com/ramda/ramda).

[Try it online](https://codepen.io/hyperapp/pen/Zygvbg?editors=0010)

```jsx
app({
  ...,
  actions: {
    oneUp(state, actions, index) {
      return R.over(
        R.lensPath(["players", index, "lives"]),
        lives => lives + 1,
        state
      )
    }
  }
})
```

See also also [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide) and [Immutable.js](https://github.com/facebook/immutable-js/) for other popular alternatives.



