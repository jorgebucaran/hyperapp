# Hydration

Hydration is a perceived performance and search engine optimization technique where you can turn statically rendered DOM nodes into an interactive application.

The process consists of serving the fully pre-rendered page together with your application.

```html
<html>
<head>
  <script defer src="bundle.js"></script>
</head>

<body>
  <main>
    <h1>0</h1>
    <button>+</button>
  </main>
</body>
</html>
```

Then traverse your root DOM tree to create a [virtual node](/docs/vdom.md#virtual-nodes) tree.

```jsx
import { h, app } from "hyperapp"
import { hydrate } from "@hyperapp/hydrate"

app(
  {
    // ...
    view: (state, actions) => (
      <main>
        <h1>{state.count}</h1>
        <button onclick={actions.up}>+</button>
      </main>
    )
  },
  hydrate(document.getElementById("main"))
)
```

The implementation of hydrate is simple enough that we can include it here.

```jsx
import { h } from "hyperapp"

export function hydrate(element) {
  return walk(element, (node, children) =>
    h(node.tagName.toLowerCase(), {}, children))
}

function walk(node, map) {
  return map(
    node,
    node
      ? [...node.childNodes].map(
          node =>
            node.nodeType === Node.TEXT_NODE
              ? node.nodeValue.trim() && node.nodeValue
              : walk(node, map)
        )
      : node
  )
}
```
