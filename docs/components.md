# Components

A component is a function that returns a custom [virtual node](/docs/virtual-nodes.md). Components are reusable blocks of code that encapsulate markup, styles and behaviours that belong together.

```js
const Link = (props, children) =>
  <a href={props.href}>
    {children}
  </a>

app({
  view: () =>
    <main id="app">
      <Link href="#">Hi!</Link>
    </main>
})
```

Here is the corresponding virtual node tree.

```js
{
  tag: "main",
  data: {
    id: "app"
  },
  children: [{
    tag: "a",
    data: {
      href: "#"
    },
    children: ["Hi!"]
  }]
}
```

If you don't know all the properties that you want to place in a component ahead of time, you can use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).

```jsx
const Link = (props, children) =>
  <a {...props}>{children}</a>
```

## Component Lifecycle Events

Components share the same lifecycle events available to virtual nodes. See [Lifecyle Events](/docs/lifecycle-events.md) for details.

