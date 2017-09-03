# Countdown Timer

In this example we'll learn how to use [events](/docs/events.md) to register timers and global events.

[Try it Online](https://codepen.io/hyperapp/pen/evOZLv?editors=0010)

```jsx
const pad = n => (n < 10 ? "0" + n : n)

const humanizeTime = t => {
  const hours = (t / 3600) >> 0
  const minutes = ((t - hours * 3600) / 60) >> 0
  const seconds = (t - hours * 3600 - minutes * 60) >> 0
  return `${pad(minutes)}:${pad(seconds)}`
}

const SECONDS = 5

app({
  state: {
    count: SECONDS,
    paused: true
  },
  view: (state, actions) =>
    <main>
      <h1>
        {humanizeTime(state.count)}
      </h1>

      <button onclick={actions.toggle}>
        {state.paused ? "START" : "PAUSED"}
      </button>

      <button onclick={actions.reset}>RESET</button>
    </main>,
  actions: {
    toggle: state => ({ paused: !state.paused }),
    reset: state => ({ count: SECONDS }),
    drop: state => ({ count: state.count - 1 }),
    tick: (state, actions) => {
      if (state.count === 0) {
        actions.reset()
        actions.toggle()
      } else if (!state.paused) {
        actions.drop()
      }
    }
  },
  events: {
    load(state, actions) {
      setInterval(actions.tick, 1000)
    }
  }
})
```

The state consists of two properties: `count`, to track the seconds elapsed; and `paused`, to check if the clock is currently running.

```jsx
state: {
  count: SECONDS,
  paused: true
}
```

The view displays the seconds inside a `<h1>` element and binds two buttons to `actions.toggle` and `actions.reset` respectively.

```jsx
<button onclick={actions.toggle}>
  {state.paused ? "START" : "PAUSED"}
</button>

<button onclick={actions.reset}>RESET</button>
```

To simulate the clock we use [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) and call `actions.tick` every second.

```jsx
events: {
  load(state, actions){
    setInterval(actions.tick, 1000)
  }
}
```

Inside `tick`, we check the current second count and if it's zero, reset the counter back to `SECONDS` and toggle the running clock.

If `state.count` is greater than zero and the clock is not paused, we decrement the count by one.

```jsx
if (state.count === 0) {
  actions.reset()
  actions.toggle()
} else if (!state.paused) {
  actions.drop()
}
```
