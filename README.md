# Hyperapp

[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![npm](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

Hyperapp is a JavaScript micro-framework for building web applications.

You want to build high-quality, rich, and fast single-page applications. You heard about declarative UIs, unidirectional data-flow, immutable state, effects as data, functional reactive programming and thought you might try them out, but don't know how or where to get started. Hyperapp combines all these concepts into a single apparatus, clean architecture and tiny foundation. Once you learn how to use it, you'll never go back to DOM traversal and manipulation.

- **Minimal**—We have aggressively minimized the concepts you need to learn to be productive while remaining on par with what other frameworks can do. Dynamic, purely functional frontend applications without the headache.
- **Declarative**–Design your UI as a function of the state, and Hyperapp will efficiently update the DOM as your data changes. Declarative views, managed effects, and subscriptions make your code predictable and easy to debug.
- **Standalone**—Do more with less. Hyperapp includes state management and a [state-of-the-art] Virtual DOM engine that supports keyed updates, functional components & tree memoization—all without dependencies.

[Try Hyperapp], and [follow us](https://twitter.com/hyperappjs) on Twitter for all the news and updates!

## Getting started

Our first example is a counter that can be incremented or decremented. This is far from a real world application, but we need to start somewhere. The goal of this tutorial is to help you get a sense of how Hyperapp works. The example shows you how to initialize your application state, wire actions to user-driven events, and render HTML on the page.

Go ahead and paste this code in a new HTML file or [try it online].

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
        container: document.body
      })
    </script>
  </head>
  <body>
    <!-- Your app will be mounted here. -->
  </body>
</html>
```

Let's break it down from top to bottom.

We import Hyperapp as a JavaScript module over a <a href=https://en.wikipedia.org/wiki/Content_delivery_network title="Content Delivery Network">CDN</a>. Don't fret, it works in all evergreen browsers. You might still prefer a more traditional approach, and put the `<script>` tag inside the `<body>` at the bottom. It's up to you.

The `app` function creates a new application and mounts it on the supplied container, which can be any element in the DOM. The application starts by dispatching the `init` action to initialize the state. Our code does not explicitly maintain any state. Instead, we define actions to transform it and a view to visualize it. The view returns a representation of the DOM in the form of a plain JavaScript object known as a virtual DOM and Hyperapp updates the actual DOM to match it.

Here's what the virtual DOM looks like, abridged for clarity.

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

To create the virtual DOM like the one above, we use Hyperapp's `h` function. It takes three arguments: a string that specifies the type of element: `div`, `h1`, `button`, `form`; the element's properties (HTML/SVG attributes), and the element's child nodes.

Another way of creating a virtual DOM is using [JSX](https://reactjs.org/docs/introducing-jsx.html). JSX is an embeddable XML-like syntax language extension that lets you write HTML tags interspersed with JavaScript. Because browsers don't understand JSX, we need a compiler like [Babel](https://github.com/babel/babel) or [TypeScript](https://github.com/Microsoft/TypeScript) to translate it to `h` function calls.

The end result is the same, but our code now looks as follows.

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
  container: document.body
})
```

If you are using Babel, you'll need to install the [JSX transform plugin](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx) and add the pragma option to your `.babelrc` file. With TypeScript, you'll need to add the [`jsxFactory`](https://www.typescriptlang.org/docs/handbook/jsx.html#factory-functions) compiler option to your project's configuration file.

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

Fair warning, if you see JSX used in this documentation, it's purely an stylistic choice. Zero-hassle, compilation-free options include: [@hyperapp/html], [htmlo], [hyperx], [htm], and [ijk]. Try them all to find out which one works best for you.

Now, let's put it all together with a module bundler.

Bundlers take JavaScript files (or fonts, images, stylesheets), and combine them together into one or a few files optimized for the browser. In a real world scenario you'll likely be using one. For this example, we chose [Parcel]. If you prefer [Webpack] or [Rollup], refer to their documentation for usage details.

Open the HTML file you created for this example and modify it like so.

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

The `defer` attribute indicates to the browser that `index.js` should be executed after the document has been parsed and we have a body. Save the file and start the development server.

```console
$ parcel index.html
```

...and you should be up and running. You did it! But wait, we're not done yet.

If something isn't working as expected you can always [check out] the source online to see how it's done. Experiment with the code. Spend some time thinking about how the view reacts to changes in the state. Can we add a button that resets the counter back to zero? How about disabling the decrement button when the state is less than one? Let's work on that next.

Previously, we defined actions inside the view function. This was inefficient, as it creates a new function every time Hyperapp calls your view. Anonymous functions are also difficult to debug since they lack a real name. A good rule of thumb is to create a function for every action in your program.

```jsx
const Reset = () => 0
const Decrement = state => state - 1
const Increment = state => state + 1
```

An action can be any function that takes your application state as the first argument and returns a new state. We don't need the previous state argument to reset the counter, so we can ignore it.

Here's our program. You can check out the final result [here].

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
  container: document.body
})
```

We're off to a great start! But we left more questions unanswered than we tried to cover in this section. How do we dispatch an action with a payload, access DOM event objects, handle text input, cause side effects, subscribe to global events, manipulate the DOM, animate elements? We're just getting started. Keep reading to find out.

## Help, I'm Stuck!

We all get stuck sometimes. If you've hit a stumbling block and need to get help, check out the community support resources. Hop on the [Hyperapp Slack Room] to get help quickly, and if you don't receive an answer, or if you remain stuck, please file an issue, and we'll help you out.

## Table of Contents

- [Getting started](#getting-started)
- [Help, I'm Stuck!](#help-im-stuck)
- [Installation](#installation)
- [Fundamentals](#fundamentals)
  - [Initializing the state](#initializing-the-state)
  - [Rendering a page](#rendering-a-page)
  - [Dispatching actions](#dispatching-actions)
  - [Handling text input](#handling-text-input)
  - [Putting it all together](#putting-it-all-together)
- [Effects](#effects)
  - [Talking to servers]
  - [Manipulating the DOM]
  - [Creating random numbers]
  - [Implementing your own effects]
- [Subscriptions](#subscriptions)
  - [Controlling time]
  - [Mouse and keyboard input]
  - [Implementing your own subscriptions]
- [HTML Attributes]
  - [class]
  - [style]
  - [checked]
  - [selected]
- [Techniques]
  - [Testing]
  - [Recycling]
  - [Navigation]
  - [Using Forms]
  - [Animating elements]
  - [Headless applications]
  - [Using external libraries]
- [Optimization]
  - [Keys]
  - [Lazy views]
  - [Virtual DOM]
- [Ecosystem]
- [Support]
- [License](#license)

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/hyperapp>hyperapp</a>
</pre>

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org), use as you would anything else.

```js
import { h, app } from "hyperapp"
```

Don't want to set up a build environment? Download Hyperapp over a CDN like [unpkg.com](https://unpkg.com/hyperapp) and it will be globally available through the `window.hyperapp` object. We support all ES5-compliant browsers, including Internet Explorer 10 and above.

```html
<script src="https://unpkg.com/hyperapp"></script>
```

## Fundamentals

Hyperapp applications consist of a single state tree, a view that represents your user interface as a function of the state, and actions that describe state transitions. Every time your application state changes, Hyperapp calls your view function to create a virtual representation of the DOM and uses it to update the actual DOM.

A virtual DOM allows us to write code as if the entire document is thrown away and rebuilt on each transition, while we only update the parts that changed. We do this in the least number of steps possible, by comparing the new virtual DOM against the previous one, leading to high-efficiency, since typically only a small percentage of nodes need to change, and changing real DOM nodes is costly compared to recalculating the virtual DOM.

It may seem wasteful to throw away the old virtual DOM and re-create it entirely on every update—not to mention the fact that at any one time, Hyperapp is keeping two virtual DOM trees in memory, but as it turns out, browsers can create hundreds of thousands of objects very quickly. On the other hand, modifying the DOM is several orders of magnitude more expensive.

In this section, we'll walk you through building a to-do list app that can add, view, edit, and delete items. Don't skip it. The concepts you'll learn are essential to master Hyperapp. We'll learn how to pass values to an action, handle user input, and access the event object and element triggering a DOM event. We'll also see how to break down our view into functions to improve code reusability and readability.

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

Here's an opportunity to refactor code. If we create new to-dos through a function, we can reduce code duplication and automate generating a unique id for each item using a base change algorithm. No warranty of any kind is implied, though. Use at your own risk.

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

Looking good. We have an initial state, but there's still no user interface to display it. In the next section, we'll learn how to render a page and look more closely at the virtual DOM model.

### Rendering a page

When describing the content of a page, we use the `h` function to create a virtual DOM. A virtual DOM is an object representation of how the DOM should look at any point in time. Hyperapp calls your `view` function to get this object and converts it into real DOM nodes in the browser efficiently.

```jsx
import { h, app } from "hyperapp"

