# Getting Started

- [Hello World](#hello-world)
- [Installation](#installation)
- [Usage](#usage)
- [Build Pipeline](#build-pipeline)

## Hello World

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

The user interface consists of a tree of [virtual nodes](/docs/core.md#virtual-nodes), which  we create using the [h(tag, data, children)](/docs/api.md#h) utility function.

```js
{
  tag: "h1",
  data: null,
  children: ["Hi"]
}
```

The [app(props)](/docs/api.md#app) function wraps everything together and renders the view on the DOM.

## Installation

You can download the minified library from a [CDN](https://unpkg.com/hyperapp).

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

[Babel]: https://github.com/babel/babel
[Buble]: https://gitlab.com/Rich-Harris/buble
[Browserify]: https://github.com/substack/node-browserify
[Webpack]: https://github.com/webpack/webpack
[Rollup]: https://github.com/rollup/rollup

A build pipeline can be as complex as you want it to be, but it typically consists of a package manager, a compiler and a bundler.

Using a build pipeline we can transform [Hyperx]/[JSX] into [h(tag, data, children)] function calls which are faster than sending a parser down the wire and compiling the view in the browser.

Hyperx/JSX in:

```jsx
<main id="app">Hi.</main>
```

Vanilla out:

```jsx
h("main", { id: "app" }, "Hi.")
```

See [Hyperx] or [JSX] for instructions on how to setup a build pipeline.

