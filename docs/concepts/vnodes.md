# Virtual Nodes

A virtual node is a JavaScript object that represents an element in the DOM tree.

```js
{
  name: "div",
  props: {
    id: "app"
  },
  children: [{
    name: "h1",
    props: {},
    children: ["Hi."]
  }]
}
```

To create a virtual node, use the `h` function.

```js
const node = h("div", { id: "app" }, [h("h1", {}, "Hi.")])
```

Virtual node props may include any valid [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) or [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) attributes, [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), [lifecycle events](lifecycle-events.md), and [keys](keys.md).

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
