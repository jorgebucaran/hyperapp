## Hello World

Let's walk through a small example. Paste this code in a new HTML file and open it in your browser or [try it online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010).

```html
<body>
<script src="https://unpkg.com/hyperapp"></script>
<script>

const { h, app } = hyperapp

const state = {
  count: 0
}

const actions = {
  down: value => state => ({ count: state.count - value }),
  up: value => state => ({ count: state.count + value })
}

const view = (state, actions) =>
  h("div", {}, [
    h("h1", {}, state.count),
    h("button", { onclick: () => actions.down(1) }, "–"),
    h("button", { onclick: () => actions.up(1) }, "+")
  ])

window.main = app(state, actions, view, document.body)

</script>
</body>
```

Click on the + and - buttons to increment and decrement the counter. The current count should be displayed on the page inside a `<h1>` tag. Now open the developer console and type:

```js
main.up(1000)
```

You should see the counter update accordingly.

In this example we used a `<script>` tag to download the minified library from a CDN. In a production environment you will likely be using a module bundler to build your application instead.

Hyperapp applications consist of a single `app()` call.

```js
const main = app(state, actions, view, container)
```

This function initializes and renders the application to the given container and returns an object with the actions wired to the state-update—view-render mechanism.

### State

The state describes your application data model. The state must be an object. In this example it consists of a single property, `count`, initialized to 0.

```js
const state = {
  count: 0
}
```

The notion of representing the application state as a single source of truth is known as single state tree and the tree is populated using [actions](#actions).

### Actions

Actions are used to manipulate the [state](#state). If your application consumes a [view](#view), changes in the state will cause a re-render. Actions are called as a result of user events triggered from the view, inside event listeners, etc.

```js
const actions = {
  down: value => state => ({ count: state.count - value }),
  up: value => state => ({ count: state.count + value })
}
```

Returning a new state from an action updates the current state and schedules a re-render. An action must never mutate the state directly.

### View

The view describes your application user interface as a function of the state and actions. This function is called every time we need to re-render because the state has changed.

```js
const view = (state, actions) => h("h1", {}, "Hello World!")
```

The `h()` function returns a [virtual node](vnodes.md), a lightweight object that describes a DOM tree. Hyperapp consumes this object to update the DOM.

We use [JSX](https://facebook.github.io/jsx/) in examples throughout the documentation for familiarity, but you are not required to use it at all!

Alternatives include [hyperx](https://github.com/choojs/hyperx), [t7](https://github.com/trueadm/t7) and [@hyperapp/html](https://github.com/hyperapp/html).

```html
<body>
<script src="https://unpkg.com/hyperapp"></script>
<script src="https://unpkg.com/@hyperapp/html"></script>
<script>

const { h, app } = hyperapp
const { div, h1, button } = html

const state = {
  count: 0
}

const actions = {
  down: value => state => ({ count: state.count - value }),
  up: value => state => ({ count: state.count + value })
}

const view = (state, actions) =>
  div([
    h1(state.count),
    button({ onclick: () => actions.down(1) }, "–"),
    button({ onclick: () => actions.up(1) }, "+")
  ])

const main = app(state, actions, view, document.body)

</script>
</body>
```

Check out [hyperapp/awesome](https://github.com/hyperapp/awesome#apps-and-boilerplates) for templates to help you get started.
