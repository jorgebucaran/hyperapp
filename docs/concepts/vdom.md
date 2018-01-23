# Virtual DOM

A virtual DOM is a description of what a DOM should look like, using a tree of nested JavaScript objects known as virtual nodes.

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

The virtual DOM tree of your application is created from scratch on every render cycle. This means we call the view function every time the state changes and use the newly computed tree to update the actual DOM.

We try to do it in as few DOM operations as possible, by comparing the new virtual DOM against the previous one. This leads to high efficiency, since typically only a small percentage of nodes need to change, and changing real DOM nodes is costly compared to recalculating a virtual DOM.

To help you create virtual nodes in a more compact way, Hyperapp provides the h function.

```js
import { h } from "hyperapp"

const node = h(
  "div",
  {
    id: "app"
  },
  [h("h1", null, "Hi.")]
)
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

A function that returns a virtual node is also known as a [component](components.md).
