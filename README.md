# Hyperapp

> The tiny framework for building hypertext applications.

- **Do more with less**—We have minimized the concepts you need to learn to get stuff done. Views, actions, effects, and subscriptions are all pretty easy to get to grips with and work together seamlessly.
- **Write what, not how**—With a declarative API that's easy to read and fun to write, Hyperapp is the best way to build purely functional, feature-rich, browser-based apps in JavaScript.
- **Smaller than a favicon**—1 kB, give or take. Hyperapp is an ultra-lightweight Virtual DOM, highly-optimized diff algorithm, and state management library obsessed with minimalism.

Here's the first example to get you started—look ma' no bundlers! [Try it in your browser](https://codepen.io/jorgebucaran/pen/zNxZLP?editors=1000).

<!-- prettier-ignore -->
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { h, text, app } from "https://unpkg.com/hyperapp"

      const AddTodo = (state) => ({
        ...state,
        value: "",
        todos: state.todos.concat(state.value),
      })

      const NewValue = (state, event) => ({
        ...state,
        value: event.target.value,
      })

      app({
        init: { todos: [], value: "" },
        view: ({ todos, value }) =>
          h("main", {}, [
            h("h1", {}, text("To do list")),
            h("input", { type: "text", oninput: NewValue, value }),
            h("ul", {},
              todos.map((todo) => h("li", {}, text(todo)))
            ),
            h("button", { onclick: AddTodo }, text("New!")),
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

Now that you have poked around the code a bit, you may have some questions. What is `init` and `view`, and how do they fit together? The app starts off with `init`, where we set the initial state. The `view` returns a plain object that represents how we want the DOM to look (the virtual DOM) and Hyperapp takes care of modifying the actual DOM to match this specification whenever the state changes. That's really all there is to it.

Ready to dive in? Learn the basics in the [tutorial](docs/tutorial.md) or visit the [API reference](docs/reference.md) for more documentation. If you prefer to learn by studying real-world examples, you can browse our [awesome list of resources](https://github.com/jorgebucaran/hyperawesome) too.

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

## Packages

Official packages provide access to [The Web Platform](https://platform.html5.org), and ensure that the APIs are exposed in a way that makes sense for Hyperapp, and the underlying code is stable. We already cover a decent amount of features, but you can always [create your own effects and subscriptions](docs/reference.md) if something is not available yet.

| Package                                        | Status                                                                                                                                              | About                                                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`@hyperapp/dom`](/packages/dom)               | [![npm](https://img.shields.io/badge/-planned-6a737d?style=for-the-badge&label=)](https://www.npmjs.com/package/@hyperapp/dom)                      | Manipulate the DOM, focus, blur, and measure elements.         |
| [`@hyperapp/svg`](/packages/svg)               | [![npm](https://img.shields.io/npm/v/@hyperapp/svg.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/svg)       | Draw SVG with plain functions.                                 |
| [`@hyperapp/html`](/packages/html)             | [![npm](https://img.shields.io/npm/v/@hyperapp/html.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/html)     | Write HTML with plain functions.                               |
| [`@hyperapp/time`](/packages/time)             | [![npm](https://img.shields.io/npm/v/@hyperapp/time.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/time)     | Subscribe to intervals, get the time.                          |
| [`@hyperapp/http`](/packages/http)             | [![npm](https://img.shields.io/npm/v/@hyperapp/http.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/http)     | Talk to servers, make HTTP requests.                           |
| [`@hyperapp/events`](/packages/events)         | [![npm](https://img.shields.io/npm/v/@hyperapp/events.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/events) | Subscribe animation frames, keyboard, mouse, window, and more. |
| [`@hyperapp/random`](/packages/random)         | [![npm](https://img.shields.io/badge/-planned-6a737d?style=for-the-badge&label=)](https://www.npmjs.com/package/@hyperapp/random)                   | Declarative random numbers and values.                         |
| [`@hyperapp/navigation`](/packages/navigation) | [![npm](https://img.shields.io/badge/-planned-6a737d?style=for-the-badge&label=)](https://www.npmjs.com/package/@hyperapp/navigation)               | Subscribe and manage the browser URL history.                  |

## Help, I'm stuck!

Don't panic! If you've hit a stumbling block, hop on the [Hyperapp Slack](https://join.slack.com/t/hyperapp/shared_invite/zt-frxjw3hc-TB4MgH4t74iPrY05KF9Jcg) to get help, and if you don't receive an answer, or if you remain stuck, [please file an issue](https://github.com/jorgebucaran/hyperapp/issues/new), and we'll figure it out together.

## Contributing

Hyperapp is free and open source software. If you love Hyperapp, becoming a contributor or [sponsoring](https://github.com/sponsors/jorgebucaran) is the best way to give back. Thank you to everyone who already contributed to Hyperapp!

[![](https://opencollective.com/hyperapp/contributors.svg?width=1024&button=false)](https://github.com/jorgebucaran/hyperapp/graphs/contributors)

## License

[MIT](LICENSE.md)
