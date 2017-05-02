# Getting Started

The easiest way to get started with hyperapp is to grab the minified library from a CDN.

```html
<script src="https://unpkg.com/hyperapp"></script>
```

You can use a specific version too.

```html
<script src="https://unpkg.com/hyperapp@0.9.0"></script>
```

Or try it on [CodePen](https://codepen.io/hyperapp/pen/Qdwpxy?editors=0010).

## Hello World

Create an html file, paste the code below and open it in your browser. Or download it [here](https://rawgit.com/jbucaran/469c2e2aed3b9222bf6d307920741008/raw/8bd3ce171772808d240870374f343d7c278f9287/index.html).

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

HyperApp is available on the global scope when using a CDN.

```js
const { h, app } = hyperapp
```

The state represents the application's data.

```js
state: "Hi."
```

And the view its user interface.

```js
view: state => h("h1", null, state)
```

The [h](/docs/api.md#h) function returns a [virtual node](/docs/virtual-nodes.md).

```js
{
  tag: "h1",
  data: null,
  children: ["Hi"]
}
```

The [app](/docs/api.md#app) function renders the view and mounts it on the DOM.

## Hyperx/JSX

You may prefer [Hyperx](/docs/hyperx.md)/[JSX](/docs/jsx.md) to describe your views and compile them to h function calls using a [build pipeline](#build-pipeline).

With Hyperx, you may skip the compilation step at the expense of slightly inferior performance.

Here is the previous example rewritten in Hyperx.

```html
<body>
<script src="https://unpkg.com/hyperapp"></script>
<script src="https://wzrd.in/standalone/hyperx"></script>
<script>

const { h, app } = hyperapp
const html = hyperx(h)

app({
  state: "Hi.",
  view: state => html`<h1>${state}</h1>`
})

</script>
</body>
```

This workflow is fine for simple demos, but not recommended for real world applications.

## Build Pipeline

To create applications ready for production you will be using:

[Browserify]: http://browserify.org/
[Rollup]: http://rollupjs.org/
[Webpack]: https://webpack.js.org/
[Babel]: http://babeljs.io/
[Bublé]: https://buble.surge.sh/guide/
[npm]: https://www.npmjs.com/
[Yarn]: https://yarnpkg.com

* A **package manager**, e.g. [npm] or [Yarn]. It makes it easy to share and reuse third-party packages.
* A **compiler** e.g. [Babel] or [Bublé]. It transforms modern JavaScript into code compatible with older browsers.
* A **bundler**, e.g. [Webpack], [Rollup] or [Browserify]. It takes modules and their dependencies and generates a single bundle that can be delivered to the browser.

With a build pipeline we are able to compile [Hyperx](/docs/hyperx.md)/[JSX](/docs/jsx.md) into native [h](/docs/api.md#h) function calls.

The generated code is smaller and faster than the alternative; which is to send the parser down the wire and compile the view in the browser.

Hyperx/JSX in:

```jsx
<main id="app">Hi.</main>
```

Vanilla out:
```jsx
h("main", { id: "app" }, "Hi.")
```

### Importing

Depending on your setup you can use Node.js <samp>require</samp> or ES6 modules <samp>[import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)</samp> syntax to load HyperApp.

ES6 modules:

```jsx
import { h, app } from "hyperapp"
```

CommonJS:

```js
const { h, app } = require("hyperapp")
```
