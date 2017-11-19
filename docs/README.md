# Documentation

- [Contributing](CONTRIBUTING.md)
- Quickstart
  - [Hello World](#hello-world)
  - [Installation](#installation)
- Concepts
  - [Components](components.md)
  - [Lifecycle](lifecycle.md)
  - [Keys](keys.md)
  - [Slices](slices.md)
  - [Sanitation](sanitation.md)
  - [Hydration](hydration.md)
- Tutorials
  - [TweetBox](tweetbox.md)
  - [Gif Search](gif-search.md)
  - [Countdown Timer](countdown-timer.md)

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
  view: state => actions => (
    h("main", {}, [
      h("h1", {}, state.count),
      h("button", {
        onclick() {
          actions.down(1)
        },
        disabled: state.count <= 0
      }, "–"),
      h("button", {
        onclick() {
          actions.up(1)
        },
      }, "+")
    ])
  ),
  actions: {
    down: n => state => ({ count: state.count - n }),
    up: n => state => ({ count: state.count + n })
  }
})

</script>
</body>
```

In this example we are using a `<script>` tag to download the minified library from a CDN. In a production environment you will probably be using a module bundler to build your application instead.

Hyperapp applications consist of a single `app()` call. This function initializes and renders the application to document.body.

You can select a different container too.

```js
app(
  props,
  document.getElementById("app")
)
```

### State

The state object describes the data model in your application. The state must always be an object. In this example it consists of a single property, `count`, which is initialized to 0.

```jsx
state: {
  count: 0
}
```

The notion of representing the application state as a single source of truth is known as single state tree and the tree is populated using [actions](#actions).

### Actions

Actions are used to manipulate the [state](#state). If your application consumes a [view](#view), changes in the state cause a re-render. Actions are called as a result of user events triggered from the view, inside event listeners, etc.

```jsx
actions: {
  down: n => state => ({ count: state.count - n }),
  up: n => state => ({ count: state.count + n })
}
```

Actions must never mutate the state directly. Returning a new state from an action updates the current state and schedules a re-render.

### View

The view describes your user interface as a function of the [state](#state).
Bind user events and [actions](#actions) together to create interactive applications. The view function is called every time we need to re-render the application due to state changes.

The `h()` function returns a [virtual node](vnodes.md), an object that describes a DOM tree. Hyperapp consumes this object to update the DOM.

Popular alternatives to the built-in `h()` function include [JSX](https://facebook.github.io/jsx/), [hyperx](https://github.com/choojs/hyperx), [t7](https://github.com/trueadm/t7) and [@hyperapp/html](https://github.com/hyperapp/html).

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
  view: state => actions => (
    main([
      h1(state.count),
      button({
        onclick() {
          actions.down(1)
        },
        disabled: state.count <= 0
      }, "–"),
      button({
        onclick() {
          actions.up(1)
        },
      }, "+")
    ])
  ),
  actions: {
    down: n => state => ({ count: state.count - n }),
    up: n => state => ({ count: state.count + n })
  }
})

</script>
</body>
```

Check out [hyperapp/awesome](https://github.com/hyperapp/awesome#apps-and-boilerplates) for templates and boilerplates to help you getting started.


## Installation

Install with npm or Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

Then with a module bundler like [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack), use as you would anything else.

```jsx
import { h, app } from "hyperapp"
```

Or download directly from [unpkg](https://unpkg.com/hyperapp), [jsDelivr](https://cdn.jsdelivr.net/npm/hyperapp@latest/dist/hyperapp.js), or [CDNJS](https://cdnjs.com/libraries/hyperapp).

```html
<script src="https://unpkg.com/hyperapp"></script>
```

Then find it in `window.hyperapp`.

```jsx
const { h, app } = hyperapp
```

We support all ES5-compliant browsers, including Internet Explorer 10 and above.
