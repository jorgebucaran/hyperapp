# Hyperapp

> The tiny framework for building hypertext applications.

- **Do more with less**—We have minimized the concepts you need to learn to get stuff done. Views, actions, effects, and subscriptions are all pretty easy to get to grips with and work together seamlessly.
- **Write what, not how**—With a declarative API that's easy to read and fun to write, Hyperapp is the best way to build purely functional, feature-rich, browser-based apps using idiomatic JavaScript.
- **Smaller than a favicon**—1 kB, give or take. Hyperapp is an ultra-lightweight Virtual DOM, [highly-optimized diff algorithm](https://javascript.plainenglish.io/javascript-frameworks-performance-comparison-2020-cd881ac21fce), and state management library obsessed with minimalism.

Here's the first example to get you started. [Try it here](https://codepen.io/jorgebucaran/pen/zNxZLP?editors=1000)—no build step required!

<!-- prettier-ignore -->
```html
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

<main id="app"></main>
```

[Check out more examples](https://codepen.io/your-work/?search_term=hyperapp)

The app starts by setting the initial state and rendering the view on the page. User input flows into actions, whose function is to update the state, causing Hyperapp to re-render the view.

When describing how a page looks, we don't write markup. Instead, we use `h()` and `text()` to create a lightweight representation of the DOM (or virtual DOM for short), and Hyperapp takes care of updating the real DOM.

## Installation

```console
npm install hyperapp
```

## Documentation

Ready to dive in? Learn the basics in the [Tutorial](docs/tutorial.md), check out the [Examples](https://codepen.io/your-work/?search_term=hyperapp), or visit the [Reference](docs/reference.md) for more detail.

To access [Web Platform APIs](https://platform.html5.org) (like `fetch` or `addEventListener`) in a way that makes sense for Hyperapp, learn [how to create your own effects and subscriptions](/docs/architecture/subscriptions.md). For everything else, from third-party packages to real-world examples, browse the [Hyperawesome](https://github.com/jorgebucaran/hyperawesome) collection.

## Packages

Official packages provide access to [The Web Platform](https://platform.html5.org), and ensure that the APIs are exposed in a way that makes sense for Hyperapp, and the underlying code is stable. We already cover a decent amount of features, but you can always [create your own effects and subscriptions](docs/reference.md) if something is not available yet.

| Package                                        | Status                                                                                                                                              | About                                                   |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [`@hyperapp/dom`](/packages/dom)               | [![npm](https://img.shields.io/npm/v/@hyperapp/dom.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/dom)       | Inspect the DOM, focus and blur.                        |
| [`@hyperapp/svg`](/packages/svg)               | [![npm](https://img.shields.io/npm/v/@hyperapp/svg.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/svg)       | Draw SVG with plain functions.                          |
| [`@hyperapp/html`](/packages/html)             | [![npm](https://img.shields.io/npm/v/@hyperapp/html.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/html)     | Write HTML with plain functions.                        |
| [`@hyperapp/time`](/packages/time)             | [![npm](https://img.shields.io/npm/v/@hyperapp/time.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/time)     | Subscribe to intervals, get the time now.               |
| [`@hyperapp/http`](/packages/http)             | [![npm](https://img.shields.io/npm/v/@hyperapp/http.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/http)     | Talk to servers, make HTTP requests.                    |
| [`@hyperapp/events`](/packages/events)         | [![npm](https://img.shields.io/npm/v/@hyperapp/events.svg?style=for-the-badge&color=0366d6&label=)](https://www.npmjs.com/package/@hyperapp/events) | Subscribe to mouse, keyboard, window, and frame events. |
| [`@hyperapp/random`](/packages/random)         | [![npm](https://img.shields.io/badge/-planned-6a737d?style=for-the-badge&label=)](https://www.npmjs.com/package/@hyperapp/random)                   | Declarative random numbers and values.                  |
| [`@hyperapp/navigation`](/packages/navigation) | [![npm](https://img.shields.io/badge/-planned-6a737d?style=for-the-badge&label=)](https://www.npmjs.com/package/@hyperapp/navigation)               | Subscribe and manage the browser URL history.           |

## Help, I'm stuck!

If you've hit a stumbling block, hop on our [Discord](https://discord.gg/5CtfCYEq8V) server to get help, and if you remain stuck, [please file an issue](https://github.com/jorgebucaran/hyperapp/issues/new), and we'll help you figure it out.

## Contributing

Hyperapp is free and open-source software. If you love Hyperapp, becoming a contributor or [sponsoring](https://github.com/sponsors/jorgebucaran) is the best way to give back. Thank you to everyone who already contributed to Hyperapp!

[![](https://opencollective.com/hyperapp/contributors.svg?width=1024&button=false)](https://github.com/jorgebucaran/hyperapp/graphs/contributors)

## License

[MIT](LICENSE.md)