app({
  view: () => h("h1", { class: "title" }, "Hello"),
  container: document.body
})
```

The `h` stands for hyperscript. It's a way to describe HTML trees using functions. Hyperscript is widely used as a common interface to create nodes in virtual DOM implementations. While the virtual DOM object specification can vary between libraries, the `h`'s function signature is generally always the same.

Hyperapp will render the view in the supplied container. Unlike other frameworks, it's common to use the document's `body` because we don't take over the entire content of the element you pass in. Depending on your use case, you may also have a `div` element with an `id="root"` or `id="app"` for this purpose.

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
  container: document.body
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
  container: document.body
})
```

Excellent! Now we have a user interface to work with. Next, we want to populate the list dynamically based on the current state. We [previously] learned how to initialize the application state, and we know the `view` function takes in the state, so let's put the two together.

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
  container: document.body
})
```

The view is a visual representation of the state. The text field is synchronized with `state.value`, though, there's no way to update it yet, and by mapping through `state.items` we can turn the items array into an array of `<li>` nodes. There was no need to mutate the DOM manually, the markup is entirely declarative.

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
  container: document.body
})
```

Hyperapp components receive all the necessary state from their parent components, or in this case, the view function itself. Unlike the view function, however, components are not automatically wired to your application state.

We have a state and view to display it, but still no way to interact with the application. There's no way to toggle a to-do's edit mode; inputs and buttons aren't functional yet. In the next section, we're going to explore actions in detail. We'll learn how to respond to DOM events, and update the state, propagating changes back to the view.

