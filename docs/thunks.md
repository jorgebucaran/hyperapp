# Thunks

Actions can return a function instead of a partial state. This function is called a thunk. They operate like regular actions, but will not trigger a state update unless update is called from within the thunk. The action itself returns the result of the thunk.

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

If you are using the previous state to calculate the new state, it's possible that the state was changed by another action that finished before the thunk. In this case you can call update with a reducer function that takes the most up-to-date state.

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

## Async Updates

Use thunks to update the state asynchronously, e.g., inside a callback, after a promise is settled, etc.

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
