# Virtual Nodes

A virtual node is a JavaScript object that describes an HTML/DOM tree.

```js
{
  tag: "main",
  data: {
    id: "app"
  },
  children: [{
    tag: "h1",
    data: null,
    children: ["Hi."]
  }]
}
```

The virtual DOM engine consumes this object to produce the following HTML.

```html
<main id="app">
  <h1>Hi.</h1>
</main>
```

To create virtual nodes you can use the <samp>[h](/docs/api.md#h)</samp> function:

```js
h("main", { id: "app" }, [
  h("h1", null, "Hi.")
])
```

[Hyperx](/docs/hyperx.md):

```js
const main = html`
  <main id="app">
    <h1>Hi.</h1>
  </main>`
```

or [JSX](/docs/jsx.md):

```jsx
const main =
  <main id="app">
    <h1>Hi.</h1>
  </main>
```
