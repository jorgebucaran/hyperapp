# Virtual Nodes

A virtual node is an object that describes an HTML/DOM tree.

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

The virtual DOM engine consumes a virtual node and produces an HTML tree.

```html
<div id="app">
  <h1>Hi.</h1>
</div>
```

You can use the [h(tag, data, children)](/docs/api.md#h) utility function to create virtual nodes.

```js
h("div", { id: "app" }, [
  h("h1", null, "Hi.")
])
```

Or setup a build pipeline and use [Hyperx](/docs/hyperx.md) or [JSX](/docs/jsx.md) instead.

## Attributes

Any valid HTML [attributes/properties](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [events](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers), [styles](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference), etc.

```js
data: {
  id: "myButton",
  class: "PrimaryButton",
  onclick: () => alert("Hi."),
  disabled: false,
  style: {
    fontSize: "3em"
  }
}
```

Attributes also include [lifecycle events](/docs/lifecycle-events.md) and meta data such as [keys](/docs/keys.md).
