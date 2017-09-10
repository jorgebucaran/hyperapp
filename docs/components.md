# Components

A component is a function that returns a [virtual node](/docs/vnodes.md). Components are reusable blocks of code that encapsulate markup, styles and behaviors that belong together.

[Try it Online](https://codepen.io/hyperapp/pen/zNxRLy)

```js
const TodoItem = ({ id, value, done, toggle }) =>
  <li
    class={done && "done"}
    onclick={e =>
      toggle({
        value: done,
        id: id
      })}
  >
    {value}
  </li>

const mainView = (state, actions) =>
  <div>
    <h1>Todo</h1>
    <ul>
      {state.todos
        .map(({ id, value, done }) =>
          <TodoItem
            id={id}
            value={value}
            done={done}
            toggle={actions.toggle}
          />
        )}
    </ul>
  </div>
```

If you don't know all the properties that you want to place in a component ahead of time, you can use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).

```jsx
<ul>
  {state.todos
    .map((todo) =>
      <TodoItem
        {...todo}
        toggle={actions.toggle}
      />
    )}
</ul>
```

Note that when using JSX, components [must be capitalized](https://facebook.github.io/react/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized) or contain a `.` in their name.

```jsx
<Component>
  <obj.subcomponent />
</Component>

// Compiled output.

h(Component, {}, [
  h(obj.subcomponent)
])
```

## Component Lifecycle Events

Components share the same lifecycle events as virtual nodes.

See [VDOM events](/docs/vdom-events.md) for details.

