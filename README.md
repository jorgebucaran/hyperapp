# [Hyperapp](https://codepen.io/hyperapp)

[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp) [![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp) [![npm](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp) [![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

Hyperapp is a JavaScript library for building frontend applications.

* **Minimal**: Hyperapp was born out of the attempt to do more with less. We have aggressively minimized the concepts you need to understand while remaining on par with what other frameworks can do.
* **Functional**: Hyperapp's design is inspired by [The Elm Architecture](https://guide.elm-lang.org/architecture). Create scalable browser-based applications using a functional paradigm. The twist is you don't have to learn a new language.
* **Batteries-included**: Out of the box, Hyperapp combines state management with a VDOM engine that supports keyed updates & lifecycle events — all with no dependencies.

[Read the Docs](/docs/README.md#documentation)

## Installation

```
yarn add hyperapp
or 
npm install --save hyperapp
```
## Build process
Use parcel to handle the build process - (Comes with hot-reloading out of the box). Enables you to have minimal configuration

```c
yarn add parcel-bundler --dev
yarn add babel-preset-env --dev // work with es6 features
yarn add babel-plugin-transform-react-jsx --dev // transpiles jsx
```
## Config file
A simple .babelrc to let parcel pass the config to babel
```json
{
  "presets": ["env"],
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
### Package.json
```
{
  "scripts": {
      "dev": "parcel src/index.html",
      "build": "parcel build src/index.html"
    }
}
```
## Hello World

[Try it Online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010)

```jsx
import { h, app } from "hyperapp"

const state = {
  count: 0
}

const actions = {
  down: () => state => ({ count: state.count - 1 }),
  up: () => state => ({ count: state.count + 1 })
}

const view = (state, actions) => (
  <main>
    <h1>{state.count}</h1>
    <button onclick={actions.down}>-</button>
    <button onclick={actions.up}>+</button>
  </main>
)

export const main = app(state, actions, view, document.body)
```

## Community

* [Slack](https://hyperappjs.herokuapp.com)
* [/r/Hyperapp](https://www.reddit.com/r/hyperapp)
* [Twitter](https://twitter.com/hyperappjs)

## License

Hyperapp is MIT licensed. See [LICENSE](LICENSE.md).
