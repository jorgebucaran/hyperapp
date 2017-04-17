# Getting Started

The easiest way to get started with HyperApp is to grab the minified library from a CDN.

```html
<script src="https://unpkg.com/hyperapp"></script>
```

You can use a specific version too.

```html
<script src="https://unpkg.com/hyperapp@0.8.1"></script>
```

Or try it on [CodePen](http://codepen.io/jbucaran/pen/Qdwpxy?editors=0010).

## Hello World

Create an `index.html` file, paste the code below and open it in your browser.

[View Online](https://rawgit.com/jbucaran/469c2e2aed3b9222bf6d307920741008/raw/8bd3ce171772808d240870374f343d7c278f9287/index.html)

```html
<body>
  <script src="https://unpkg.com/hyperapp"></script>
  <script>

  const { h, app } = hyperapp

  app({
    state: "Hi",
    view: state => h("h1", null, state)
  })

  </script>
</body>
```

## How does it work?

The [_h_](/docs/h.md#h) function creates a virtual node tree which describes the HTML/DOM tree of the application.

The [_app_](/docs/app.md#h) function renders the view and mounts it on the DOM.

The virtual node tree of the previous example is equivalent to:

```js
{
  tag: "h1",
  data: null,
  children: ["Hi"]
}
```

HyperApp's virtual DOM engine consumes a tree of virtual nodes to produce a DOM tree.

## Hyperx/JSX

You may prefer [Hyperx](/docs/hyperx.md) or [JSX](/docs/jsx.md) to create views and compile them to _h_ function calls in a [Build Pipeline](#build-pipeline).

If you are already using Hyperx, you may skip the compilation step altogether at the expense of slightly worse performance.

For example, the previous example can be rewritten in Hyperx as follows.

[View Online](https://rawgit.com/jbucaran/5cfa8c98464fe0b5a48edbae6b332b27/raw/59d3bb8e23a6b7873e13d2b6ec9513fffde7af54/index.html)

```html
<body>
  <script src="https://unpkg.com/hyperapp"></script>
  <script src="https://wzrd.in/standalone/hyperx"></script>
  <script>

  const { h, app } = hyperapp
  const html = hyperx(h)

  app({
    state: "Hi",
    view: state => html`<h1>${state}</h1>`
  })

  </script>
</body>
```

This workflow is fine for simple demos, but not the best for production applications.

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

### Why?

To compile Hyperx or JSX into native HyperApp [_h_] function calls.

The generated code is smaller and faster than the alternative: sending a parser down the wire and compiling the view in the user's browser.

Hyperx/JSX in:

```jsx
<h1 id="test">Hi.</h1>
```

Vanilla out:
```jsx
h("h1", { id: "test" }, "Hi.")
```

In the next section, we'll learn how to compile [Hyperx](/docs/hyperx.md) or [JSX](/docs/jsx.md) with your application from scratch.
