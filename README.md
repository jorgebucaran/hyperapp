# Hyperapp [![npm](https://img.shields.io/npm/v/hyperapp.svg?label=&color=1661EE)](https://github.com/jorgebucaran/hyperapp/releases/latest) 

> The 1 kB framework for building hypertext applications.

- **Do more with less**—We have minimized the concepts you need to learn to get stuff done. Views, actions, effects, and subscriptions are all pretty easy to get to grips with and work together seamlessly.
- **Write what, not how**—With a declarative syntax that's easy to read and fun to write, Hyperapp is the finest way to create purely functional, feature-rich, browser-based apps in JavaScript.
- **Smaller than a favicon**—Hyperapp is an ultra-lightweight Virtual DOM, highly-optimized diff algorithm, and state management library obsessed with minimalism.

Here's the first example to get you started: a mini todo app. You can [try it online here](https://codesandbox.io/s/hyperapp-playground-fwjlo).

<!-- prettier-ignore -->
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { h, text, app } from "https://unpkg.com/hyperapp"

      const Add = (state) => ({
        ...state,
        todos: state.todos.concat(state.value),
      })

      const FieldChanged = (state, event) => ({
        ...state,
        value: event.target.value,
      })

      app({
        init: { todos: [], value: "" },
        view: ({ todos, value }) =>
          h("main", {}, [
            h("h1", {}, text("My Todos")),
            h("input", { type: "text", oninput: FieldChanged, value }),
            h("button", { onclick: Add }, text("Add Todo")),
            h("ul", {},
              todos.map((todo) => h("li", {}, text(todo)))
            ),
          ]),
        node: document.getElementById("app"),
      })
    </script>
  </head>
  <body>
    <main id="app"></main>
  </body>
</html>
```

The app starts off with `init` where we set the initial state. The `view` returns a plain object representation of how we want the DOM to look (the virtual DOM) and Hyperapp takes care of modifying the real DOM to match this specification whenever the state changes. That's the gist of it.

To learn more about Hyperapp, [work through the tutorial](docs/tutorial.md), or visit the [API reference](docs/reference.md).

## Installation

Install Hyperapp with npm or Yarn:

```console
npm i hyperapp
```

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org) import it in your application and get right down to business.

```js
import { h, text, app } from "hyperapp"
```

Don't want to set up a build step? Import Hyperapp in a `<script>` tag as a module. Don't worry; modules are supported in all evergreen, self-updating desktop, and mobile browsers.

```html
<script type="module">
  import { h, text, app } from "https://unpkg.com/hyperapp"
</script>
```

## Examples

- [7GUI]() - A GUI Programming Benchmark
  - [Counter]()
  - [Temperature converter]()
  - [Flight booker]()
  - [Timer]()
  - [CRUD]()
  - [Circle drawer]()
  - [Spreadsheet]()
- [TodoMVC]() - Helping your select an MV\* framework
- [HNPWA]() - Hacker News reader as a progressive web application
- [RealWorld]() - Fullstack Medium-like clone

## Help, I'm stuck!

We love to talk JavaScript and Hyperapp. If you've hit a stumbling block, hop on the [Hyperapp Slack](https://hyperappjs.herokuapp.com) to get help, and if you don't receive an answer, or if you remain stuck, please file an issue, and we'll figure it out together.

Is anything wrong, unclear, missing? Help us [improve this page](https://github.com/jorgebucaran/hyperapp/fork).

## Stay in the loop

- [Twitter](https://twitter.com/hyperappjs)
- [Awesome](https://github.com/jorgebucaran/hyperawesome)
- [/r/hyperapp](https://www.reddit.com/r/hyperapp)

## License

[MIT](LICENSE.md)
