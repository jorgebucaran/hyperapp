# hyperx

[hyperx](https://github.com/substack/hyperx) is a standards-compliant ES6 tagged [template string function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) factory. It is an alternative to [JSX](/docs/jsx.md).

```js
const hyperx = require("hyperx")
const html = hyperx(h)

const main = html`
  <div>
    <h1>Hello.</h1>
    <button onclick=${() => alert("What's up?")}>Click Me</button>
  </div>`
```

## Setup

We can use [hyperxify](https://github.com/substack/hyperxify) to transform hyperx into [`h`](/docs/h.md#h) function calls and a bundler to create a single file we can deliver to the browser.

The ES6 import syntax is incompatible with hyperxify, so we'll use the Node.js require function.

In a new directory, create an `index.html` file.

```html
<!doctype html>
<html>

<body>
  <script src="bundle.js"></script>
</body>

</html>
```

And an `index.js` file.

```js
const { h, app } = require("hyperapp")
const hyperx = require("hyperx")
const html = hyperx(h)

app({
  state: {
    message: "Hi."
  },
  view: state => html`<h1>${state.message}</h1>`
})
```

Install dependencies.
<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

## [Browserify](https://gist.github.com/jbucaran/48c1edb4fb0ea1aa5415b6686cc7fb45 "Get this gist")

Install development dependencies.
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/browserify">browserify</a> \
  <a href="https://www.npmjs.com/package/hyperx">hyperx</a> \
  <a href="https://www.npmjs.com/package/hyperxify">hyperxify</a> \
  <a href="https://www.npmjs.com/package/babelify">babelify</a> \
  <a href="https://www.npmjs.com/package/uglifyify">uglifyify</a> \
  <a href="https://www.npmjs.com/package/bundle-collapser">bundle-collapser</a> \
  <a href="https://www.npmjs.com/package/uglify-js">uglify-js</a>
</pre>

Create a `.babelrc` file.

```
{
  "presets": ["es2015"]
}
```

Bundle the application.
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/browserify \
  -t hyperxify \
  -t babelify \
  -g uglifyify \
  -p bundle-collapser/plugin index.js | uglifyjs > bundle.js
</pre>

## [Webpack](https://gist.github.com/jbucaran/c6a6bdb5383a985cec6b0ae4ebe5a4b1 "Get this gist")

Install development dependencies.
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

Create a `.babelrc` file.
```js
{
  "presets": ["es2015"]
}
```

Create a `webpack.config.js` file:

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

Bundle the application.
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/webpack -p
</pre>

