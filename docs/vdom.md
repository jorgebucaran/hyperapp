# Virtual DOM

...

## Virtual Nodes

A virtual node or vnode is a JavaScript object that describes a DOM tree.

```jsx
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

Hyperapp consumes this object to update the DOM. To create a virtual node you have several options:

Using the built-in `h()` function.

```jsx
import { h } from "hyperapp"

const node = h(
  "div", { id: "app" }, [
    h("h1", {}, "Hi.")
  ]
)
```

Using our [HTML helpers](https://github.com/hyperapp/html).

```jsx
import { div, h1 } from "@hyperapp/html"

const node = div({ id: "app" }, [h1("Hi.")])
```

Or if you are using a module bundler like [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack), [JSX](/docs/jsx.md), [Hyperx](/docs/hyperx.md), [t7](https://github.com/trueadm/t7), etc.

```jsx
import { h } from "hyperapp"

const node = (
  <div id="app">
    <h1>Hi.</h1>
  </div>
)
```

## Attributes

Also referred to as props, can include any valid [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) or [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) attributes, [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), [lifecycle events](#lifecycle-events) and [keys](/docs/keys.md).

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

## Lifecycle Events

Lifecyle or VDOM events are functions called when a virtual node is created, updated or removed. Use them for animation, data fetching, accessing the real DOM to wrap a third party library, etc.

### `oncreate`

The `oncreate` event is fired after the element is created and attached to the DOM.

<pre>
<a id="oncreate"></a>oncreate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>)
</pre>

Use it to manipulate the DOM node directly, make a network request, start an animation, etc.

```jsx
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

### `onupdate`

The `onupdate` event is fired every time we update the element attributes.

<pre>
<a id="onupdate"></a>onupdate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>, oldProps: <a href="/docs/vdom.md#attributes">Attributes</a>)
</pre>

This event will fire even if the attributes have not changed. You can use `oldProps` inside the event handler to check if they changed or not.

```jsx
function MyComponent({ url, download }) {
  return (
    <main
      onupdate={(_, oldProps) => {
        if (url !== oldProps.url) {
          actions.download(url)
        }
      }}
    />
  )
}
```

### `onremove`

The `onremove` event is fired before the element is removed from the DOM.

<pre>
<a id="onremove"></a>onremove(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>)
</pre>

Use it for cleaning up resources like timers, creating slide out animations, etc.

```jsx
app({
  view: () => (
    <div onremove={element => remove => fadeout(element).then(remove)} />
  )
})
```

### Adapting an External Library

This example shows how to integrate Hyperapp and [CodeMirror](https://codemirror.net/).

[Try it Online](https://hyperapp-code-mirror.glitch.me)

```jsx
const Editor = props =>
  <div
    oncreate={element => {
      const cm = CodeMirror(node => element.appendChild(node))

      // Share it.
      element.CodeMirror = {
        set(props) {
          Object.keys(props).forEach(key => cm.setOption(key, props[key]))
        }
      }

      element.CodeMirror.set(props)
    }}
    onupdate={({ CodeMirror }) => CodeMirror.set(props)}
  />

app({
  //...
  view: state =>
    <Editor
      mode={state.mode}
      theme={state.theme}
      lineNumbers={state.lineNumbers}
    />
})
```

## Components

A component is any function that returns a virtual node tree. Use [components](/docs/components.md) to split up complex user interfaces into reusable views.

```jsx
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

```jsx
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

```jsx
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
