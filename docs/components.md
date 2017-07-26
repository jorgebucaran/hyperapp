# Components

A [component](/docs/api.md#component) is a function that returns a custom [virtual node](/docs/virtual-nodes.md). Components are reusable blocks of code that encapsulate markup, styles and behaviours that belong together.

[Try it online](https://codepen.io/hyperapp/pen/WRWbKw?editors=0010)

```js
const Title = ({ url, value }/*, children*/) =>
  <h1>
    <a href={url}>{value}</a>
  </h1>

app({
  view: () =>
    <main id="app">
      <Title url="#" value="Link" />
    </main>
})
```

Here is the corresponding virtual node.

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
    children: [{
      tag: "h1",
      data: undefined,
      children: ["Hello."]
    }]
  }]
}
```

If you don't know all the properties that you want to place in a component ahead of time, you can use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).

```jsx
const Link = (props, children) =>
  <a {...props}>{children}</a>

<Link href="#">"Hello."</Link>
```

## Component Lifecycle Events

Components share the same lifecycle events available to virtual nodes. See [Lifecyle Events](/docs/lifecycle-events.md) for details.

