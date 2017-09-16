# Virtual Nodes

A virtual node is a JavaScript object that represents a DOM tree.

```js
{
  tag: "div",
  data: {
    id: "app"
  },
  children: [{
    tag: "h1",
    data: {},
    children: ["Hi."]
  }]
}
```

To create a virtual node use the `h` function.

```js
const node = h("div", { id: "app" }, [
  h("h1", {}, "Hi.")
])
```

Or [JSX](/docs/jsx.md), [hyperx](/docs/hyperx.md), [t7](https://github.com/trueadm/t7), etc. with a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack).

```jsx
const node = (
  <div id="app">
    <h1>Hi.</h1>
  </div>
)
```

A virtual node data can be any valid [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) or [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) attributes, [DOM](https://developer.mozilla.org/en-US/docs/Web/Events), [VDOM](/docs/vdom-events.md) events and [keys](/docs/keys.md).

```jsx
const button = (
  <button
    class="ui button"
    tabindex={0}
    style={{
      fontSize: "3em"
    }}
    onclick={() => {
      // ...
    }}
  >
    Click Me
  </button>
)
```

A function that returns a virtual node is known as a [component](/docs/components.md).

## innerHTML

Use of the innerHTML method can lead to cross-site scripting ([XSS](https://en.wikipedia.org/wiki/Cross-site_scripting)) vunerabilities if not properly sanitized. If you can't use virtual nodes for any reason, create your own dangerouslySetInnerHTML function to explicitly state the intent of performing an "unsafe" operation.

```js
function dangerouslySetInnerHTML(html) {
  return element => {
    element.innerHTML = html
  }
}

function ItemContent({ item }) {
  return (
    <div>
      <a href={item.url} oncreate={dangerouslySetInnerHTML(item.summary)} />
    </div>
  )
}
```

