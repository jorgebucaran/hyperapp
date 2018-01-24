# Hello World

Let's walk through a small example. Paste the following code into a new HTML file and open it in your browser. Click on the + and - buttons to increment and decrement the counter.

[Live Example](https://codepen.io/hyperapp/pen/zNxZLP)

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

Now open the developer console and type:

```js
main.up(1000)
```

You should see the counter update accordingly.

The app returns the actions wired to the state so that changes trigger a re-render of the view. Exposing this object to the outside world is useful because it allows you to manipulate your application from another program or framework.

## State

The state is a plain JavaScript object that describes your entire program. The state is kept in a single immutable object. To change it we define [actions](#actions) and call them.

```js
const state = {
  count: 0
}
```

Like any JavaScript object, the state may consist of other objects, and it can be deeply nested. We refer to nested objects in the state as substate.

## Actions

Actions update the [state](#state) and re-render the [view](#view) automatically. Actions run as a result of user events triggered from the view, inside event listeners, etc.

```js
const actions = {
  down: value => state => ({ count: state.count - value }),
  up: value => state => ({ count: state.count + value })
}
```

Actions don't mutate the state directly but return a new fragment of the state. If you try to mutate the state inside an action and then return it, the view will not be re-rendered as you might expect. Immutable state updates allow cheap memoization of the view and components using only a strict `===` check.

Actions are not required to have a return value at all. You can use them to call other actions, for example after an asynchronous operation has ended, e.g., within a callback or when a promise is resolved. Actions that return `null`, `undefined` or a Promise object don't trigger a view re-render.

```js
const actions = {
  upLater: value => (state, actions) => {
    setTimeout(actions.up, 1000, value)
  },
  up: value => state => ({ count: state.count + value })
}
```

If an action returns a Promise, we'll pass it to the caller allowing you to create [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) actions.

```js
const actions = {
  upLater: () => async (state, actions) => {
    await new Promise(done => setTimeout(done, 1000))
    actions.up(10)
  },
  up: value => state => ({ count: state.count + value })
}
```

## View

Every time your application state changes, the view function is called so that you can specify how you want the DOM to look based on the new state. The view returns your specification in the form of a [virtual DOM](../concepts/vdom.md) and Hyperapp takes care of updating the actual DOM to match it.

```js
const view = (state, actions) =>
  h("div", {}, [
    h("h1", {}, state.count),
    h("button", { onclick: () => actions.down(1) }, "–"),
    h("button", { onclick: () => actions.up(1) }, "+")
  ])
```

The `h` function call creates virtual nodes, which are plain JavaScript objects that made up the virtual DOM tree. Unlike actual DOM elements, virtual nodes are cheap to create and work with.

### JSX

Another way to create virtual nodes is with [JSX](https://facebook.github.io/jsx). JSX is a JavaScript language extension that allows you to write HTML interspersed with JavaScript. JSX is neither a dependency or required to use Hyperapp, but we use it throughout the documentation and examples for familiarity.

```js
import { h } from "hyperapp"

const view = (state, actions) => (
  <main>
    <h1>{state.count}</h1>
    <button onclick={actions.down}>-</button>
    <button onclick={actions.up}>+</button>
  </main>
)
```

Browsers don't understand JSX, so we need to compile it down to `h` function calls using a JavaScript compiler like [Babel](https://github.com/babel/babel). How you setup this process can vary wildly, but it typically consists of a build pipeline with npm or Yarn, and a module bundler like Webpack, Rollup, or Browserify.

In most cases all you need is add this configuration to your [`.babelrc`](https://babeljs.io/docs/usage/babelrc/):

```json
{
  "plugins": [
    [
      "transform-react-jsx",
      {
        "pragma": "h"
      }
    ]
  ]
}
```

If you prefer not to use JSX or a build process see [@hyperapp/html](https://github.com/hyperapp/html), [hyperx](https://github.com/choojs/hyperx), and [t7](https://github.com/trueadm/t7).
