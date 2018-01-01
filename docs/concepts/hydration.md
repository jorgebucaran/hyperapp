# Hydration

Hyperapp works with SSR and pre-rendered HTML, enabling SEO optimization and improving your sites time-to-interactive. The process consists of serving a fully pre-rendered page together with your application. To take advantage of this, you will need a `hydrate` function.

```js
const hydrate = element => {
  const hydrateNode = node =>
    node && {
      name: node.nodeName.toLowerCase(),
      props: {},
      children: [...node.childNodes].map(
        child =>
          child.nodeType === Node.TEXT_NODE
            ? child.nodeValue
            : hydrateNode(child)
      )
    }
  return hydrateNode(element.children[0])
}
```

Use `hydrate` to provide the initial VDOM to your app.

```js
...
container = document.getElementById("app")

app(state, actions, view, container, hydrate(container))
```

Then instead of throwing away the server-rendered markdown, we'll turn your DOM nodes into an interactive application!
