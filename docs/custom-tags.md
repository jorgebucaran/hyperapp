# Custom Tags

A custom tag is a function that returns a custom [virtual node](/docs/virtual-nodes.md).

```js
function Link(props, children) {
  return h("a", { href: props.href }, children)
}

h("main", { id: "app" }, [
  Link({ href: "#" }, "Hi.")
])
```

Here is the generated virtual node.

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
    children: ["Hi."]
  }]
}
```

Custom tags are similar to stateless components in other frameworks.

## JSX

Custom tags and [JSX](/docs/jsx.md) integrate well together.

```jsx
<main id="app">
  <Link href="#">Hi.</Link>
</main>
```

If you don't know all the properties that you want to place on a custom element ahead of time, you can use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).


```jsx
const Link = (props, children) =>
  <a {...props}>{children}</a>
```

