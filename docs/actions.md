# Actions

Use actions to manipulate the [state](/docs/state.md) tree. If your application consumes a [view](/docs/view.md), changes in the state will trigger a re-render.

```jsx
app({
  state: {
    text: ""
  },
  actions: {
    initialize() {
      return { text: "Hello!" }
    }
  },
  events: {
    load(state, actions) {
      actions.initialize()
    }
  }
})
```

Actions are often called as a result of user events triggered from the view or from inside application [events](/docs/events.md).

Returning a partial state will update the state immediately and schedule a view re-render on the next [repaint](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

[Try it Online](https://codepen.io/hyperapp/pen/qRMEGX?editors=0010)

```jsx
app({
  state: {
    text: "Hello!",
    defaultText: "Nice weather today."
  },
  view: (state, { setText }) =>
    <div>
      <h1>
        {state.text.trim() === ""
          ? state.defaultText
          : state.text}
      </h1>
      <input
        autofocus
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

Actions can return a function instead of a partial state. This function is called a _thunk_. They operate like regular actions but will not trigger a state update unless [`update`](/docs/api.md#update) is called from within the thunk function.

```jsx
app({
  actions: {
    defer(state, actions, data) {
      return update => {
        // ...
        update(newData)
      }
    }
  }
})
```

The action returns the result of the thunk, allowing you to modify how actions operate and what types they can return.

Use thunks to defer state updates, [wrap actions](/docs/events.md#resolve) to create scoped mixins, [getters](#getters), etc.

## Async Updates

Use [thunks](#thunks) to update the state asynchronously, e.g., after a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) resolves.

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

## Getters

A getter is a [thunk](#thunks) that retrieves a property from the state tree or the result of a computation.

```jsx
app({
  actions: {
    isAdult({ userId }) {
      return () => state.users[userId].age >= state.currentAdultAge
    }
  }
})
```

## Namespaces

We iterate over action keys recursively during setup, allowing for nested actions.

```jsx
app({
  actions: {
    game: gameActions,
    score: scoreActions,
    ...userActions
  }
})
```

Use namespaces to organize your actions by different categories or domains.

```jsx
actions.game.start()
```
