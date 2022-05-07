# @hyperapp/svg

> Draw SVG with plain functions.

HTML's evil twin. Here's a collection of functions—one for [each SVG tag](https://developer.mozilla.org/en-US/docs/Web/SVG)—to help you get started with SVG in Hyperapp.

Want to draw some circles? [Try this example in your browser](https://codepen.io/jorgebucaran/pen/preYMW?editors=1000).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { app } from "https://unpkg.com/hyperapp"
      import { main } from "https://unpkg.com/@hyperapp/html?module"
      import { svg, use, circle } from "https://unpkg.com/@hyperapp/svg?module"

      app({
        init: {},
        view: () =>
          main([
            svg({ viewBox: "0 0 30 10" }, [
              circle({ id: "symbol", cx: 5, cy: 5, r: 4, stroke: "#0366d6" }),
              use({ href: "#symbol", x: 10, fill: "#0366d6" }),
              use({ href: "#symbol", x: 20, fill: "white" }),
            ]),
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

## Installation

```console
npm install @hyperapp/svg
```

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org) import it in your application and get right down to business.

```js
import { svg, use, circle } from "@hyperapp/svg"
```

Don't want to set up a build step? Import it in a `<script>` tag as a module.

```html
<script type="module">
  import { svg, use, circle } from "https://unpkg.com/@hyperapp/svg?module"
</script>
```

## License

[MIT](../../LICENSE.md)
