# [hyperapp](https://hyperapp.glitch.me)
[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![npm](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

HyperApp is a JavaScript library for building frontend applications.

[Elm Architecture]: https://guide.elm-lang.org/architecture/
[Hyperx]: https://github.com/substack/hyperx
[JSX]: https://facebook.github.io/react/docs/introducing-jsx.html
[CDN]: https://unpkg.com/hyperapp

* **Declarative**: HyperApp's design is based on the [Elm Architecture]. Create scalable browser-based applications using a functional paradigm. The twist is you don't have to learn a new language.
* **Custom tags**: Build complex user interfaces from custom tags. Custom tags are stateless, framework agnostic and easy to debug.
* **Batteries-included**: Out of the box, HyperApp has Elm-like state management and a virtual DOM engine; it still weighs `1kb` and has no dependencies.

[Get started with HyperApp](/docs/getting-started.md)

## Hello World

[Try it online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010)

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.add}>+</button>
      <button onclick={actions.sub}>-</button>
    </main>
  ),
  actions: {
    add: state => state + 1,
    sub: state => state - 1
  }
})
```

## Issues

No software is free of bugs. If you're not sure if something is a bug or not, [file an issue](https://github.com/hyperapp/hyperapp/issues) anyway. Questions, feedback and feature requests are welcome too.

## Documentation

The documentation is located in the [/docs](/docs) directory.

## Community

* [Slack](https://hyperappjs.herokuapp.com)
* [/r/hyperapp](https://www.reddit.com/r/hyperapp)
* [Twitter](https://twitter.com/hyperappjs)

## License

HyperApp is MIT licensed. See [LICENSE](LICENSE.md).
