# [hyperapp](https://hyperapp.glitch.me)
[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![npm](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

HyperApp is a JavaScript library for building frontend applications.

- **Minimal**: HyperApp was born out of the attempt to do [more with less](https://en.wikipedia.org/wiki/Worse_is_better). We have aggressively minimized the concepts you need to understand while remaining on par with what other frameworks can do.
- **Functional**: HyperApp's design is based on [The Elm Architecture](https://guide.elm-lang.org/architecture). Create scalable browser-based applications using a functional paradigm. The twist is you don't have to learn a new language.
- **Batteries-included**: Out of the box, HyperApp combines state management with a Virtual DOM engine that supports keyed updates & lifecycle events — all with no dependencies.

[Get started with HyperApp](/docs/getting-started.md)

## Hello World

[Try it Online](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010)

```jsx
app({
  state: {
    count: 0
  },
  view: (state, actions) =>
    <main>
      <h1>{state.count}</h1>
      <button onclick={actions.sub}>ー</button>
      <button onclick={actions.add}>＋</button>
    </main>,
  actions: {
    sub: state => ({ count: state.count - 1 }),
    add: state => ({ count: state.count + 1 })
  }
})
```

## Documentation

The documentation is in the [docs](/docs) directory.

## Community

- [Slack](https://hyperappjs.herokuapp.com)
- [/r/hyperapp](https://www.reddit.com/r/hyperapp)
- [CodePen](https://codepen.io/hyperapp)
- [Twitter](https://twitter.com/hyperappjs)

## License

HyperApp is MIT licensed. See [LICENSE](LICENSE.md).
