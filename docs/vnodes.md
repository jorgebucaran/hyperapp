# VNodes

A vnode or vnode is a JavaScript object that describes a DOM tree.

```js
{
  tag: "div",
  props: {
    id: "app"
  },
  children: [{
    tag: "h1",
    props: {},
    children: ["Hi."]
  }]
}
```

Hyperapp consumes this object to updates the real DOM. To create a vnode use the `h()` function.

```js
const node = h(
  "div",
  {
    id: "app"
  },
  [
    h("h1", {}, "Hi.")
  ]
)
```

Or if you are using a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack), with [JSX](/docs/jsx.md), [hyperx](/docs/hyperx.md), [t7](https://github.com/trueadm/t7), etc.

```jsx
const node = (
  <div id="app">
    <h1>Hi.</h1>
  </div>
)
```

## Attributes

Also referred to as props, can include any valid [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) or [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) attributes, [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), [VDOM events](/docs/vdom-events.md) and [keys](/docs/keys.md).

```jsx
const button = h(
  "button",
  {
    props: {
      class: "ui button",
      tabindex: 0,
      style: {
        fontSize: "3em"
      },
      onclick() {
        // ...
      }
    }
  },
  ["Click Me"]
)
```

## Lifecycle

You can get notified when a vnode is created, updated or removed via [VDOM events](/docs/vdoom-events.md).

```js
app({
  view: () =>
    <input
      type="text"
      oncreate={element => {
        element.focus()
      }}
    />
})
```

Use them for animation, data fetching, accessing real DOM nodes, wrapping a third party library, etc.

## Components

A component is a function that returns a vnode tree. Use [components](/docs/components.md) to split up complex user interfaces into reusable blocks.

```js
function Card({ title, caption }) {
  return (
    <section class="card">
      <div class="card-content">
        <p class="title">{title}</p>
        <p class="caption">{caption}</p>
      </div>
    </section>
  )
}
```

Then use it like any other HTML element.

```js
app({
  view: state =>
    <Card
      title="When in doubt, use brute force."
      caption="Ken Thompson"
    />
})
```

## innerHTML

Use of the innerHTML method can lead to cross-site scripting ([XSS](https://en.wikipedia.org/wiki/Cross-site_scripting)) vunerabilities if not properly sanitized. If you can't use vnodes for any reason, create your own replacement function to explicitly state the intent of performing an "unsafe" operation.

```js
function dangerouslySetInnerHTML(html) {
  return element => {
    element.innerHTML = html
  }
}

function ItemContent({ item: { url, summary } }) {
  return (
    <div class="content">
      <a href={url} oncreate={dangerouslySetInnerHTML(summary)} />
    </div>
  )
}
```

Setting HTML from code is dangerous because it's easy to inadvertently expose your users to an XSS attack. [DOMPurify](https://github.com/cure53/DOMPurify) and [sanitize-html](https://github.com/punkave/sanitize-html) are two popular HTML sanitizer libraries.
