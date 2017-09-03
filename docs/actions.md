# Actions

Use actions to manipulate the [state](/docs/state.md) tree. If your application consumes a [view](/docs/view.md), changes in the state will trigger a re-render. Actions are often called as a result of user events triggered from the view or from inside [events](/docs/events.md).

[Try it Online](https://codepen.io/hyperapp/pen/WpGqpp?editors=0010)

```jsx
app({
  actions: {
    populate(state, actions, { repos = [], isFetching }) {
      return { repos, isFetching }
    }
  },
  events: {
    load(state, actions) {
      actions.populate({ isFetching: true })

      fetch(state.url)
        .then(repos => repos.json())
        .then(repos => actions.populate({ repos, isFetching: false }))
    }
  }
})
```

Returning a new state will update the previous state immediately and schedule a view re-render on the next [repaint](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

[Try it Online](https://codepen.io/hyperapp/pen/qRMEGX?editors=0010)

```jsx
app({
  state: {
    text: "Hello!"
  },
  view: (state, { setText }) =>
    <div>
      <h1>
        {state.text.trim() === "" ? "" : state.text}
      </h1>
      <input
        value={state.text}
        oninput={e => setText(e.target.value)}
      />
    </div>,
  actions: {
    setText(state, actions, text) {
      return { text }
    }
  }
})
```

## Thunks

Actions can return a function instead of a partial state. This function is called a _thunk_. They operate like regular actions, but will not trigger a state update unless `update` is called from within the thunk.

```jsx
app({
  actions: {
    setData(state, actions, data) {
      return update => {
        asyncProcess(data, ({ value }) => update({ value }))
      }
    }
  }
})
```

If you are using the previous state to calculate the new state, it's possible that the state was changed by another action that finished before the thunk. In this case you can call `update` with a reducer function that takes the most up-to-date state.

```jsx
app({
  actions: {
    setData(state, actions, data) {
      return update => {
        asyncProcess(data, ({ value }) =>
          update(state => ({ value: state.value + value }))
        )
      }
    }
  }
})
```

The action returns the result of the thunk, allowing you to use actions as all-purpose getters.

```jsx
app({
  actions: {
    getState(state) {
      return () => state
    }
  }
})
```

A getter retrieves a property from the state tree or the result of a computation.

```jsx
app({
  actions: {
    isAdult({ id }) {
      return () => state.users[id].age >= state.adultAge
    }
  }
})
```

## Async Updates

Use [thunks](#thunks) to update the state asynchronously, e.g., inside a callback, after a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) is settled, etc.

[Try it Online](https://codepen.io/hyperapp/pen/ZeByKv?editors=0010)

```jsx
app({
  actions: {
    getURL(state) {
      return update => fetch(`/search?q=${state.query}`)
        .then(data => data.json())
        .then(json => update({
          url: json[0].url
        })
      )
    }
  }
})
```

Actions need not have a return value, in which case they will not trigger a state update. You can use actions this way to create side effects, call other actions, etc.

```jsx
app({
  actions: {
    setURL(state, actions, data) {
      return { url: data[0].url }
    },
    getURL(state, actions) {
      const req = new XMLHttpRequest()

      req.open("GET", `/search?q=${state.query}`)

      req.onreadystatechange = () => {
        if (
          req.readyState === XMLHttpRequest.DONE &&
          req.status === 200
        ) {
          actions.setURL(JSON.parse(req.responseText))
        }
      }
      req.send()
    }
  }
})
```

## Namespaces

Actions can be nested inside one or more namespaces. Use them to organize your actions by categories or domains.

```jsx
app({
  actions: {
    ...userActions,
    game: gameActions,
    score: scoreActions,
  }
})
```

