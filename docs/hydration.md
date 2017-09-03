# Hydration

Hydration is a perceived performance and search engine optimization technique where you can turn statically rendered DOM nodes into an interactive application.

```jsx
app({
  // ...
  view: (state, actions) =>
    <main>
      <h1>{state.count}</h1>
      <button onclick={actions.up}>＋</button>
    </main>,
  mixins: [hydrator()]
})
```

The process consists of serving the fully pre-rendered page together with your application.

```html
<html>
<head>
  <script defer src="bundle.js"></script>
</head>

<body>
  <main>
    <h1>0</h1>
    <button>＋</button>
  </main>
</body>
</html>
```

Then iterate over the [root](/docs/root.md) child nodes to create a [virtual node](/docs/vnodes.md) tree.

```jsx
const hydrator = () => ({
  events: {
    load(state, actions, element) {
      return walk(element, (node, children) => ({
        tag: node.tagName.toLowerCase(),
        data: {},
        children
      }))
    }
  }
})

function walk(node, map) {
  return map(
    node,
    node
      ? [...node.childNodes]
          .map(
            node =>
              node.nodeType === Node.TEXT_NODE
                ? node.nodeValue.trim() && node.nodeValue
                : walk(node, map)
          )
      : node
  )
}
```
