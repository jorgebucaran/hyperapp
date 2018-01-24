# Advanced Concepts

<!-- TOC -->

* [Virtual DOM](#virtual-dom)
* [Components](#components)
  * [Children Composition](#children-composition)
* [Keys](#keys)
* [Lifecycle Events](#lifecycle-events)
  * [oncreate](#oncreate)
  * [onupdate](#onupdate)
  * [onremove](#onremove)
  * [ondestroy](#ondestroy)
* [Sanitation](#sanitation)
* [Hydration](#hydration)

<!-- /TOC -->

## Virtual DOM

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

A virtual node props may include any valid [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) or [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) attributes, [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), [lifecycle events](lifecycle-events.md), and [keys](#keys).

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

A function that returns a virtual node is also known as a [component](#components).

## Components

A component is a pure function that returns a [virtual node](vdom.md). Unlike a view, they are not pre-wired to your application state or actions. Components are reusable blocks of code that encapsulate markup, styles and behaviors that belong together.

[Live Example](https://codepen.io/hyperapp/pen/zNxRLy)

```jsx
import { h, app } from "hyperapp"
import { state, actions } from "./todos"

const TodoItem = ({ id, value, done, toggle }) => (
  <li
    class={done && "done"}
    onclick={e =>
      toggle({
        value: done,
        id: id
      })
    }
  >
    {value}
  </li>
)

const view = (state, actions) => (
  <div>
    <h1>Todo</h1>
    <ul>
      {state.todos.map(({ id, value, done }) => (
        <TodoItem id={id} value={value} done={done} toggle={actions.toggle} />
      ))}
    </ul>
  </div>
)

const main = app(state, actions, view, document.body)
```

If you don't know all the properties that you want to place in a component ahead of time, you can use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).

```jsx
const TodoList = ({ todos, toggle }) => (
  <ul>{todos.map(todo => <TodoItem {...todo} toggle={toggle} />)}</ul>
)
```

Note that when using JSX, components [must be capitalized](https://facebook.github.io/react/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized) or contain a `.` in their name.

### Children Composition

Components receive children elements in the second argument.

```jsx
const Box = ({ color }, children) => (
  <div class={`box box-${color}`}>{children}</div>
)
```

This lets you and other components pass arbitrary children down to them.

```jsx
const HelloBox = ({ name }) => (
  <Box color="green">
    <h1 class="title">Hello, {name}!</h1>
  </Box>
)
```

## Keys

Keys help identify which nodes were added, changed or removed from a list when a view is rendered. A key must be unique among sibling-nodes.

```jsx
const ImageGallery = ({ images }) =>
  images.map(({ hash, url, description }) => (
    <li key={hash}>
      <img src={url} alt={description} />
    </li>
  ))
```

By setting the `key` property on a virtual node, you declare that the node should correspond to a particular DOM element. This allow us to re-order the element into its new position, if the position changed, rather than risk destroying it.

Don't use an array index as key, if the index also specifies the order of siblings. If the position and number of items in a list is fixed, it will make no difference, but if the list is dynamic, the key will change every time the tree is rebuilt.

```jsx
const PlayerList = ({ players }) =>
  players
    .slice()
    .sort((player, nextPlayer) => nextPlayer.score - player.score)
    .map(player => (
      <li key={player.username} class={player.isAlive ? "alive" : "dead"}>
        <PlayerCard {...player} />
      </li>
    ))
```

## Lifecycle Events

You can be notified when a virtual node is created, updated or removed via lifecycle events. Use them for animation, data fetching and cleaning up resources.

### oncreate

This event is fired after the element is created and attached to the DOM. Use it to manipulate the DOM node directly, make a network request, create slide/fade in animation, etc.

```jsx
const Textbox = ({ placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    oncreate={element => element.focus()}
  />
)
```

### onupdate

This event is fired every time we update the element attributes. Use `oldProps` inside the event handler to check if any attributes changed or not.

```jsx
const Textbox = ({ placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    onupdate={(element, oldProps) => {
      if (oldProps.placeholder !== placeholder) {
        // Handle changes here!
      }
    }}
  />
)
```

### onremove

This event is fired before the element is removed from the DOM. Use it to create slide/fade out animations. Call `done` inside the function to remove the element.

This event is not called in its child elements.

```jsx
const MessageWithFadeout = ({ title }) => (
  <div onremove={(element, done) => fadeout(element).then(done)}>
    <h1>{title}</h1>
  </div>
)
```

### ondestroy

This event is fired after the element has been removed from the DOM, either directly or as a result of a parent being removed. Use it for invalidating timers, canceling a network request, removing global events listeners, etc.

```jsx
const Camera = ({ onerror }) => (
  <video
    poster="loading.png"
    oncreate={element => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => (element.srcObject = stream))
        .catch(onerror)
    }}
    ondestroy={element => element.srcObject.getTracks()[0].stop()}
  />
)
```

## Sanitation

Use of the innerHTML property can lead to cross-site scripting ([XSS](https://en.wikipedia.org/wiki/Cross-site_scripting)) vunerabilities if not properly sanitized. If you can't use vitual nodes for any reason, create your own replacement function to explicitly state the intent of performing an "unsafe" operation.

```jsx
const dangerouslySetInnerHTML = html => element => {
  element.innerHTML = html
}

const ItemContent = ({ item: { url, summary } }) => (
  <div class="content">
    <a href={url} oncreate={dangerouslySetInnerHTML(summary)} />
  </div>
)
```

Use with caution! Setting HTML from code is dangerous because it's easy to inadvertently expose your users to an XSS attack. [DOMPurify](https://github.com/cure53/DOMPurify) and [sanitize-html](https://github.com/punkave/sanitize-html) are two popular HTML sanitizer libraries.

## Hydration

Hyperapp works transparently with SSR and pre-rendered HTML, enabling SEO optimization and improving your sites time-to-interactive. The process consists of serving a fully pre-rendered page together with your application.

```html
<html>
<head>
  <script defer src="bundle.js"></script>
</head>

<body>
  <main>
    <h1>0</h1>
    <button>–</button>
    <button>+</button>
  </main>
</body>
</html>
```

Then instead of throwing away the server-rendered markdown, we'll turn your DOM nodes into an interactive application out of the box!
