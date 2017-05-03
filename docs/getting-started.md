# Getting Started

Let's begin with the simplest of all programs. Paste the following code in a new html file and open it in your browser. Or [try it online](https://codepen.io/hyperapp/pen/PmjRov?editors=1010).

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

[h()]: /docs/api.md#h
[Hyperx]: /docs/hyperx.md
[JSX]: /docs/jsx.md

The user interface consists of a tree of [virtual nodes](/docs/core.md#virtual-nodes), which  we create using the [h()](/docs/api.md#h) utility function.

```js
{
  tag: "h1",
  data: null,
  children: ["Hi"]
}
```

The [app()](/docs/api.md#app) function wraps everything together and renders the view on the DOM.

## Installation

You can download the minified library from a CDN.

```html
<script src="https://unpkg.com/hyperapp"></script>
```

[npm]: https://www.npmjs.com
[Yarn]: https://yarnpkg.com

Or use [npm]/[Yarn].

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

## Usage

When using a <samp>\<script\></samp> tag, HyperApp is available on the global scope.

```js
const { h, app } = hyperapp
```

If you setup a [build pipeline](#build-pipeline) with [npm]/[Yarn], you can use the ES6 [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) syntax.

```jsx
import { h, app } from "hyperapp"
```

Or Node.js require style.

```js
const { h, app } = require("hyperapp")
```

## Build Pipeline

Using a build pipeline we can compile [Hyperx]/[JSX] into [h()] function calls.

Hyperx/JSX in:

```jsx
<main id="app">Hi.</main>
```

Vanilla out:

```jsx
h("main", { id: "app" }, "Hi.")
```

The generated code is smaller and faster than sending the parser down the wire and compiling the view in the browser.

See [Hyperx] or [JSX] for instructions on how to setup a build pipeline.


A build pipeline consists of:

* A **package manager**, e.g. [npm] or [Yarn]. It makes it easy to share and reuse third-party packages.
* A **compiler** e.g. [Babel](http://babeljs.io) or [Bublé](https://buble.surge.sh/guide). It transforms modern JavaScript into code compatible with older browsers.
* A **bundler**, e.g. [Browserify](http://browserify.org), [Webpack](https://webpack.js.org) or [Rollup](http://rollupjs.org). It takes modules and their dependencies and generates a single bundle that can be delivered to the browser.

With a build pipeline we can compile [Hyperx](/docs/hyperx.md)/[JSX](/docs/jsx.md) into [h] function calls.

Hyperx/JSX in:

```jsx
<main id="app">Hi.</main>
```

Vanilla out:

```jsx
h("main", { id: "app" }, "Hi.")
```

The generated code is smaller and faster than sending the parser down the wire and compiling the view in the browser.
