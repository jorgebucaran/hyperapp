# Hyperx

[Hyperx](https://github.com/substack/hyperx) is a standards-compliant ES6 tagged [template string function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) factory. It is a pure JavaScript alternative to [JSX](/docs/jsx.md).

Hyperx is used like this:

```js
const hyperx = require("hyperx")
const html = hyperx(h)

const main = html`
  <div>
    <h1>Hello.</h1>
    <button onclick=${() => alert("Hi")}>Click</button>
  </div>`
```

## Setup

We'll use [hyperxify](https://github.com/substack/hyperxify) to transform Hyperx into native HyperApp [h](/docs/h.md#h) function calls and a bundler to create a single bundle.js file we can deliver to the browser.

There are caveats, however, the ES6 module syntax is incompatible with hyperxify, so we must use the Node.js require function.

In a new directory, create an <samp>index.html</samp> file:

```html
<!doctype html>
<html>

<body>
  <script src="bundle.js"></script>
</body>

</html>
```

And <samp>index.js</samp> file:

```js
const { h, app } = require("hyperapp")
const hyperx = require("hyperx")
const html = hyperx(h)

app({
  state: "Hi.",
  view: state => html`<h1>${state}</h1>`
})
```

Install dependencies:
<pre>
npm i -S <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

### [Browserify](https://gist.github.com/jbucaran/48c1edb4fb0ea1aa5415b6686cc7fb45)

Install development dependencies:
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/browserify">browserify</a> \
  <a href="https://www.npmjs.com/package/hyperx">hyperx</a> \
  <a href="https://www.npmjs.com/package/hyperxify">hyperxify</a> \
  <a href="https://www.npmjs.com/package/babelify">babelify</a> \
  <a href="https://www.npmjs.com/package/uglifyify">uglifyify</a> \
  <a href="https://www.npmjs.com/package/bundle-collapser">bundle-collapser</a>
  <a href="https://www.npmjs.com/package/uglify-js">uglify-js</a>
</pre>

Create a <samp>.babelrc</samp> file:

```
{
  "presets": ["es2015"]
}
```

Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/browserify \
  -t hyperxify \
  -t babelify \
  -g uglifyify \
  -p bundle-collapser/plugin index.js | uglifyjs > bundle.js
</pre>

### [Webpack](https://gist.github.com/jbucaran/c6a6bdb5383a985cec6b0ae4ebe5a4b1)

Install development dependencies:

<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/hyperx">hyperx</a> \
  <a href="https://www.npmjs.com/package/hyperxify">hyperxify</a> \
  <a href="https://www.npmjs.com/package/webpack">webpack</a> \
  <a href="https://www.npmjs.com/package/transform-loader">transform-loader</a> \
  <a href="https://www.npmjs.com/package/babel-core">babel-core</a> \
  <a href="https://www.npmjs.com/package/babel-loader">babel-loader</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a>
</pre>

Create a <samp>.babelrc</samp> file:
```js
{
  "presets": ["es2015"]
}
```

Create a <samp>webpack.config.js</samp> file:

```jsx
module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader!transform-loader?hyperxify"
      }
    ]
  }
}
```

Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/webpack -p
</pre>

### [Rollup](https://gist.github.com/jbucaran/fac2c3de24e5171596fb189f9c1feb8e)

Install development dependencies:

<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/babel-preset-es2015-rollup">babel-preset-es2015-rollup</a> \
  <a href="https://www.npmjs.com/package/hyperx">hyperx</a> \
  <a href="https://www.npmjs.com/package/hyperxify">hyperxify</a> \
  <a href="https://www.npmjs.com/package/rollup">rollup</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-browserify-transform">rollup-plugin-browserify-transform</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-buble">rollup-plugin-buble</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-commonjs">rollup-plugin-commonjs</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-node-resolve">rollup-plugin-node-resolve</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-uglify">rollup-plugin-uglify</a>
</pre>


Create a <samp>rollup.config.js</samp> file:

```jsx
import buble from "rollup-plugin-buble"
import resolve from "rollup-plugin-node-resolve"
import uglify from "rollup-plugin-uglify"
import browserify from "rollup-plugin-browserify-transform"
import hyperxify from "hyperxify"
import cjs from "rollup-plugin-commonjs"

export default {
  moduleName: "window",
  plugins: [
    browserify(hyperxify),
    buble(),
    cjs(),
    resolve({
      module: false
    }),
    uglify()
  ]
}
```

Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/rollup -cf iife -i index.js -o bundle.js
</pre>
