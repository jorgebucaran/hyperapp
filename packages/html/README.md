# @hyperapp/html

> Write HTML with plain functions.

Hyperapp's built-in `h()` function is intentionally primitive to give you the freedom to write views any way you like it. If you prefer a functional approach over templating solutions like JSX or template literals, here is a collection of functions—one for [each HTML tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)—to make your views faster to write and easier to read.

Here's the first example to get you started. [Try it in your browser](https://codepen.io/jorgebucaran/pen/MrBgMy?editors=1000).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { app } from "https://unpkg.com/hyperapp"
      import {
        main,
        h1,
        button,
        text,
      } from "https://unpkg.com/@hyperapp/html?module"

      const Subtract = (state) => ({ ...state, count: state.count - 1 })
      const Add = (state) => ({ ...state, count: state.count + 1 })

      app({
        init: (count = 0) => ({ count }),
        view: (state) =>
          main([
            h1(text(state.count)),
            button({ onclick: Subtract }, text("-")),
            button({ onclick: Add }, text("+")),
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

> Looking for [@hyperapp/svg](../svg) instead?

## Installation

```console
npm install @hyperapp/html
```

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org) import it in your application and get right down to business.

```js
import { a, form, input } from "@hyperapp/html"
```

Don't want to set up a build step? Import it in a `<script>` tag as a module.

```html
<script type="module">
  import { a, form, input } from "https://unpkg.com/@hyperapp/html?module"
</script>
```

## License

[MIT](../../LICENSE.md)
