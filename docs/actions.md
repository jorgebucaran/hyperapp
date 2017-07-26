# Actions

Actions are functions which take the current [state](/docs/state.md) and return a partial state or a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a partial state. Actions represent the intent to manipulate the state tree.

[Try it online](https://codepen.io/hyperapp/pen/qRMEGX?editors=0010)

```jsx
app({
  state: {
    text: "Hello!",
    defaultText: "<3"
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
    setText: (state, actions, text) => ({ text })
  }
})
```

Actions are often called as a result of user events triggered on the [view](/docs/view.md), or inside application [events](/docs/events.md).

## Async Updates

Actions can return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a partial state. This minimizes the amount of code we need to write to update the state asynchronously.

[Try it online](https://codepen.io/hyperapp/pen/ZeByKv?editors=0010)

```jsx
app({
  // ...
  actions: {
    getURL(state) {
      return fetch(`/search?q=${state.query}`)
        .then(data => data.json())
        .then(json => ({
          url: json[0].url
        })
      )
    }
  }
})
```

Actions need not have a return value at all. You can use an action to create side effects, call other actions inside a callback, etc.

```jsx
app({
  // ...
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

## Thunks

Actions can return a function (thunk) instead of a partial state. If an action returns a _thunk_, we immediately call it passing it a function that you can use to trigger an update in the state tree.

```jsx
app({
  // ...
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

The return value of the action is whatever the _thunk_ returns. Using this mechanism you can modify the default behavior of actions, e.g., to create getters, scoped mixins, etc.

## Namespaces

We iterate over your action keys, allowing for namespaced actions. Namespaces help you organize your actions into categories or domains.

```jsx
app({
  // ...
  actions: {
    Game: gameActions,
    Score: scoreActions,
    ...userActions
  }
})
```

