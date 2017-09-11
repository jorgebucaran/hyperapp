# Getting Started

## Installation

Download the minified library from the [CDN](https://unpkg.com/hyperapp).

```html
<script src="https://unpkg.com/hyperapp"></script>
```

And import it.

```js
const { h, app } = hyperapp
```

Or install with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

Then with a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack), use as you would anything else.

```js
import { h, app } from "hyperapp"
```

See [JSX] or [hyperx] for setup instructions.

[hyperx]: /docs/hyperx.md
[JSX]: /docs/jsx.md

## Hello World

Let's begin with a simple program. Paste this code in a new HTML file and open it in your browser or [try it here](https://codepen.io/hyperapp/pen/PmjRov?editors=1010).

```html
<body>
<script src="https://unpkg.com/hyperapp"></script>
<script>

const { h, app } = hyperapp

app({
  state: {
    title: "hello!"
  },
  view: state => h("h1", {}, state.title)
})

</script>
</body>
```

You should see "hello!" is displayed on the page.

The [state](/docs/state.md) describes the application's data.

```js
state: {
  title: "hello!"
}
```

The [view](/docs/view.md) describes the user interface.

```js
state => h("h1", {}, state.title)
```

You can create a view using [JSX] or [hyperx] too.

```js
state => <h1>{state.title}</h1>
```

The app function wraps it all together and renders the view on the DOM.

```js
app({ ... })
```

To make it interactive add the following code below the view.

```js
actions: {
  reverse(state) {
    return {
      title: state.title.split("").reverse().join("")
    }
  }
}
```

[Actions](/docs/actions.md) allow you to update the state tree and trigger a re-render.

Modify the view function to take the action and call it when the heading is clicked.

```jsx
view: (state, { reverse }) =>
  <h1 onclick={reverse}>
    {state.title}
  </h1>
```

Well done! You can [try it online](https://codepen.io/hyperapp/pen/JyLNap) too.

---

Go back to the [documentation](/docs/README.md) and don't miss out the [tutorials](/docs/tutorials.md) section.

Happy coding!
