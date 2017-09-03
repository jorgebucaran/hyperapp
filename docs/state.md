# State

Use the state to describe the data model in your application.

[Try it Online](https://codepen.io/hyperapp/pen/zNxRLy?editors=0110)

```jsx
app({
  state: {
    todos: [
      {
        id: 1337,
        done: false,
        text: "Empty trash."
      }
    ],
    todoText: ""
  },
  view: state =>
    <main>
      ...
      {state.todos.map(todo => <TodoItem {...todo} />)}
    </main>
})
```

The notion of representing the application state as a single source of truth is known as single state tree and the tree is manipulated using [actions](/docs/actions.md).
