# Hyperapp

[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![npm](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

Hyperapp is a JavaScript micro-framework for building web interfaces.

> 👋 Psst! The documentation is still a work-in-progress. Please be patient as we work on it. If you think you've found a bug in Hyperapp, [create a new issue](https://github.com/jorgebucaran/hyperapp/issues/new) or [hop on Slack](https://hyperappjs.herokuapp.com) and let us know.

- **Minimal**—We have aggressively minimized the concepts you need to learn to be productive out of the box. Immutable state, unidirectional data-flow, effects as data and subscriptions—all combined into a single apparatus, clean, and tiny foundation.
- **Declarative**–Write what, not how, and Hyperapp will figure out the best way to update the DOM as your data changes. Declarative user interfaces lead to highly testable and predictable applications—you'll never go back to DOM traversal and manipulation.
- **Standalone**—Do more with less. Hyperapp includes state management and a [state-of-the-art] Virtual DOM engine that supports keyed updates, functional components & view memoization—all without dependencies.

[Check out the examples](#examples) and [follow Hyperapp](https://twitter.com/hyperappjs) on Twitter for news and updates. Did you know that maintaining and developing this project is a full-time effort? If you love Hyperapp, please [support me](https://patreon.com/jorgebucaran) on Patreon. If you are not comfortable with a recurring pledge, I also accept one-time donations via [PayPal](https://www.paypal.me/jorgebucaran). Thank you! 🙌

## Table of Contents

- [Installation](#installation)
- [Getting started](#getting-started)
- [Help, I'm stuck!](#help-im-stuck)
- [Fundamentals](#fundamentals)
  - [Initializing the state](#initializing-the-state)
  - [Rendering a page](#rendering-a-page)
  - [Dispatching actions](#dispatching-actions)
  - [Handling text input](#handling-text-input)
  - [Putting it all together](#putting-it-all-together)
- [Subscriptions](#subscriptions)
  - [Controlling time]
  - [Mouse and keyboard input]
  - [Implementing your own subscriptions]
- [Effects](#effects)
  - [Talking to servers](#talking-to-servers)
  - [Manipulating the DOM]
  - [Generating random numbers](#generating-random-numbers)
  - [Implementing your own effects]
- [HTML Attributes](#html-attributes)
- [Techniques](#techniques)
  - [Testing]
  - [Hydration]
  - [Navigation]
  - [Working with Forms](#working-with-forms)
  - [Using external libraries](#using-external-libraries)
  - [Animating elements]
- [Optimization](#optimization)
  - [Keys]
  - [Lazy views]
  - [Virtual DOM]
- [Examples](#examples)
- [Ecosystem](#ecosystem)
- [License](#license)

## Installation

Install the latest version of Hyperapp with a package manager. We recommend using npm or Yarn to manage your front-end dependencies and keep them up-to-date.

<pre>
npm i <a href=https://www.npmjs.com/package/hyperapp>hyperapp@beta</a>
</pre>

Then with a module bundler like [Parcel](https://parceljs.org) or [Webpack](https://webpack.js.org) import Hyperapp in your application and get right down to business.

```js
import { h, app } from "hyperapp"
```

Don't want to set up a build step? Load Hyperapp in a `<script>` tag and it will be available in the global scope through the `hyperapp` object. We support all ES5-compliant browsers out of the box, including IE11 and above.

```html
<script src="https://unpkg.com/hyperapp"></script>
<script>
  const { h, app } = hyperapp
</script>
```

Want to get a sense of what Hyperapp is like without installing anything? Try it in [this code playground].

## Getting started

Our first example is a counter that can be incremented or decremented. This is far from a real world application, but we're just getting started. The goal of this tutorial is to give you a taste of how Hyperapp works. The example shows you how to initialize your application state, wire actions to user-triggered events, and render HTML on the page.

Go ahead and paste the following code in a new HTML file. We'll break it down afterwards.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script type="module">
      import { h, app } from "https://unpkg.com/hyperapp?module"

      app({
        init: () => 0,
        view: state =>
          h("div", {}, [
            h("h1", {}, state),
            h("button", { onclick: state => state - 1 }, "-"),
            h("button", { onclick: state => state + 1 }, "+")
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

Let's start from the bottom and work our way up the HTML tree. First, we create an empty `<div>` inside the document body. We want to take over that node and replace it with our view. Maybe your program is within a broader application, in a sidebar widget and surrounded by other elements. That's fine. Hyperapp gives you absolute control over where the root element of your application is rendered in the DOM.

Inside the `<script>` tag we load Hyperapp as a module from a <a href=https://en.wikipedia.org/wiki/Content_delivery_network title="Content Delivery Network">CDN</a>. Don't worry, it works in all evergreen, self-updating desktop and mobile browsers. The application starts by dispatching the `init` action to initialize the state. Our code does not explicitly maintain any state. Instead, we define actions to transform it and a view to visualize it. The view returns a representation of the DOM known as a virtual DOM and Hyperapp updates the actual DOM to match it.

Here's what the virtual DOM looks like, abridged for clarity.

```js
{
  name: "div",
  props: {},
  children: [
    {
      name: "h1",
      props: {},
      children: [0]
    },
    {
      name: "button",
      props: {},
      children: ["-"]
    },
    {
      name: "button",
      props: {},
      children: ["+"]
    }
  ]
}
```

We use Hyperapp's `h` function to create virtual DOM nodes. It takes three arguments:

- A string that specifies the type of element: `div`, `h1`, `button`, etc.
- The element's properties (HTML or SVG attributes).
- The element's child nodes.

Describing HTML trees using functions, also known as hyperscript, is a common idea in virtual DOM implementations; the virtual DOM object specification may vary between libraries, but the function's signature stays the same.

Another way of creating virtual DOM nodes is using [JSX](https://facebook.github.io/jsx). JSX is an embeddable XML-like syntax language extension that lets you write HTML tags interspersed with JavaScript. It's syntactic sugar for pure, nested `h` function calls. The trade-off is that we need to compile it to standard JavaScript using a specialized tool before we can run the application.

If you are tagging along, create an `index.js` file and paste the following code.

```jsx
import { h, app } from "hyperapp"

app({
  init: () => 0,
  view: state => (
    <div>
      <h1>{state}</h1>
      <button onclick={state => state - 1}>-</button>
      <button onclick={state => state + 1}>+</button>
    </div>
  ),
  node: document.getElementById("app")
})
```

We'll use [Babel](https://babeljs.io) to translate JSX to `h` function calls. First, install [`@babel/core`](https://www.npmjs.com/package/@babel/core) and [`@babel/plugin-transform-react-jsx`](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx). One is the compiler, the other is a plugin that can rewrite JSX as an arbitrary function call. Then, add the following configuration to your `.babelrc` file, creating one if you still haven't.

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

Fair warning, if you see JSX used in this documentation, it's purely a stylistic choice. If you don't want to set up a build step, there are compilation-free options such as [@hyperapp/html], [htmlo], and [htm](https://github.com/developit/htm). Try them all to find out which one works best for you.

Now, open the `index.html` file created earlier for this example and modify it like so.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script defer src="index.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

The `defer` attribute indicates to the browser that `index.js` should be executed after the document has been parsed and we have a body. Now, let's put it all together with a module bundler.

Bundlers take JavaScript modules (or fonts, images, stylesheets), and combine them into one or a few files optimized for the browser. For this example, we are choosing [Parcel](https://parceljs.org). If you prefer [Webpack] or [Rollup], refer to their documentation for usage details.

```console
$ npx parcel index.html
```

...and you should be up and running. You did it.

If something isn't working as expected you can always [check out] the source online to see how it's done. Experiment with the code. Spend some time thinking about how the view reacts to changes in the state. Can we add a button that resets the counter back to zero? How about disabling the decrement button when the state is less than one? Let's work on that next.

Previously, we defined actions inside the view function. This is inefficient, as it creates a new function every time Hyperapp calls the view. Anonymous functions are also awkward to debug since they don't have a name. A good rule of thumb is to create a function for every action in your program. Don't hold back, they're cheap!

```jsx
const Reset = () => 0
const Decrement = state => state - 1
const Increment = state => state + 1
```

An action can be any function that takes the application state as the first argument and returns a new state. Notice that `Reset` doesn't need the state argument to reset the counter, so we can ignore it. Actions can also receive a payload, but let's not get ahead of ourselves.

Here's how our program looks now. You can [try it online here].

```jsx
import { h, app } from "hyperapp"

const Reset = () => 0
const Decrement = state => state - 1
const Increment = state => state + 1

app({
  init: Reset,
  view: state => (
    <div>
      <h1>{state}</h1>
      <button onclick={Reset}>Reset</button>
      <button onclick={Decrement} disabled={state === 0}>
        -
      </button>
      <button onclick={Increment}>+</button>
    </div>
  ),
  node: document.getElementById("app")
})
```

We left more questions unanswered than we tried to cover in this section. How do we dispatch an action with a payload, access DOM event objects, handle text input, cause side effects, subscribe to global events, manipulate the DOM, animate elements?

We're off to a great start! Keep calm and read on.

## Help, I'm stuck!

We all get stuck sometimes. If you've hit a stumbling block and need to get help, check out the community support resources. Hop on the [Hyperapp Slack Room](https://hyperappjs.herokuapp.com/) to get help quickly, and if you don't receive an answer, or if you remain stuck, please file an issue, and we'll help you out.

## Fundamentals

Hyperapp applications consist of a single state tree, a view that represents your user interface as a function of the state, and actions that describe state transitions. Every time your application state changes, Hyperapp calls your view function to create a virtual representation of the DOM and uses it to update the actual DOM.

A virtual DOM allows us to write code as if the entire document is thrown away and rebuilt on each transition, while we only update the parts that changed. We do this in the least number of steps possible, by comparing the new virtual DOM against the previous one, leading to high-efficiency, since typically only a small percentage of nodes need to change, and changing real DOM nodes is costly compared to recalculating the virtual DOM.

It may seem wasteful to throw away the old virtual DOM and re-create it entirely on every update—not to mention the fact that at any one time, Hyperapp is keeping two virtual DOM trees in memory, but as it turns out, browsers can create hundreds of thousands of objects very quickly. On the other hand, modifying the DOM is several orders of magnitude more expensive.

In this section, we'll walk you through building a to-do list app that can add, view, edit, and delete items. Don't skip this tutorial. The concepts you'll learn are essential to master Hyperapp. We'll learn how to pass values to an action, handle user input, and access the event object and element triggering a DOM event. We'll also see how to break down our view into functions to improve code reusability and readability.

### Initializing the state

The state is a plain object that contains knowledge about your application at any given time; for example, a blog needs to know whether or not a user is logged in or how many posts they have published, a platform game might keep track of the character's coordinates on the screen, vertical velocity, direction, and so on.

Our to-do app needs an array to store the to-do items and a string to tag what the user is currently typing into a text field. Each item will have an id and a value. We also want to know if the user is editing a particular item, and a way to undo changes if they cancel the operation.

```jsx
import { app } from "hyperapp"

app({
  init: () => ({
    value: "",
    items: [
      {
        id: 1,
        value: "Go outside",
        isEditing: false,
        lastValue: ""
      }
    ]
  })
})
```

The `init` action describes how to initialize the state. Think of it as the entry point of the program. Unlike [model–view–controller](https://en.wikipedia.org/wiki/Model–view–controller) and derivatives that encourage spreading the state out across different components, Hyperapp's state is consolidated in one place.

If we decide to start with more than one to-do items, we're going to run out of vertical space quickly. By creating new to-do items through a function, we can reduce code duplication and automate generating a unique id for each item using a base change algorithm. No warranty of any kind is implied, though. Use at your own risk.

> Using the `Math.random` method to generate random numbers is a side effect. We're taking a pragmatic approach to allow for side effects in this example only for convenience. You can read more about [generating random numbers] using Hyperapp effects later in this guide.

```jsx
import { app } from "hyperapp"

const newItem = value => ({
  id: Math.random().toString(36),
  isEditing: false,
  lastValue: "",
  value
})

app({
  init: () => ({
    value: "",
    items: [
      newItem("Go outside"),
      newItem("Wake up earlier"),
      newItem("Learn a new language")
    ]
  })
})
```

We have an initial state, but there's still no user interface to display it. In the next section, we'll learn how to render a page and look more closely at the virtual DOM model.

### Rendering a page

When describing the content of a page, we use the `h` function to create a virtual DOM. A virtual DOM is an object representation of how the DOM should look at any point in time. Hyperapp calls your `view` function to create this object and converts it into real DOM nodes in the browser efficiently.

```jsx
import { h, app } from "hyperapp"

app({
  view: () => h("h1", {}, "Hello"),
  node: document.getElementById("app")
})
```

We also need to tell Hyperapp where to render the view. Usually, you'll have a node with an `id="app"` or `id="root"` in your HTML for this purpose. You can use any type of node, even a text node. If the node isn't empty, Hyperapp will recycle its children instead of throwing away the existing content. This process is also called [hydration]. We'll discuss it later in the documentation.

Let's use what we've learned to render our to-do app with Hyperapp.

```jsx
import { h, app } from "hyperapp"

app({
  view: () =>
    h("div", {}, [
      h("h1", {}, "To-Do"),
      h("ul", {}, [
        h("li", {}, "Go outside"),
        h("li", {}, "Wake up earlier"),
        h("li", {}, "Learn a new language")
      ]),
      h("input", { type: "text", value: "" }),
      h("button", {}, "New Item")
    ]),
  node: document.getElementById("app")
})
```

If HTML tags in your JavaScript sounds appealing, here's the same code with JSX. It requires a build step, but JSX tends to look like regular HTML, which can be a win for you or your team. We'll be using JSX for the rest of this document, but you can choose whatever works for you. Check out [`@hyperapp/html`] for an official alternative.

```jsx
import { h, app } from "hyperapp"

app({
  view: () => (
    <div>
      <h1>To-Do</h1>
      <ul>
        <li>Go outside</li>
        <li>Wake up earlier</li>
        <li>Learn a new language</li>
      </ul>
      <input type="text" value="" />
      <button>New Item</button>
    </div>
  ),
  node: document.getElementById("app")
})
```

Excellent! Now we have a user interface to work with. Next, we want to populate the list dynamically based on the current state. [Previously], we learned how to initialize the application state, and we know the `view` function takes in the state, so let's put the two together.

```jsx
import { h, app } from "hyperapp"

const newItem = value => ({
  id: Math.random().toString(36),
  isEditing: false,
  lastValue: "",
  value
})

app({
  init: () => ({
    value: "",
    items: [
      newItem("Go outside"),
      newItem("Wake up earlier"),
      newItem("Learn a new language")
    ]
  }),
  view: state => (
    <div>
      <h1>To-Do</h1>
      <ul>
        {state.items.map(item => (
          <li>{item.value}</li>
        ))}
      </ul>
      <input type="text" value={state.value} />
      <button>Add</button>
    </div>
  ),
  node: document.getElementById("app")
})
```

The view is a way to view your state as HTML. The text field is synchronized with `state.value`, though, there's no way to update it yet, and by mapping through `state.items` we can turn the items array into an array of `<li>` nodes. There was no need to mutate the DOM manually, the markup is entirely declarative.

Eventually, you'll want to break down your view into reusable components. Hyperapp components are stateless functions that return virtual DOM nodes. Their input is the state or a part thereof; their output is the markup that represents the supplied state. Components make it easy to split your UI into chunks of content, styles, and behavior that belong together.

```jsx
const TodoList = props => (
  <ul>
    {props.items.map(item => (
      <li>{item.value}</li>
    ))}
  </ul>
)
```

Let's revisit our to-do app requirements. We want to add new, edit, and delete existing entries. When we're editing an item, it should also be possible to cancel the operation. As it turns out, we already have everything we need in the state. If you look at any to-do item, you'll find `isEditing`, a boolean flag set to `false`. We're going to use it to toggle a to-do's edit mode. While in edit mode, we'll show a text field, and buttons such as Cancel, Remove, and Save.

```jsx
const TodoList = props => (
  <ul>
    {props.items.map(item =>
      item.isEditing ? (
        <li>
          <input type="text" value={item.value} />
          <button>Cancel</button>
          <button>Remove</button>
          <button>Save</button>
        </li>
      ) : (
        <li>{item.value}</li>
      )
    )}
  </ul>
)
```

To render the `TodoList` component, you can use it as you would any other element in the view. We've left out the state initialization code for brevity.

```jsx
app({
  init: () => ({
    // ...
  }),
  view: state => (
    <div>
      <h1>To-Do</h1>
      <TodoList items={state.items} />
      <input type="text" value={state.value} />
      <button>Add</button>
    </div>
  ),
  node: document.getElementById("app")
})
```

Hyperapp components receive all the necessary state from their parent components, or in this case, the view function itself. Unlike the view function, however, components are not automatically wired to your application state.

We have a state and view to display it, but still no way to interact with the application. There's no way to toggle a to-do's edit mode; inputs and buttons aren't functional yet. In the next section, we're going to explore actions in detail. We'll learn how to respond to DOM events, and update the state, propagating changes back to the view.

### Dispatching actions

Actions describe state transitions: current state in, new state out. An action doesn't change the state in-place but yields a new state. We can dispatch actions in response to DOM events like clicks, mouse moves, key ups/downs, and so on, using the [on-event](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers) attribute of the target element.

```jsx
<button onclick={Add}>New Item</button>
```

When the user clicks the button, the browser sends a click event to the button. Hyperapp intercepts the event to dispatch the specified action with the current state and event object as a payload and uses the return value of the action as the new state. At this point, the state and the DOM are out of sync. Next, it calls the view function to calculate a new virtual DOM and [schedules](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) the DOM to update before the next browser repaint, minimizing expensive layout reflows and further repaints.

Hyperapp's state is immutable. You initialize it, but you can't change it like you would any other object. Instead, changes are presented by creating a new object based on the current state; for example, here's the action to describe adding a new item in our to-do app.

```jsx
const Add = state => ({
  ...state,
  value: "",
  items: state.items.concat(newItem(state.value))
})
```

Notice how we use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals) to shallow-clone the state and merge it with the updated properties, creating a brand new object in the process. When adding a new to-do item, we join `state.items` and `state.value` into a new `items` array, and to clear the text field, set the current `value` to an empty string. Creating a new array to add, update or remove items is a common pattern when working with lists in an immutable fashion.

Immutability doesn't imply that the state is unwriteable. You can try to circumvent the state transition mechanism, but that's never a good idea. If you mutate a property in the state, Hyperapp doesn't know what has changed, potentially leading to a DOM out of sync with your state and unwanted side-effects. You've been warned.

Back to our to-do app. We've seen how to add new items, but how do we remove an item without mutating the original state? We know that every to-do item has an `id` property. The solution is to use the [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method on `state.items` and create a new array without the unwanted element.

```jsx
const Remove = (state, id) => ({
  ...state,
  items: state.items.filter(item => item.id !== id)
})
```

What is of interest here is how the action receives the `id`. When we want Hyperapp to dispatch an action with a custom payload we use a 2-tuple action-value pair that consists of the action and any type of data we want to send as a payload.

```jsx
<button onclick={[Remove, item.id]}>Remove</button>
```

And for context, here's the new `TodoList` component. We also went ahead and wired actions to the Save and Cancel buttons, and to each to-do list item to toggle the edit mode when clicked. We'll introduce them after the code snippet.

```jsx
const TodoList = props =>
  props.items.map(item =>
    item.isEditing ? (
      <li>
        <input type="text" value={item.value} />
        <button onclick={[Cancel, item.id]}>Cancel</button>
        <button onclick={[Remove, item.id]}>Remove</button>
        <button onclick={[ToggleEdit, item.id]}>Save</button>
      </li>
    ) : (
      <li onclick={[ToggleEdit, item.id]}>{item.value}</li>
    )
  )
```

Let's take a look at `ToggleEdit` first. Why is it used in two different elements? It's essentially a switch. The state needs to know if we're in edit mode or not; moreover, we're trying to make any item editable, that's why `isEditing` is in the to-do definition.

```jsx
const ToggleEdit = (state, id) => ({
  ...state,
  items: state.items.map(item =>
    item.id === id
      ? {
          ...item,
          lastValue: item.value,
          isEditing: !item.isEditing
        }
      : item
  )
})
```

The gist of it is toggling `isEditing` on or off based on its current value, and saving `item.value` in `lastValue`. We're carrying a copy of each to-do's value at all times, which we'll use to reset `value` in `Cancel` shown below.

```jsx
const Cancel = (state, id) => ({
  ...state,
  items: state.items.map(item =>
    item.id === id
      ? {
          ...item,
          value: item.lastValue,
          isEditing: false
        }
      : item
  )
})
```

In plain English, `Cancel` updates the item matching the supplied `id` in `items` by setting its `value` back to what it was before switching to edit mode, and sets `isEditing` to false to switch edit mode off.

If we look closely at either action, we'll notice a repetitive pattern: map through an array, find an element matching a given `id`, and update one or more properties in it. Wouldn't it be nice if we could refactor that into a function we can reuse later? Fortunately, we can.

```jsx
const setItem = (items, id, set) =>
  items.map(item => (item.id === id ? { ...item, ...set(item) } : item))

const Cancel = (state, id) => ({
  ...state,
  items: setItem(state.items, id, item => ({
    value: item.lastValue,
    isEditing: false
  }))
})

const ToggleEdit = (state, id) => ({
  ...state,
  items: setItem(state.items, id, item => ({
    lastValue: item.value,
    isEditing: !item.isEditing
  }))
})
```

The result is less, and more readable code. A single glance at `Cancel` or `ToggleEdit` reveals what properties are changing in any given to-do, without getting bogged down in the how.

In the next section, we'll learn how to handle text input, and access the event object and element that triggered the event. Hang on tight! We're almost there.

### Handling text input

So far we've seen how to dispatch an action when the user clicks on a button, but how do we update the state when the user types into a text field? Moreover, text fields are inherently stateful—how do we prevent the application state and DOM from getting out of sync? Let's find out.

To capture what the user is typing into a text field, we can use the oninput event attribute to dispatch an action when the text is changed. [Input events](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/input_event) fire not only on every keystroke but whenever the value of a text field changes; for example, by dragging text to or from the element, by cutting or pasting text either with or without the keyboard, by using speech recognition to dictate the text, etc. And by setting the value attribute of the element to `state.value`, we guarantee that its internal state always mirrors what's in our state.

```jsx
<input type="text" value={state.value} oninput={NewValue} />
```

Likewise, the onchange event occurs when the selection, the checked state or the value of an element have changed, however, for a text field, this event only fires when the element loses focus, whereas input events fire immediately on every change. [Change events](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) are useful for validating forms as sometimes we don't want to display errors until the user is done typing.

The browser creates an [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event) for every event, carrying detailed information about the event at the time it occurred: the type of the event, the event target, the screen coordinates of a mouse click, etc. Hyperapp sends this object as a payload to every action, allowing us to update `state.value` with the current value of the text field.

```jsx
const NewValue = (state, event) => ({ ...state, value: event.target.value })
```

Similarly, we need to handle text input for every to-do item while it is in edit mode, as well as send a custom payload to the action to identify which to-do item the user is editing. In this case, the action will receive the custom payload, followed by the event object.

```jsx
const Update = (state, id, event) => ({
  ...state,
  items: setItem(state.items, id, () => ({ value: event.target.value }))
})
```

And here's our up-to-date `TodoList` component.

```jsx
const TodoList = props =>
  props.items.map(item =>
    item.isEditing ? (
      <li>
        <input type="text" value={item.value} oninput={[Update, item.id]} />
        <button onclick={[Cancel, item.id]}>Cancel</button>
        <button onclick={[Remove, item.id]}>Remove</button>
        <button onclick={[ToggleEdit, item.id]}>Save</button>
      </li>
    ) : (
      <li onclick={[ToggleEdit, item.id]}>{item.value}</li>
    )
  )
```

Neat! We have all the bits and pieces we need to put our to-do app together now. In the next section, we'll wrap things up and present the entire program in all its shining glory.

### Putting it all together

Here's the fruit of our work. Everything is in one place to help you see the big picture. In a real-world scenario, you'll want to split up your code into modules instead to reduce complexity and improve maintainability. Check out the example [online] for a potential way to organize a Hyperapp project.

```jsx
import { h, app } from "hyperapp"

const setItem = (items, id, set) =>
  items.map(item => (item.id === id ? { ...item, ...set(item) } : item))

const newItem = value => ({
  id: Math.random().toString(36),
  isEditing: false,
  lastValue: "",
  value
})

const NewValue = (state, event) => ({ ...state, value: event.target.value })

const Add = state => ({
  ...state,
  value: "",
  items: state.items.concat(newItem(state.value))
})

const Update = (state, id, event) => ({
  ...state,
  items: setItem(state.items, id, () => ({ value: event.target.value }))
})

const Cancel = (state, id) => ({
  ...state,
  items: setItem(state.items, id, item => ({
    value: item.lastValue,
    isEditing: false
  }))
})

const Remove = (state, id) => ({
  ...state,
  items: state.items.filter(item => item.id !== id)
})

const ToggleEdit = (state, id) => ({
  ...state,
  items: setItem(state.items, id, item => ({
    lastValue: item.value,
    isEditing: !item.isEditing
  }))
})

const TodoList = props =>
  props.items.map(item =>
    item.isEditing ? (
      <li>
        <input type="text" value={item.value} oninput={[Update, item.id]} />
        <button onclick={[Cancel, item.id]}>Cancel</button>
        <button onclick={[Remove, item.id]}>Remove</button>
        <button onclick={[ToggleEdit, item.id]}>Save</button>
      </li>
    ) : (
      <li onclick={[ToggleEdit, item.id]}>{item.value}</li>
    )
  )

app({
  init: {
    value: "",
    items: [
      newItem("Go outside"),
      newItem("Wake up earlier"),
      newItem("Learn a new language")
    ]
  },
  view: state => (
    <main>
      <h1>To-Do</h1>
      <TodoList items={state.items} />
      <input type="text" value={state.value} oninput={NewValue} />
      <button onclick={Add}>New Item</button>
    </main>
  ),
  node: document.getElementById("app")
})
```

This is the last stop of our fundamentals tour. If you made it here, congratulations, we built a minimal, fully functional to-do app from scratch in just a few lines of code. We left out features like marking items as complete rather than deleting them, filtering, searching, and saving our data to local storage, but you should have a decent grasp of how Hyperapp works by now.

If you're up for the challenge, try implementing one or two new features; for example, it would be useful to cross-out a to-do to indicate you've completed a task without removing it from the list. Also nice to have is a button to clear the entire list in one go. Sometimes we need to start over to see things in a new light.

## Subscriptions

<!--

Did the user resize the browser's window? Did the physical orientation of the hosting device change?

When our application state changes we compare the new and old subscriptions, compute their differences and rewire the underlying connections to match the desired state. Think of subscriptions as "virtual DOM meets events".

-->

We want to know when something interesting happens outside of our application. We can dispatch an action when the user clicks on a button, or types into a text field, but how do we subscribe to global key presses, animation frames, clock ticks, or events that aren't a direct result of user activity like location changes or server-sent events? Subscriptions allow us to listen for such things using a declarative paradigm.

Working with traditional event emitters requires complicated resource management like adding and removing event listeners, closing connections, clearing intervals—not to mention testing asynchronous code is tricky. What happens when the source you are subscribed to shuts down? How do you cancel or restart a subscription? Think of subscriptions as "virtual DOM meets events". When our application state changes we compare the new and old subscriptions, compute their differences and rewire the underlying connections to match the desired state.

Similar to how we use hyperscript to create virtual nodes instead of writing them out by hand, we use a function to create each type of event we want to subscribe to. For time ticks there is [@hyperapp/time], for global mouse and keyboard events there is [@hyperapp/mouse] and [@hyperapp/keyboard]. Need to use WebSockets for real-time two-way communication? [`@hyperapp/websocket`] got you covered. In this section, we'll walk through concrete examples that show how to use and create your own subscriptions. Let's dive in!

### Controlling time

{{general info about cliock ticks To subscribe to clock ticks, we'll import the `tick` function from `@hyperapp/time`.}}

```jsx
import { h, app } from "hyperapp"
import { tick } from "@hyperapp/time"
```

{{
The `app` function can a `subscriptions` function

Subscriptions are described using arrays. If a new subscription appears in the array, we'll start the subscription. When a subscription leaves the array, we'll cancel it. If any of its properties change, we'll restart it.
}}

```jsx
const Tick = (state, { time }) => ({ ...state, time })

app({
  subscriptions: () => [
    tick({
      action: Tick,
      interval: 1000
    })
  ]
})
```

{{
Now let's put it all together. Say some random thing. There is a fair amount of code, but do not worry. We will go through it all!
}}

```jsx
import { h, app } from "hyperapp"
import { tick } from "@hyperapp/time"

const timeToUnits = date => [
  date.getHours(),
  date.getMinutes(),
  date.getSeconds()
]

const formatTime = (hours, minutes, seconds, use24) =>
  (use24 ? hours : hours > 12 ? hours - 12 : hours) +
  ":" +
  `${minutes}`.padStart(2, "0") +
  ":" +
  `${seconds}`.padStart(2, "0") +
  (use24 ? "" : ` ${hours > 12 ? "PM" : "AM"}`)

const posixToHumanTime = (time, use24) =>
  formatTime(...timeToUnits(new Date(time)), use24)

const Tick = (state, { time }) => ({ ...state, time })

const ToggleFormat = state => ({ ...state, use24: !state.use24 })

app({
  init: () => ({
    time: Date.now(),
    use24: false
  }),
  view: state => (
    <main>
      <h1>{posixToHumanTime(state.time, state.use24)}</h1>
      <fieldset>
        <legend>Settings</legend>
        <label>
          <input type="checkbox" checked={state.use24} oninput={ToggleFormat} />
          Use 24 Hour Clock
        </label>
      </fieldset>
    </main>
  ),
  subscriptions: () => [
    tick({
      action: Tick,
      interval: 1000
    })
  ],
  node: document.getElementById("app")
})
```

{{
Explain what's going on. No need to write a bible.

closing remarks

Subscriptions are a way to think about event streams whose lifecycle is determined by changes in our program state. in this example we didn't look at it, but the `subscriptions` function takes in the application state as an argument. Here we are subscribed to clock ticks forever, but we can turn our subscription on or off based on the state.

show a new simple example or say we're going to deal with this later.
}}

### Mouse input

```jsx
import { h, app } from "hyperapp"
import * as Mouse from "@hyperapp/mouse"
```

### Keyboard input

```jsx
import { h, app } from "hyperapp"
import * as Keyboard from "@hyperapp/keyboard"
```

### Implementing your own subscriptions

## Effects

We run programs for their side effects. Likewise, we want our programs to be predictable, easy to compose, test, and parallelize. JavaScript single-threaded execution guarantees that operations are atomic; two functions will never run at the same time, and we don't usually need to worry about concurrency, deadlock or race conditions (at least not the type of race condition caused by interleaved multi-threaded code), but we can still shoot ourselves in the foot by uncontrolled, indiscriminate use of side effects.

How can our programs be pure while conversing with the outside world? Rather than setting a timeout or making an HTTP request, an action can return a description of the work that needs to be done, and Hyperapp will figure out how to do the job behind the scenes. Like the view function returns a specification of the DOM, but doesn't touch the real DOM; an effect describes a side effect: creating an HTTP request, giving focus to an element, saving data to local storage, sending data over a WebSocket, etc., without executing any code.

{{
explain that hyperapp effects are not like built-into hyperapp, instead we need to import modules that produce the type of effects that we want. these modules encapsulate the implementation—the part that tells hyperapp exactly what to do. In this section, we'll walk through concrete examples that show how to use several Hyperapp effects to create timeouts, talk to servers, generate random numbers, manipulate the DOM, and much more. Finally, we'll learn how to create custom effects and discuss when we might want to use them.
}}

### Delaying time

{{
_Instead of having JavaScript execute a function immediately, you can tell it to execute a function after a certain period of time._ we coulve chosen from other more realistic examples, but timeout'S minimal api surface make them a perfect candidate to introduce effects in hyperapp. Let's start with a bla bla that demonstrates the gist of the idea. First, we'll import the effect we need from the `@hyperapp/time` module_. _Next, we'll create an action to do bla bla. Finally, we'll initialize the application and start the effect at the same time.
}}

```jsx
```

{{
up until this point weve used init to describe the initial state of our application, but it just so happens that actions are also allowed to return 2-tuple state-effect pairs. Think of it as a plan that describes what the state should be and the side effect we want to produce.
}}

### Talking to servers

{{
say some generic thing about making http requests and why we cant live without them and about the history of doing http in javascript and make sure to use words like ajax, fetch, xmlhttprequest. then try to make a case for why using any of those technologies is bad or difficult or prone to errors and how fetch, while eliminating many of the pitfalls of xmlhttprequest doesn't really improve much, not to mention the fact that its promise-based api is total garbage. now try to keep that at a minimum, remember this is not a book.
}}

```jsx
// gif search
```

```jsx
// https://exchangeratesapi.io
```

### Manipulating the DOM

```jsx
// focus example
import { h, app } from "hyperapp"
import { focus } from "@hyperapp/dom"

const SetFocus = state => [state, focus({ id: "input" })]

app({
  view: () => (
    <main>
      <input id="input" type="text" />
      <button onclick={SetFocus}>Set Focus</button>
    </main>
  ),
  node: document.getElementById("app")
})
```

### Generating random numbers

```jsx
// dice roll game
```

### Implementing your own effects

```jsx
```

## HTML Attributes

### class

### style

### checked

### selected

### multiple

### innerHTML

## Techniques

### Testing

### Hydration

Hyperapp will try to hydrate child nodes instead of throwing away your server-side rendered content. Hydration recycles existing DOM (usually from server-side rendering) rather than create new elements.

Hyperapp works transparently with SSR and pre-rendered HTML, enabling SEO optimization and improving your sites time-to-interactive. The process consists of serving a fully pre-rendered page together with your application.

Then instead of throwing away the server-rendered markdown, we'll turn your DOM nodes into an interactive application.

{{Hyperapp expects that the rendered content is identical between the server and the client. It can patch up differences in text content, but you should treat mismatches as bugs and fix them. In development mode, Hyperapp warns about mismatches during hydration. There are no guarantees that attribute differences will be patched up in case of mismatches. This is important for performance reasons because in most apps, mismatches are rare, and so validating all markup would be prohibitively expensive.}}

### Navigation

{{
Oh, the Places You'll Go! Declarative routing using the History API.
}}

```
import { h, app } from "hyperapp"
import { location } from "@hyperapp/location"

app({
  init: () => ({
    location: location.state
  }),
  view: state => (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
      </ul>
      <hr />
      {state.location === "/"
        ? Home
        : state.location === "/about"
        ? About
        : state.location === "/topics"
        ? TopicsView
        : NotFound}
      }
    </div>
  ),
  subscriptions: state => [location.onLocationChange],
  node: document.getElementById("app")
})
```

### Working with forms

{{
This module provides a series of articles that will help you master HTML forms. HTML forms are a very powerful tool for interacting with users; however, for historical and technical reasons, it's not always obvious how to use them to their full potential. In this guide, we'll cover all aspects of HTML forms, from structure to styling, from data handling to custom widgets.

HTML Forms are one of the main points of interaction between a user and a web site or application. They allow users to send data to the web site. Most of the time that data is sent to the web server, but the web page can also intercept it to use it on its own.

An HTML Form is made of one or more widgets. Those widgets can be text fields (single line or multiline), select boxes, buttons, checkboxes, or radio buttons. Most of the time those widgets are paired with a label that describes their purpose — properly implemented labels are able to clearly instruct both sighted and blind users on what to enter into a form input.

The main difference between a HTML form and a regular HTML document is that most of the time, the data collected by the form is sent to a web server. In that case, you need to set up a web server to receive and process the data. How to set up such a server is beyond the scope of this article, but if you want to know more, see Sending form data later in the module.
}}

### Using external libraries

{{

Maybe you've run into a situation where Hyperapp alone isn't enough to do what you want and you are under a time constraint or need to step outside the boundaries set by a functional paradigm. you need to reach for external, third-party libraries. In this tutorial, we'll learn how to integrate a third-party library with a Hyperapp application.

}}

### Animating elements

## Optimization

### Keys

```jsx
import { h, app } from "hyperapp"
```

### Lazy views

Immutability makes it cheap to figure out when things are the same. It guarantees that if two things are referentially equal (they occupy the same location in memory), they must be identical.

```jsx
import { h, Lazy, app } from "hyperapp"
```

Perf overhead you say? More like perf benefit!

## Examples

- [7GUI] - A GUI Programming Benchmark
  - [Counter]
  - [Temperature converter]
  - [Flight booker]
  - [Timer]
  - [CRUD]
  - [Circle drawer]
  - [Spreadsheet]
- [TodoMVC] - Helping your select an MV\* framework
- [HNPWA] - Hacker News reader as a progressive web application
- [RealWorld] - Fullstack Medium-like clone
- [Starter Kit] - Everything you need to start building applications with Hyperapp

## Ecosystem

| Package                            | Version                                                                                                 | About                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [`hyperapp`](.)                    | [![npm](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.com/package/hyperapp)             | Hyperapp                                    |
| [`@hyperapp/html`](/packages/html) | [![npm](https://img.shields.io/npm/v/@hyperapp/html.svg)](https://www.npmjs.com/package/@hyperapp/html) | Write HTML using functions in Hyperapp      |
| [`@hyperapp/http`](/packages/http) | [![npm](https://img.shields.io/npm/v/@hyperapp/http.svg)](https://www.npmjs.com/package/@hyperapp/http) | Make HTTP requests in Hyperapp              |
| [`@hyperapp/time`](/packages/time) | [![npm](https://img.shields.io/npm/v/@hyperapp/time.svg)](https://www.npmjs.com/package/@hyperapp/time) | Time effects and subscriptions for Hyperapp |

## License

[MIT](LICENSE.md)
