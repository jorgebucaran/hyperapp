# Overview

Hyperapp was born out of the attempt to do more with less. We have aggressively minimized the concepts you need to understand while remaining on par with what other frameworks can do.

What makes Hyperapp unique among the alternatives like React, Preact, and Mithril, is its compact API, built-in state management, and the unrivaled, small bundle size.

## Benchmarks

- [DBMonster](https://codepen.io/hyperapp/pen/wrMvjz?editors=0010)
- [JS Web Frameworks Benchmark - Round 6](http://www.stefankrause.net/js-frameworks-benchmark6/webdriver-ts/table.html)

## Browser Support

Hyperapp supports all ES5-compliant browsers, including Internet Explorer 10 and above.

## ES6+

Hyperapp is written using [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html), but you don't have to use ES6 or need to include any dependencies to get started building applications.

In a traditional Node.js environment you can require Hyperapp as you would anything else.

```js
var { h, app } = require("hyperapp")
```

We are not opinionated about your tooling stack either; Hyperapp is compatible with all bundlers: [Rollup](https://github.com/rollup/rollup), [Webpack](https://github.com/webpack/webpack), [Browserify](https://github.com/browserify/browserify), etc., and works well with [Hyperx](/docs/hyperx.md) or [JSX](/docs/jsx.md).

```js
var { h, app } = hyperapp
var html = hyperx(h)

app({
  state: {
    title: "Hi."
  },
  view: state => html`<h1>${state.title}</h1>`
})
```

```bash
browserify index.js | uglifyjs > bundle.js
```
