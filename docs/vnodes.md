# Virtual Nodes

A virtual node is a JavaScript object that represents an element in the DOM tree.

```js
{
  tag: "div",
  props: {
    id: "app"
  },
  children: [{
    tag: "h1",
    data: {},
    children: ["Hi."]
  }]
}
```

To create a virtual node, use the `h` function.

```js
const node = h("div", { id: "app" }, [h("h1", {}, "Hi.")])
```

Alternatives to the built-in `h()` function include [JSX](https://facebook.github.io/jsx/), [hyperx](https://github.com/choojs/hyperx), [t7](https://github.com/trueadm/t7) and [@hyperapp/html](https://github.com/hyperapp/html).

```jsx
const node = (
  <div id="app">
    <h1>Hi.</h1>
  </div>
)
```

Virtual node props may include any valid [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) or [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) attributes, [DOM](https://developer.mozilla.org/en-US/docs/Web/Events), [lifecycle events](lifecycle-events.md), and [keys](keys.md).

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

A function that returns a virtual node is known as a [component](components.md).
