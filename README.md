# [hyperapp](https://hyperapp.glitch.me)
[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![CDNJS](https://img.shields.io/cdnjs/v/hyperapp.svg?colorB=ff69b4)](https://cdnjs.com/libraries/hyperapp)
[![npm](https://img.shields.io/npm/v/hyperapp.svg?colorB=ff69b4)](https://www.npmjs.org/package/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

HyperApp is a JavaScript library for building frontend applications.

[Elm Architecture]: https://guide.elm-lang.org/architecture/
[Hyperx]: https://github.com/substack/hyperx
[JSX]: https://facebook.github.io/react/docs/introducing-jsx.html
[CDN]: https://unpkg.com/hyperapp

* **Declarative**: HyperApp's design is based on the [Elm Architecture]. Create scalable browser-based applications using a functional paradigm. The twist is you don't have to learn a new language.
* **Stateless components**: Build complex user interfaces from micro-components. Stateless components are framework agnostic, reusable and easier to debug.
* **Batteries-included**: Out of the box, HyperApp has Elm-like state management and a virtual DOM engine; it still weighs `1kb` and has no dependencies.

[Get started with HyperApp](https://github.com/hyperapp/hyperapp/wiki/Getting-Started).

## Hello World

[CodePen](http://codepen.io/jbucaran/pen/Qdwpxy?editors=0010) · [JSFiddle](https://jsfiddle.net/hyperapp/pwk0cp9u/)

```jsx
app({
  state: "Hello World",
  view: state => <h1>{state}</h1>
})
```

[See more examples](https://hyperapp.glitch.me).

## Issues

No software is free of bugs. If you're not sure if something is a bug or not, [file an issue](https://github.com/hyperapp/hyperapp/issues) anyway. Questions, feedback and feature requests are welcome too.

## Documentation

See the [Wiki](https://github.com/hyperapp/hyperapp/wiki).

## Community

* [Slack](https://hyperappjs.herokuapp.com)
* [/r/hyperapp](https://www.reddit.com/r/hyperapp)
* [Twitter](https://twitter.com/hyperappjs)

## License

HyperApp is MIT licensed. See [LICENSE](LICENSE).
