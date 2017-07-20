# Getting Started

## Hello World

Let's begin with the simplest of all programs. Paste the following code in a new HTML file and open it in your browser. Or [try it online](https://codepen.io/hyperapp/pen/PmjRov?editors=1010).

```html
<body>
<script src="https://unpkg.com/hyperapp"></script>
<script>

const { h, app } = hyperapp

app({
  state: "Hi.",
  view: state => h("h1", {}, state)
})

</script>
</body>
```

You should see that "Hi" is displayed on the page.

The state describes the application's data.

```js
state: "Hi."
```

The view describes the user interface.

```js
state => h("h1", {}, state) // <h1>Hi.</h1>
```

The [h](/docs/api.md#h) function creates the [virtual nodes](/docs/virtual-nodes.md) that made up the view. You can also use [JSX] or [Hyperx] and compile them to h calls in a [build pipeline](#build-pipeline).

```jsx
state => <h1>{state}</h1>
```

The [app](/docs/api.md#app) function wraps everything up and renders the view on the DOM.

And... we're done. Check out the [Tutorials](/docs/tutorials.md) section for more code walkthroughs or read the [Implementation Notes](/docs/implementation-nodes.md) to see under the hood.

## Installation

You can download the minified library from a [CDN](https://unpkg.com/hyperapp).

```html
<script src="https://unpkg.com/hyperapp"></script>
```

Then access the exported global.

```js
const { h, app } = hyperapp
```

Or with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

Then setup a [build pipeline](#build-pipeline) and import it.

```jsx
import { h, app } from "hyperapp"
```

## Build Pipeline

A build pipeline typically consists of a package manager, a compiler and a bundler.

Using a build pipeline we can transform JSX / Hyperx markup into [h](/docs/api.md#h) calls before runtime. This is much faster than sending a parser down the wire and compiling the view in the browser.

JSX / Hyperx in:

```jsx
<main id="app">Hi.</main>
```

Vanilla out:

```jsx
h("main", { id: "app" }, "Hi.")
```

See [JSX] or [Hyperx] for setup instructions.

[Hyperx]: /docs/hyperx.md
[JSX]: /docs/jsx.md
