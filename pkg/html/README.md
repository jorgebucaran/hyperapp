# @hyperapp/html

> Write HTML with plain functions.

@hyperapp/html is a no-bells-or-whistles alternative to JSX and template literals for [Hyperapp](https://github.com/jorgebucaran/hyperapp).

Hyperapp's baked-in hyperscript function can go a long way, but sooner or later you'll find yourself implementing the same set of functions in all projects: `a`, `input`, `form`, etc., so we've done it for you.

Go ahead and [try it in your browser](https://hyperapp-html.glitch.me)—it just works!

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { h, text, app } from "https://unpkg.com/hyperapp"
      import { main, h1, button } from "https://unpkg.com/@hyperapp/html"

      const Subtract = (state) => ({ ...state, count: state.count - 1 })
      const Add = (state) => ({ ...state, count: state.count + 1 })

      app({
        init: (count = 0) => ({ count }),
        view: (state) =>
          main({}, [
            h1({}, text(state.count)),
            button({ onclick: Subtract }, text("-")),
            button({ onclick: Add }, text("+")),
          ]),
        node,
      })
    </script>
  </head>
  <body>
    <main id="app"></main>
  </body>
</html>
```

## Installation

```console
npm i @hyperapp/html
```

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org) import it in your application and get right down to business.

```js
import { a, form, input } from "@hyperapp/html"
```

Don't want to set up a build step? Import it in a `<script>` tag as a module.

```html
<script type="module">
  import { h, text, app } from "https://unpkg.com/hyperapp"
</script>
```

## License

[MIT](../../LICENSE.md)
