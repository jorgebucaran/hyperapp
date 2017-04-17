# h(<a href="#h_tag">tag</a>, <a href="#h_data">data</a>, <a href="#h_children">children</a>)

Returns a virtual node.

```js
h("button", { onClick: () => alert("Hi!") }, "Click Me")
```

The returned object looks like this:

```js
{
  tag: "button",
  data: {
    onClick: () => alert("Hi!")
  }
  children: "Click Me"
}
```

### <a name="h_tag"> tag

A tag name, e.g. `div`, `button`, etc.

Or a function returning a virtual node.

```js
const Link = ({ href }, children) =>
  h("a", { href }, children)
```

### <a name="h_data"> data

An object with attributes, styles, events, [lifecycle events](#...), etc.

```js
{
  id: "myButton",
  style: {
    color: "red"
  },
  onClick: event => alert(event.target)
}
```

### <a name="h_children"> children

One or more virtual nodes or Array of virtual nodes.

```js
h("ul", null, [
  h("li", null, "Hyper"),
  h("li", null, "Ultra"),
  h("li", null, "Turbo")
])
```

