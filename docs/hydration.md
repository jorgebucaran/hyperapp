# Hydration

Hydration is a time-to-content and search engine optimization technique where you can turn statically rendered DOM nodes into an interactive application.

```jsx
app({
  state: {
    count: 0
  },
  view: (state, actions) =>
    <main>
      <h1>{state.count}</h1>
      <button onclick={actions.up}>＋</button>
    </main>,
  actions: {
    up: state => ({ count: state.count - 1 })
  },
  mixins: [Hydrator]
})
```

The process consists of serving the fully rendered or pre-rendered page together with your application.

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

Then interating over the [root](/docs/root.md) child nodes to create a [virtual node](/docs/virtual-node.md) tree.

```jsx
const Hydrator = () => ({
  load(state, actions, root) {
    return walk(root, (node, children) => ({
      tag: node.tagName.toLowerCase(),
      data: {},
      children
    }))
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
          .filter(node => node)
      : node
  )
}
```

