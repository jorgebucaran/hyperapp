# Virtual Nodes

A virtual node is a JavaScript object that represents a DOM tree.

It consists of a `tag` name, `data` [attributes](#attributes) and `children` array.

```js
{
  tag: "div",
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

The VDOM engine consumes a virtual node to produce a DOM tree.

```html
<div id="app">
  <h1>Hi.</h1>
</div>
```

Create a virtual node using [`h`](/docs/api.md#h).

```js
const tree = h("div", { id: "app" }, [
  h("h1", null, "Hi.")
])
```

Or with [JSX](/docs/jsx.md), [hyperx](/docs/hyperx.md), etc.

```jsx
const vnode = (
  <div id="app">
    <h1>Hi.</h1>
  </div>
)
```

## Attributes

Any valid [HTMLAttributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVGAttributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOMEvents](https://developer.mozilla.org/en-US/docs/Web/Events), [VDOMEvents](/docs/vdom-events.md) or [keys](/docs/keys.md).

```jsx
const MyButton = props =>
  <button
    class="btn-large"
    style={{
      fontSize: "5em",
      color: "Tomato"
    }}
    onclick={props.doSomething}
  >
    {props.title}
  </button>
)
```

