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

[Check out more examples](https://codepen.io/collection/nLLvrz?grid_type=grid)

The app starts by setting the initial state and rendering the view on the page. User input flows into actions, whose function is to update the state, causing Hyperapp to re-render the view.

When describing how a page looks in Hyperapp, we don't write markup. Instead, we use `h()` and `text()` to create a lightweight representation of the DOM (or virtual DOM for short), and Hyperapp takes care of updating the real DOM efficiently.

## Installation

```console
npm install hyperapp
```

## Documentation

Ready to dive in? Learn the basics in the [Tutorial](docs/tutorial.md), check out the [Examples](https://codepen.io/collection/nLLvrz?grid_type=grid), or visit the [Reference](docs/reference.md) for more detail.

To access [Web Platform APIs](https://platform.html5.org) (like `fetch` or `addEventListener`) in a way that makes sense for Hyperapp, learn [how to create your own effects and subscriptions](/docs/architecture/subscriptions.md). For everything else, from third-party packages to real-world examples, browse the [Hyperawesome](https://github.com/jorgebucaran/hyperawesome) collection.

## Help, I'm stuck!

If you've hit a stumbling block, hop on our [Discord](https://discord.gg/eFvZXzXF9U) server to get help, and if you remain stuck, [please file an issue](https://github.com/jorgebucaran/hyperapp/issues/new), and we'll help you figure it out.

## Contributing

Hyperapp is free and open-source software. If you love Hyperapp, becoming a contributor or [sponsoring](https://github.com/sponsors/jorgebucaran) is the best way to give back. Thank you to everyone who already contributed to Hyperapp!

[![](https://opencollective.com/hyperapp/contributors.svg?width=1024&button=false)](https://github.com/jorgebucaran/hyperapp/graphs/contributors)

## License

[MIT](LICENSE.md)