### Dispatching actions

Actions describe state transitions: current state in, new state out. An action doesn't change the state in-place but yields a new state. We can dispatch actions in response to DOM events like clicks, mouse moves, key ups/downs, and so on, using the [on-event](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers) attribute of the target element.

```jsx
<button onclick={Add}>New Item</button>
```

When the user clicks the button, the browser sends a click event to the button. Hyperapp intercepts the event to dispatch the specified action with the current state and event object as a payload, and uses its return value as the new state. Then, it calls the view function to calculate a new virtual DOM and [schedules](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) a DOM update before the next browser repaint, minimizing expensive layout reflows and further repaints.

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
  container: document.body
})
```

This is the last stop of our fundamentals tour. If you made it here, congratulations, we built a minimal, fully functional to-do app from scratch in just a few lines of code. We left out useful features such as marking items as complete rather than deleting them, filtering, searching, and saving our data to local storage, but you should have a decent grasp of how Hyperapp works by now.

If you're up for the challenge, try implementing one or two new features; for example, it would be useful to cross-out a to-do to indicate we've completed a task without removing it from the list. Also useful to have is a button to clear the entire list in one go. Sometimes we need to start over to see things in a new light. Happy hacking!

## Effects

At the end of the day, we run programs for their side effects.

### Talking to servers

### Manipulating the DOM

### Creating random numbers

### Implementing your own effects

## Subscriptions

### Controlling time

```jsx
import { h, app } from "hyperapp"
import * as Time from "@hyperapp/time"
```

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

## HTML Attributes

### class

### style

### checked

### selected

### multiple

### innerHTML

## Techniques

### Testing

### Recycling

Hyperapp will try to hydrate child nodes instead of throwing away your server-side rendered content.

### Navigation

<!--
WIP: Oh, the Places You'll Go! Declarative routing using the History API.

```jsx
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
  container: document.body
})
```
-->

### Animating elements

### Headless applications

### Using external libraries

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

## Ecosystem

## Support

Hyperapp is an open source project. The effort necessary to maintain and develop it is not sustainable without financial backing. You can [support me](https://www.patreon.com/jorgebucaran) on Patreon. If you are not comfortable with recurring pledges, I also accept one-time donations via [PayPal](https://www.paypal.me/jorgebucaran). Thank you.

## Links

- [Slack](https://hyperappjs.herokuapp.com)
- [Twitter](https://twitter.com/hyperappJS)
- [Examples](https://codepen.io/search/pens/?q=hyperapp)
- [/r/hyperapp](https://www.reddit.com/r/hyperapp)

## License

[MIT](LICENSE.md)
