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

An action must return a partial state or a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a partial state. See [Side Effects](#side-effects).

```jsx
app({
  state: {
    count: 0,
    maxCount: 10
  },
  view: (state, actions) =>
    <main>
      <h1>
        {state.count}
      </h1>
      <button onclick={actions.up}>+</button>
    </main>,
  actions: {
    up: ({ count, maxCount }) => ({
      count: count + (maxCount > count ? 1 : -maxCount)
    })
  }
})
```

You can pass data to actions as well.

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
      <button onclick={() => actions.up(1)}>+</button>
    </main>,
  actions: {
    up: ({ count }, actions, data = 0) => ({
      count: count + data
    })
  }
})
```

## Side Effects

Actions are not required to have a return value. You can use them to call other actions, for example after an async operation has completed.

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
      <button onclick={actions.upLater}>+</button>
    </main>,
  actions: {
    up: ({ count }) => ({
      count: count + 1
    }),
    upLater: (state, actions) => {
      setTimeout(actions.up, 1000)
    }
  }
})
```

Actions can return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```jsx
app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>
        {state}
      </h1>
      <button onclick={actions.upLater}>+1</button>
    </main>,
  actions: {
    upLater: (state, actions) =>
      new Promise(resolve => setTimeout(resolve, 1000, state + 1))
  }
})
```

Actions can be written as [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) too.

```jsx
const delay = result =>
  new Promise(resolve => setTimeout(resolve, 1000, result))

app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>
        {state}
      </h1>
      <button onclick={actions.upLater}>+1</button>
    </main>,
  actions: {
    upLater: async state => await delay(state + 1)
  }
})
```

## Namespaces

Namespaces let you organize actions into categories or domains.

```jsx
app({
  state: 0,
  view: (state, actions) =>
    <main>
      <button onclick={actions.counter.up}>+</button>
      <h1>
        {state}
      </h1>
      <button onclick={actions.counter.down}>-</button>
    </main>,
  actions: {
    counter: {
      up: state => state + 1,
      down: state => state - 1
    }
  }
})
```

## Complex State

Suppose we have a complex state object and wish to update a given property avoiding mutation.

Here is one way we could achieve this using [Ramda](https://github.com/ramda/ramda).

[Try it online](https://codepen.io/hyperapp/pen/Zygvbg?editors=0010)

```jsx
app({
  state: {
    counters: [{ value: 1 }, { value: 2 }, { value: 4 }]
  },
  actions: {
    oneUp: (state, actions, index) => {
      return R.over(
        R.lensPath(["counters", index, "value"]),
        value => value + 1,
        state
      )
    }
  }
})
```

See also [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide) and [Immutable.js](https://github.com/facebook/immutable-js/) for alternatives.



