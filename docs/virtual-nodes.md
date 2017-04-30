# Virtual Nodes

A virtual node is an object that describes an HTML/DOM tree.

It consists of a <samp>tag</samp>, e.g. <samp>div</samp>, <samp>svg</samp>, etc., <samp>data</samp> attributes and an array of <samp>children</samp>.

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

The virtual DOM engine consumes this object to produce an HTML tree.

```html
<div id="app">
  <h1>Hi.</h1>
</div>
```

To create a virtual node use the [h](/docs/api.md#h) function:

```js
h("div", { id: "app" }, [
  h("h1", null, "Hi.")
])
```

[Hyperx](/docs/hyperx.md):

```js
const div = html`
  <div id="app">
    <h1>Hi.</h1>
  </div>`
```

or [JSX](/docs/jsx.md):

```jsx
const div =
  <div id="app">
    <h1>Hi.</h1>
  </div>
```

## Data Attributes

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

Attributes also include [lifecycle events](/docs/lifecycle-events.md) and meta data such as [keys](#keys).

## Keys

Every time your application is rendered, a virtual node tree is created from scratch.

Keys help identify which nodes were added, changed or removed from the new/old tree.

Use keys to tell the render algorithm to re-order the children instead of mutating them.

```jsx
<ul>
  {urls.map((url, id) => (
    <li key={id}>
      <img src={url} />
    </li>
  ))}
</ul>
```

For example, use keys to force an element to be created only once.

```jsx
<ul>
  <li key="hyper">Hyper</li>
  <li>Super</li>
  <li>Ultra</li>
</ul>
```

If new elements are added to the list, the position of the keyed element will change. Using a key in this way, we make sure <samp>Hyper</samp> is always inserted in the right position instead of mutating its siblings.


