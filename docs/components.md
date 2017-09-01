# Components

A component is a function that returns a custom [virtual node](/docs/vnodes.md). Components are reusable blocks of code that encapsulate markup, styles and behaviors that belong together.

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
    <p>
      <ul>
        {state.todos
          .map(t =>
            <TodoItem
              id={t.id}
              value={t.value}
              done={t.done}
              toggle={actions.toggle}
            />
          )}
      </ul>
    </p>
  </div>
```

If you don't know all the properties that you want to place in a component ahead of time, you can use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).

```jsx
<TodoItem
  {...todo}
  toggle={actions.toggle}
/>
```

## Component Lifecycle Events

Components share the same lifecycle events as virtual nodes. See [VDOM Events](/docs/vdom-events.md) for more information.

