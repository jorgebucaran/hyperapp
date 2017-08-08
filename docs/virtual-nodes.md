# Virtual Nodes

A virtual node describes a DOM tree.

It consists of a tag, e.g. <samp>div</samp>, <samp>svg</samp>, etc., [attributes](#attributes) and an array of child nodes.

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

The virtual DOM engine consumes a virtual node and produces a DOM tree.

```html
<div id="app">
  <h1>Hi.</h1>
</div>
```

Create virtual nodes with the [`h`](/docs/api.md#h) function.

```js
const vnode = h("div", { id: "app" }, [
  h("h1", null, "Hi.")
])
```

Or use [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) / [Hyperx](https://github.com/substack/hyperx).

```jsx
const vnode = (
  <div id="app">
    <h1>Hi.</h1>
  </div>
)
```

## Attributes

Any valid [HTMLAttributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVGAttributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOMEvents](https://developer.mozilla.org/en-US/docs/Web/Events), [Lifecycle Events](/docs/lifecycle-events.md) or [keys](/docs/keys.md).

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

