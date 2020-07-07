# Hyperapp [![npm](https://img.shields.io/npm/v/hyperapp.svg?label=&color=1661EE)](https://github.com/jorgebucaran/hyperapp/releases/latest)

> The tiny framework for building hypertext applications.

- **Do more with less**—We have minimized the concepts you need to learn to get stuff done. Views, actions, effects, and subscriptions are all pretty easy to get to grips with and work together seamlessly.
- **Write what, not how**—With a declarative API that's easy to read and fun to write, Hyperapp is the best way to create purely functional, feature-rich, browser-based apps in JavaScript.
- **Smaller than a favicon**—1 kB, give or take. Hyperapp is an ultra-lightweight Virtual DOM, highly-optimized diff algorithm, and state management library obsessed with minimalism.

Here's the first example to get you started. You can try it live [here](https://codesandbox.io/s/hyperapp-playground-fwjlo).

<!-- prettier-ignore -->
```html
<html lang="en">
  <head>
    <script type="module">
      import { h, text, app } from "https://unpkg.com/hyperapp"

      const Add = (state) => ({
        ...state,
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
            h("input", { type: "text", oninput: NewValue, value }),
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

The app starts off with `init` where we set the initial state. The `view` returns a plain object representation of how we want the DOM to look (the virtual DOM) and Hyperapp takes care of modifying the real DOM to match this specification whenever the state changes. That's really all there is to it.

Ready to dive in? We recommend following the [tutorial](docs/tutorial.md) or reading through the [API reference](docs/reference.md).

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

These packages provide access to the [web platform](https://platform.html5.org) and aim to ensure that the APIs are exposed in a way that makes sense for Hyperapp, and the underlying code is stable. Browse more packages from the community [here](https://github.com/jorgebucaran/hyperawesome).

| Package                           | Version                                                                                                                         | About                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`@hyperapp/dom`](/pkg/dom)       | [![npm](https://img.shields.io/npm/v/@hyperapp/dom.svg?label=&color=1661ee)](https://www.npmjs.com/package/@hyperapp/dom)       | Manipulate the DOM, focus, blur, and measure elements                 |
| [`@hyperapp/html`](/pkg/html)     | [![npm](https://img.shields.io/npm/v/@hyperapp/html.svg?label=&color=1661ee)](https://www.npmjs.com/package/@hyperapp/html)     | Write HTML using functions                                       |
| [`@hyperapp/time`](/pkg/time)     | [![npm](https://img.shields.io/npm/v/@hyperapp/time.svg?label=&color=1661ee)](https://www.npmjs.com/package/@hyperapp/time)     | Subscribe to intervals, get the time                             |
| [`@hyperapp/http`](/pkg/http)     | [![npm](https://img.shields.io/npm/v/@hyperapp/http.svg?label=&color=1661ee)](https://www.npmjs.com/package/@hyperapp/http)     | Talk to servers, make HTTP requests                                               |
| [`@hyperapp/events`](/pkg/events) | [![npm](https://img.shields.io/npm/v/@hyperapp/events.svg?label=&color=1661ee)](https://www.npmjs.com/package/@hyperapp/events) | Subscribe to event listeners: animation, keyboard, mouse, window |

## Help, I'm stuck!

Don't panic! If you've hit a stumbling block, hop on the [Hyperapp Slack](https://join.slack.com/t/hyperapp/shared_invite/zt-frxjw3hc-TB4MgH4t74iPrY05KF9Jcg) to get help, and if you don't receive an answer, or if you remain stuck, [please file an issue](https://github.com/jorgebucaran/hyperapp/issues/new), and we'll figure it out together.

## Contributing

Hyperapp is free and open source software. If you love Hyperapp, becoming a contributor or [sponsoring](https://github.com/sponsors/jorgebucaran) is the best way to give back. Thank you to everyone who already contributed to Hyperapp!

[![](https://opencollective.com/hyperapp/contributors.svg?width=1024&button=false)](https://github.com/jorgebucaran/hyperapp/graphs/contributors)

## License

[MIT](LICENSE.md)
