# Getting Started

- [Hello World](#hello-world)
- []
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

[Hyperx]: /docs/hyperx.md
[JSX]: /docs/jsx.md

To compose the user interface, the [h(tag, data, children)](/docs/api.md#h) utility function returns a tree of [virtual nodes](/docs/virtual-nodes.md).

```js
{
  tag: "h1",
  data: null,
  children: ["Hi"]
}
```

You can also describe views in [JSX] or [Hyperx] markup by setting up a [build pipeline](#build-pipeline).

```jsx
state => <h1>{state}</h1>
```

The [app(props)](/docs/api.md#app) function wraps everything together and renders the view on the DOM.

The app function renders the view in the [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body) by default.

To mount the application on a different element, use the [root](/docs/api.md#root) property.

```jsx
app({
  view: () => <h1>Hi.</h1>,
  root: document.getElementById("app")
})
```

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

HyperApp is available on the global scope when using a <samp>\<script\></samp> tag.

```js
const { h, app } = hyperapp
```

Or you can use ES5/ES6 by setting up a [build pipeline](#build-pipeline).

```jsx
import { h, app } from "hyperapp"
```

## Build Pipeline

A build pipeline can be as complex as you want it to be, but it typically consists of a package manager, a compiler and a bundler.

Using a build pipeline we can transform Hyperx/JSX markup into [h(tag, data, children)](/docs/api.md#h) function calls before runtime. This is much faster than sending a parser down the wire and compiling the view in the browser.

Hyperx/JSX in:

```jsx
<main id="app">Hi.</main>
```

Vanilla out:

```jsx
h("main", { id: "app" }, "Hi.")
```

See [Hyperx] or [JSX] for instructions on how to setup a build pipeline.
