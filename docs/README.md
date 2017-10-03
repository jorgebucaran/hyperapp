# Documentation

- [Tutorials](/docs/tutorials.md)
- [Contributing](/docs/contributing.md)
- Getting Started
  - [Installation](#installation)
  - [Hello World](#hello-world)
- Concepts
  - [Keys](/docs/keys.md)
  - [Lifecycle](/docs/lifecycle.md)
  - [Components](/docs/components.md)
  - [innerHTML](/docs/innerhtml.md)
  - [Hydration](/docs/hydration.md)

## Installation

Install with npm or Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

Then with a module bundler like [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack), use as you would anything else.

```jsx
import { h, app } from "hyperapp"
```

Otherwise, download the [latest release](https://github.com/hyperapp/hyperapp/releases/latest) or load directly from [unpkg](https://unpkg.com/hyperapp), [jsDelivr](https://cdn.jsdelivr.net/npm/hyperapp@latest/dist/hyperapp.js), or [CDNJS](https://cdnjs.com/libraries/hyperapp).

```html
<script src="https://unpkg.com/hyperapp"></script>
```

Then find it in `window.hyperapp`.

```jsx
const { h, app } = hyperapp
```

We support all ES5-compliant browsers, including Internet Explorer 10 and above.

## Hello World

Let's walk through a simple +/- counter.

Paste this code in a new HTML file and open it in your browser or [try it online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010).

```html
<body>
<script src="https://unpkg.com/hyperapp"></script>
<script>

const { h, app } = hyperapp

app({
  state: {
    count: 0
  },
  view: (state, actions) => (
    h("main", {}, [
      h("h1", {}, state.count),
      h("button", {
        onclick: actions.down,
        disabled: state.count <= 0
      }, "–"),
      h("button", {
        onclick: actions.up
      }, "+")
    ])
  ),
  actions: {
    down: state => ({ count: state.count - 1 }),
    up: state => ({ count: state.count + 1 })
  }
})

</script>
</body>
```

In this example we are using a `<script>` tag to download the minified library from a CDN. In a production environment you are likely to be using a module bundler to build your application instead.

Hyperapp applications consist of a single `app()` call. This function initializes and renders the application to the page. The `h()` function is used to create a virtual node tree. A virtual node is a JavaScript object that describes a DOM tree. Hyperapp consumes this object to update the DOM.

### State

Use the state to describe the data model in your application. In this example, the state consists of a single property: `count` which we've initialized to 0.

```jsx
state: {
  count: 0
}
```

The notion of representing the application state as a single source of truth is known as single state tree and the tree is populated using [actions](#actions).

### Actions

Use actions to manipulate the [state](#state). If your application consumes a [view](#view), changes in the state will trigger a re-render. Actions are called as a result of user events triggered from the view or from inside [hooks](#hooks).

```jsx
actions: {
  down: state => ({ count: state.count - 1 }),
  up: state => ({ count: state.count + 1 })
}
```

Returning a new state from an action updates the global state immediately and schedules a view re-render on the next [repaint](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). Actions never mutate the state directly.

### View

Use the view to describe a user interface as a function of the [state](#state).
Then bind user events and [actions](#actions) together to create interactive applications. The view function is called every time we need to re-render the application due to state changes.

You can describe your view more concisely using [@hyperapp/html](https://github.com/hyperapp/html). [Try it here](...).

```html
<body>
<script src="https://unpkg.com/hyperapp"></script>
<script src="https://unpkg.com/@hyperapp/html"></script>
<script>

const { h, app } = hyperapp
const { main, h1, button } = html

app({
  state: {
    count: 0
  },
  view: (state, actions) => (
    main([
      h1(state.count),
      button({
        onclick: actions.down,
        disabled: state.count <= 0
      }, "–"),
      button({
        onclick: actions.up
      }, "+")
    ])
  ),
  actions: {
    down: state => ({ count: state.count - 1 }),
    up: state => ({ count: state.count + 1 })
  }
})

</script>
</body>
```

[JSX](https://facebook.github.io/jsx), [Hyperx](https://github.com/choojs/hyperx) and [t7](https://github.com/trueadm/t7) are popular alternatives to the built-in `h()` function.

JSX is an XML-like syntax extension to ECMAScript. It allows you to mix HTML and JavaScript. JSX is not part of the ECMAScript standard, but using the right tooling we can compile JSX into JavaScript browsers understand.

```jsx
import { h, app } from "hyperapp"

app({
  state: {
    count: 0
  },
  view: (state, actions) =>
    <main>
      <h1>{state.count}</h1>
      <button onclick={actions.down} disabled={state.count <= 0}>–</button>
      <button onclick={actions.up}>+</button>
    </main>,
  actions: {
    down: state => ({ count: state.count - 1 }),
    up: state => ({ count: state.count + 1 })
  }
})
```

Check out [hyperapp/awesome](https://github.com/hyperapp/awesome-hyperapp#apps-and-boilerplates) for boilerplates to get started with a basic build setup.
