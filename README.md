# Hyperapp [![npm](https://img.shields.io/npm/v/hyperapp.svg?label=&color=0080FF)](https://github.com/jorgebucaran/hyperapp/releases/latest)

> The tiny framework for building web user interfaces.

- **Do more with less**—We have minimized the concepts you need to learn to be productive. Views, actions, effects, and subscriptions are all pretty easy to get to grips with and work together seamlessly.
- **Write what, not how**—With a declarative syntax that's easy to read and natural to write, Hyperapp is your tool of choice to develop purely functional, feature-rich, browser-based applications.
- **Hypercharged**—Hyperapp is a modern VDOM engine, state management solution, and application design pattern all-in-one. Once you learn to use it, there'll be no end to what you can do.

To learn more, visit <https://hyperapp.dev> for documentation, guides, and examples.

## Quickstart

Here's the first example to get you started: a counter that can go up or down. You can paste this code in a new HTML file or [try it here](https://gitcdn.xyz/cdn/jorgebucaran/8dc33b7947f3193eb2ea3d5700e27036/raw/c572e3eaf6c6ac0d2d2b7e0edb982be4521eb341/index.html).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { h, app } from "https://unpkg.com/hyperapp@beta"

      app({
        init: () => 0,
        view: state =>
          h("div", {}, [
            h("h1", {}, state),
            h("button", { onClick: state => state - 1 }, "-"),
            h("button", { onClick: state => state + 1 }, "+")
          ]),
        node: document.getElementById("app")
      })
    </script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

The app starts off by calling `init` to initialize the state. Our code doesn't explicitly maintain any state. Instead, we define actions to transform it and a view to visualize it. The view returns a plain object representation of the DOM known as the virtual DOM, and Hyperapp updates the real DOM to match it whenever the state changes.

Now it's your turn! Experiment with the code a bit. Spend some time thinking about how the view reacts to changes in the state. Can you add a button that resets the counter back to zero? And for extra points, how about multiple counters?

## Installation

Install the latest version of Hyperapp with a package manager. We recommend using npm or Yarn to manage your front-end dependencies and keep them up-to-date.

```console
npm i hyperapp@beta
```

Then with a module bundler like [Parcel](https://parceljs.org) or [Webpack](https://webpack.js.org) import Hyperapp in your application and get right down to business.

```js
import { h, app } from "hyperapp"
```

Don't want to set up a build step? Import Hyperapp in a `<script>` tag as a module. Don't worry; modules are supported in all evergreen, self-updating desktop, and mobile browsers.

```html
<script type="module">
  import { h, app } from "https://unpkg.com/hyperapp"
</script>
```

Want to get a sense of what Hyperapp is like without installing anything? Try it in [this code playground](https://codesandbox.io/s/hyperapp-playground-fwjlo).

## Where do I go next?

The docs are loaded with everything you need to start building applications with Hyperapp. A high-level overview of how they're organized will help you find what you're looking for quickly:

- [Tutorial](doc/tutorial.md)
- [How-to guides](doc/howtos.md)
- [Examples](doc/examples)
- [API](doc/ref.md)

## Stay in the loop

- [Twitter](https://twitter.com/hyperappjs)
- [Awesome](https://github.com/jorgebucaran/awesome-hyperapp)
- [/r/hyperapp](https://www.reddit.com/r/hyperapp)

## Help, I'm stuck!

We love to talk JavaScript and Hyperapp. If you've hit a stumbling block, hop on the [Hyperapp Slack](https://hyperappjs.herokuapp.com) or drop by the [Spectrum chat](https://spectrum.chat/hyperapp) to get support, and if you don't receive an answer, or if you remain stuck, please file an issue, and we'll try to help you out.

Is anything wrong, unclear, missing? Help us [improve this page](https://github.com/jorgebucaran/hyperapp/fork).

## License

[MIT](LICENSE.md)
