# Hyperapp

[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![npm](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

Hyperapp is a JavaScript micro-framework for building web applications.

You want to create rich, interactive browser applications. You heard about declarative UI, immutable state, effects as data, or even functional reactive programming and thought you might try it out. Hyperapp combines all these concepts in a tiny package.

- **Minimal**—We have aggressively minimized the concepts you need to learn to be productive while remaining on par with what other frameworks can do.
- **Declarative**–Design your UI as a function of the state, and Hyperapp will efficiently update and render the DOM as your data changes. Declarative views makes your code predictable and easy to debug.
- **Standalone**—Do more with less. Hyperapp combines state management and a Virtual DOM engine that supports keyed updates & view memoization—all with no dependencies.

## Getting started

Our first example is a counter that can be incremented or decremented. This is far from a real world application, but we need to start somewhere. The example shows you how to initialize your application state, wire actions to DOM-triggered events, and render an HTML tree on the page. Go ahead and paste this code on a new HTML file or [try it online].

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script type="module">
      import { h, app } from "https://unpkg.com/hyperapp?module"

      app({
        init: 0,
        view: state =>
          h("div", {}, [
            h("h1", {}, state),
            h("button", { onclick: state => state - 1 }, "-"),
            h("button", { onclick: state => state + 1 }, "+")
          ]),
        container: document.body
      })
    </script>
  </head>
  <body>
    <!-- Your app will be mounted here. -->
  </body>
</html>
```

What's going on here? The `app` function creates a new application and mounts it on the supplied container. The container can be any element on the DOM. Hyperapp will try to reuse child nodes in it instead of throwing away your server-side rendered content. See [Recycling] to learn more about this feature.

Hyperapp calls your view function so that you can specify how the DOM should look based on the state. The view returns your specification in the form of a plain JavaScript object known as a virtual DOM and Hyperapp updates the actual DOM to match it. The result is an object similar to the one below. Think of it as a lightweight representation of the DOM.

```js
{
  name: "div",
  props: {},
  children: [
    {
      name: "h1",
      props: {},
      children: 0
    },
    {
      name: "button",
      props: { onclick: state => state - 1 },
      children: "-"
    },
    {
      name: "button",
      props: { onclick: state => state + 1 },
      children: "+"
    }
  ]
}
```

To create this object we use Hyperapp's `h` function. It takes three arguments: a string that specifies the type of element: `div`, `h1`, `button`, the element's properties (HTML/SVG attributes), and the element's child nodes.

```js
h("h1", { id: "title" }, "Hello") // Think: <h1 id="title">Hello</h1>
```

Another way of creating virtual DOM nodes is using [JSX](https://reactjs.org/docs/introducing-jsx.html). JSX is a language syntax extension that lets you write HTML tags interspersed with JavaScript. Because browsers don't understand JSX, we need a compiler like [Babel] or [TypeScript] to translate it to `h` function calls. The end result is the same, but our code now looks as follows. Paste the code in a new JavaScript file, we'll need it afterwards.

```jsx
import { h, app } from "hyperapp"

app({
  init: 0,
  view: state => (
    <main>
      <h1>{state}</h1>
      <button onclick={state => state - 1}>-</button>
      <button onclick={state => state + 1}>+</button>
    </main>
  ),
  container: document.body
})
```

If you are using Babel, install the [JSX transform plugin](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx) and add the pragma option to your `.babelrc` file.

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "pragma": "h"
      }
    ]
  ]
}
```

If you see JSX used in this documentation, it's purely a stylistic choice. Compilation-free options include [@hyperapp/html], [htmlo], [hyperx], [htm], and [ijk]. Try them all to find out which one works best for you—it's up to you.

Now let's put it all together with a module bundler. We'll use [Parcel]. If you prefer [Webpack] or [Rollup] refer to their documentation for usage details. Open the HTML file you created for this example and modify it like so.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script defer src="index.js"></script>
  </head>
  <body>
    <!-- Your app will be mounted here. -->
  </body>
</html>
```

Save it and start the development server.

```console
$ parcel index.html
```

...and you should be up and running. If something isn't working as expected you can always [try it online] to see how it's done. Experiment with the source. Spend a little time thinking about how the view reacts to changes in the state. Can you add a reset button that sets the counter to zero? How would you disable the decrement button when the state is less than one?

## Taking it up a notch

For our next example, we'll build a random password generator. You've probably seen one before. We'll learn how to access the DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/Events) object. It provides information about a particular event, including the [target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target) element.

We want to be able to adjust its length, increasing or decreasing the strength of the password. No warranty of any kind is implied, though. Use at your own risk.

Here is the entire program in one place. You can [try it online] too. We'll dissect it afterwards.

```jsx
import { h, app } from "hyperapp"

const createPassword = length =>
  String.fromCharCode(
    ...Array.from({ length }, () => Math.floor(Math.random() * 58) + 64) // @ to z
  )

const MIN = 8
const MAX = 24

const NewLength = (_, event) => event.target.value

app({
  init: MIN,
  view: state => (
    <main>
      <input type="text" value={createPassword(state)} readonly />
      <input type="range" min={MIN} max={MAX} value={state} oninput={NewLength} />
    </main>
  ),
  container: document.body
})
```

Previously, we defined actions inside the view function itself. This is inefficient, as it creates a new function every time Hyperapp calls your view.

The event object is the second argument to `NewLength`. In it we find the input's value and return it to update the application state. We don't need the previous state argument to derive the new state, so we can ignore it.

Both input elements are synchronized with the application state. This prevents the state from going out of sync if the user changes their value.

Discussing `createPassword` in detail is out of the scope of this document, but you should be able to figure it out yourself. The magic numbers represent the range of ASCII characters from `@` to `z`.

## Putting it all together

Now that we have some experience under our belts, we are ready for something more sophisticated. This time we'll build a to-do app. Maybe you've already built one yourself using a different library. If not,that shouldn't be a problem.

We want to be able to add, edit and delete items. Filtering items is left as an excercise for the reader. We'll learn how to pass values to our actions and handle state more complex than a single value. We'll also see how to break up our view into functions that improve code reusability and readability.

As usual, here's the source code upfront. Let's get down to work.

```jsx
// To-do app
```

Explain the to-do app here.

## Next Steps

Explain this is just the tip of the iceberg. Provide links to more advanced code walkthroughs later in this documentation.

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/hyperapp>hyperapp</a>
</pre>

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org), use as you would anything else.

```js
import { h, app } from "hyperapp"
```

Don't want to set up a build environment? Grab Hyperapp from a CDN like [unpkg.com](https://unpkg.com/hyperapp) and it will be globally available through the `window.hyperapp` object. We support all ES5-compliant browsers, including Internet Explorer 10 and above.

```html
<script src="https://unpkg.com/hyperapp"></script>
```

## Overview

Hyperapp applications consist of a single state tree, a view to represent your user interface as a function of the state and actions to update the state. Every time your application state changes, Hyperapp calls your view function to create a new virtual DOM and uses it to update the actual DOM.

The virtual DOM model allows us to write code as if the entire document is thrown away and rebuilt on each change, while we only update what actually changed. We try to do this in the least number of steps possible, by comparing the new virtual DOM against the previous one. This leads to high efficiency, since typically only a small percentage of nodes need to change, and changing real DOM nodes is costly compared to recalculating the virtual DOM.

It may seem wasteful to throw away the old virtual DOM and re-create it entirely on every update—not to mention the fact that at any one time, Hyperapp is keeping two virtual DOM trees in memory, but as it turns out, browsers can create hundreds of thousands of objects very quickly. On the other hand, modifying the DOM is several orders of magnitude more expensive.

### View

```jsx
// Usage example
```

### Actions

```jsx
// Usage example
```

### Effects

```jsx
// Usage example
// DOM manipulation (focus/blur, animation), delay, and HTTP (weather app?).
```

### Subscriptions

```jsx
// SVG Clock Example and File I/O (upload)?
```

## Optimization

### Keys

```jsx
// Usage example
```

### Lazy Views

```jsx
// Usage example
```

## Support

Hyperapp is an open source project. The effort necessary to maintain and develop it is not sustainable without financial backing. You can [support me on Patreon](https://www.patreon.com/jorgebucaran). If you are not comfortable with recurring pledges, I also accept one-time donations via [PayPal](https://www.paypal.me/jorgebucaran).

## Links

- [Slack](https://hyperappjs.herokuapp.com)
- [Twitter](https://twitter.com/hyperappJS)
- [Examples](https://codepen.io/search/pens/?q=hyperapp)
- [/r/hyperapp](https://www.reddit.com/r/hyperapp)

## License

[MIT](LICENSE.md)
