# JSX

[JSX](https://facebook.github.io/jsx/) is an XML-like syntax extension to ECMAScript. It allows you to mix HTML and JavaScript.

JSX is not part of the ECMAScript standard, but using the appropriate tooling we can compile JSX code into JavaScript browsers understand.

```jsx
<div>
  <h1>Hello.</h1>
  <button onclick={() => alert("Hi")}>Click</button>
</div>
```

For an in-depth introduction to JSX, see the official [documentation](https://facebook.github.io/react/docs/introducing-jsx.html).

## Setup

We can use [Babel](https://github.com/babel/babel) to transform JSX into [`h`](/docs/api.md#h) function calls and a bundler to create a single file we can deliver to the browser.

In a new directory, create an `index.html` file.

```html
<!doctype html>
<html>

<body>
<script src="bundle.js"></script>
</body>

</html>
```

And an `index.js` file:

```jsx
import { h, app } from "hyperapp"

app({
  state: {
    message: "Hi."
  },
  view: state => <h1>{state.message}</h1>
})
```

Install dependencies.
<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

## [Browserify](https://gist.github.com/jbucaran/21bbf0bbb0fe97345505664883100706 "Get this gist")

Install development dependencies.
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a> \
  <a href="https://www.npmjs.com/package/babelify">babelify</a> \
  <a href="https://www.npmjs.com/package/browserify">browserify</a> \
  <a href="https://www.npmjs.com/package/bundle-collapser">bundle-collapser</a> \
  <a href="https://www.npmjs.com/package/uglifyify">uglifyify</a> \
  <a href="https://www.npmjs.com/package/uglifyjs">uglifyjs</a>
</pre>

Create a `.babelrc` file:

```js
{
  "presets": ["es2015"],
    "plugins": [
      [
        "transform-react-jsx",
        {
          "pragma": "h"
        }
      ]
    ]
}
```

Bundle the application.
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/browserify \
  -t babelify \
  -g uglifyify \
  -p bundle-collapser/plugin index.js | uglifyjs > bundle.js
</pre>

## [Webpack](https://gist.github.com/jbucaran/6010a83891043a6e0c37a3cec684c08e "Get this gist")

Install development dependencies.
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/webpack">webpack</a> \
  <a href="https://www.npmjs.com/package/babel-core">babel-core</a> \
  <a href="https://www.npmjs.com/package/babel-loader">babel-loader</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a> \
  <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a>
</pre>

Create a `.babelrc` file.
```js
{
  "presets": ["es2015"],
    "plugins": [
      [
        "transform-react-jsx",
        {
          "pragma": "h"
        }
      ]
    ]
}
```

Create a `webpack.config.js` file:

```js
module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  }
}
```

Bundle the application.
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/webpack -p
</pre>

## [Rollup](https://gist.github.com/jbucaran/0c0da8f1256a0a66090151cfda777c2c "Get this gist")

Install development dependencies.
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/rollup">rollup</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-babel">rollup-plugin-babel</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-node-resolve">rollup-plugin-node-resolve</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-uglify">rollup-plugin-uglify</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015-rollup">babel-preset-es2015-rollup</a> \
  <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a>
</pre>


Create a `rollup.config.js` file.

```jsx
import babel from "rollup-plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import uglify from "rollup-plugin-uglify"

export default {
  plugins: [
    babel({
      babelrc: false,
      presets: ["es2015-rollup"],
      plugins: [
        ["transform-react-jsx", { pragma: "h" }]
      ]
    }),
    resolve({
      jsnext: true
    }),
    uglify()
  ]
}
```

Bundle the application.
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/rollup -cf iife -i index.js -o bundle.js
</pre>
