# <img height=24 src=https://cdn.rawgit.com/jorgebucaran/f53d2c00bafcf36e84ffd862f0dc2950/raw/882f20c970ff7d61aa04d44b92fc3530fa758bc0/Hyperapp.svg> Hyperapp

[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![npm](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

Hyperapp is a JavaScript micro-framework for building web applications.

## Getting Started

This is our first example to get started. Right off the bat, I'll show you the hard stuff. If you survive this you basically win.

```jsx
import { h, app } from "hyperapp"
import { delay } from "@hyperapp/time"

const changeName = (state, name) => ({ ...state, name })

app({
  init: [
    { name: "Hello" },
    delay([changeName, "World"], duration: 1000 })
  ],
  view: state => <h1>{state.name}</h1>,
  container: document.body
})
```

What's that `delay` magic? Glad you asked. Here's a way it can be implemented. Hyperapp ships with effects and subscriptions out of the box, so you don't have to create your own, but like they say: knowledge is power!

```js
// hyperapp/time.js
export const delay = (fx => ({ action, duration }) => [
  fx,
  { action, duration }
])((props, dispatch) =>
  setTimeout(() => dispatch(props.action), props.duration)
)
```

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/hyperapp>hyperapp</a>
</pre>

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org), use as you would anything else.

```js
import { h, app } from "hyperapp"
```

If you don't want to set up a build environment, you can download Hyperapp from a CDN like [unpkg.com](https://unpkg.com/hyperapp) and it will be globally available through the <samp>window.hyperapp</samp> object. We support all ES5-compliant browsers, including Internet Explorer 10 and above.

```html
<script src="https://unpkg.com/hyperapp"></script>
```

## Links

- [Slack](https://hyperappjs.herokuapp.com)
- [Twitter](https://twitter.com/hyperappJS)
- [Examples](https://codepen.io/search/pens/?q=hyperapp)
- [/r/hyperapp](https://www.reddit.com/r/hyperapp)

## License

[MIT](LICENSE.md).
