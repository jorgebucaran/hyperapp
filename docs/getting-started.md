# Getting Started

Paste the following code in a new html file and open it in your browser.
Or [try it online](https://codepen.io/hyperapp/pen/PmjRov?editors=1010).

```html
<body>
<script src="https://unpkg.com/hyperapp"></script>
<script>

const { h, app } = hyperapp

app({
  state: "Hi.",
  view: state => h("h1", null, state)
})

</script>
</body>
```

The state represents the application's data.

```js
state: "Hi."
```

The view describes the user interface.

```js
state => h("h1", null, state) // <h1>Hi.</h1>
```

The user interface consists of a tree of [virtual nodes](/docs/virtual-nodes.md), composed using the [h](/docs/api.md#h) function. [Hyperx](/docs/hyperx.md) or [JSX](/docs/jsx.md) are available as well.

```js
{
  tag: "h1",
  data: null,
  children: ["Hi"]
}
```

The [app](/docs/api.md#app) function puts everything together and renders the view on the DOM.

## Installing

You can grab the minified library from a CDN.

```html
<script src="https://unpkg.com/hyperapp"></script>
```

[npm]: https://www.npmjs.com
[Yarn]: https://yarnpkg.com

Or use [npm]/[Yarn] if you are setting up a [build pipeline](#build-pipeline).

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

## Importing

Node.js <samp>require</samp>:

```js
const { h, app } = require("hyperapp")
```

ES6 <samp>[import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)</samp>:

```jsx
import { h, app } from "hyperapp"
```

UMD:

```js
const { h, app } = hyperapp
```

## Build Pipeline

To create applications ready for production you will be using:

* A **package manager**, e.g. [npm] or [Yarn]. It makes it easy to share and reuse third-party packages.
* A **compiler** e.g. [Babel](http://babeljs.io) or [Bublé](https://buble.surge.sh/guide). It transforms modern JavaScript into code compatible with older browsers.
* A **bundler**, e.g. [Browserify](http://browserify.org), [Webpack](https://webpack.js.org) or [Rollup](http://rollupjs.org). It takes modules and their dependencies and generates a single bundle that can be delivered to the browser.

With a build pipeline we can also compile [Hyperx](/docs/hyperx.md) or [JSX](/docs/jsx.md) into h function calls.

Hyperx/JSX in:

```jsx
<main id="app">Hi.</main>
```

Vanilla out:

```jsx
h("main", { id: "app" }, "Hi.")
```

The generated code is smaller and faster than sending the parser down the wire and compiling the view in the browser.
