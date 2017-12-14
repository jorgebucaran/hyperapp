# Components

A component is a pure function that returns a [virtual node](vnodes.md). Unlike a view, they are not pre-wired to your application state or actions. Components are reusable blocks of code that encapsulate markup, styles and behaviors that belong together.

[Try it Online](https://codepen.io/hyperapp/pen/zNxRLy)

```jsx
const TodoItem = ({ id, value, done, toggle }) => (
  <li
    class={done && "done"}
    onclick={e =>
      toggle({
        value: done,
        id: id
      })
    }
  >
    {value}
  </li>
)

const mainView = ({ state, actions }) => (
  <div>
    <h1>Todo</h1>
    <ul>
      {state.todos.map(({ id, value, done }) => (
        <TodoItem id={id} value={value} done={done} toggle={actions.toggle} />
      ))}
    </ul>
  </div>
)
```

If you don't know all the properties that you want to place in a component ahead of time, you can use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).

```jsx
const TodoList = ({ todos, toggle }) => (
  <ul>{todos.map(todo => <TodoItem {...todo} toggle={toggle} />)}</ul>
)
```

Note that when using JSX, components [must be capitalized](https://facebook.github.io/react/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized) or contain a `.` in their name.

## Children Composition

Components receive children elements in the second argument.

```jsx
const Box = ({ color }, children) => (
  <div class={`box box-${color}`}>{children}</div>
)
```

This lets you and other components pass arbitrary children down to them.

```jsx
const HelloBox = ({ name }) => (
  <Box color="green">
    <h1 class="title">Hello, {name}!</h1>
  </Box>
)
```
