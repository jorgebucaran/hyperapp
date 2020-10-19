# Reference

Below is a consice recap of Hyperapp's core APIs and packages. It's geared towards developers who already have some familiarity with Hyperapp and want to look up something quickly. If you're just getting started, we recommend [working through the tutorial](tutorial.md) first.

- [`h()`](#h)
  - [key](#key-prop)
  - [style](#style-prop)
  - [class](#class-prop)
- [`text()`](#text)
- [`app()`](#app)
  - [init](#init-prop)
  - [view](#view-prop)
  - [subscriptions](#subscriptions-prop)
  - [node](#node-prop)
  - [middleware](#middleware-prop)
- [`memo()`](#memo)
- [Actions](#actions)
  - [Simple](#simple-action-state--nextstate)
  - [Complex](#complex-action-state-props--nextstate)
  - [With side-effects](#action-with-side-effects-state--nextstate-effects)
- [effects](#effects)
- [subscriptions](#subscriptions)

## h()

```js
h(type, props, children)
```

Hyperscript function to create virtual DOM nodes (VNodes), which are used for [rendering](#rendering).

A VNode is a simplified representation of an HTML element. It represents an element you want to see on the screen in your app. Unlike real DOM nodes, VNodes are cheap to create and easy for the CPU to work with.

- **type** - Name of the node, eg: div, h1, button, etc.
- **props** - Object containing HTML or SVG attributes the DOM node will have and [special props](#special-props).
- **children** - Array of child VNodes or single VNode child.

```js
import { h, text } from "hyperapp"

const boxView = ({ showGreeting = false }) =>
  h("div", { id: "box" }, [
    h("h1", {}, text("Hello!")),
    showGreeting && h("p", {}, text("Nice to see you.")),
  ])
```

In Hyperapp, because you are using javascript to represent the DOM of your application, you can use it's full power to dynamically render elements to the screen. Here's an example for doing conditionnal rendering in hyperapp:

```js
const accordionView = (title, description, isOpened) =>
  h("section", { class: "accordion" }, [
    h("h4", {}, text(title)),
    h("button", {}, text(isOpened ? "Expand" : "Collapse")),
    isOpened && h("p", {}, text("description")),
  ])
```

### Special props

#### Key prop

The `key` is a unique string per VNode that help Hyperapp track if VNodes are changed, added or removed in situations where it can't, such as in arrays.

<!-- prettier-ignore -->
```js
const itemsView = (items) =>
  h("ul", {}, 
    items.map((item) => h("li", { key: item.id }, text(item.text))),
  )
```

#### Style prop

The `style` prop can be either a string of CSS or an object of styles

```js
h("section", {
  style: {
    padding: "1rem",
    border: "1px solid currentColor",
    borderRadius: "0.5rem",
    color: "#333",
  },
})
```

#### Class prop

The `class` prop can be either a string of classes or an object of classes. For the object, the keys are the names of the classes to add and the values are booleans for toggling the classes.

<!-- prettier-ignore -->
```js
const variableProfileCardView = (user, useBorders, variant) =>
  h("section", {
    class: {
      box: true,
      disabled: user.role !== "admin",
      useBorders: userBorders,
      [variant]: !!variant
    },
  }, text(user.name))
```

## app()

```js
app({ init, view, node, subscriptions, middleware })
```

The app function is used to initialize and mount an hyperapp app.

There are 5 properties you can pass in to configure your app, all of which describe how your app will behave.

The first 3 options, init, view and node, are required. The last two, subscriptions and middleware, will depend on your use case.

```js
import { app } from "hyperapp";
// ...
app({
  init: InitialAction,
  view: View,
  node: document.getElementById("app"),
  subscriptions: (state) => [
    SomeSubscription
  ],
  middleware: dispatch => /* newDispatch */
});
```

#### init prop

[Action](#actions) to initialize the app.

This action is used to set the app's initial state and kickoff side-effects. Using the various types of [actions](#actions) that exists in hyperapp, you can do things like fetching initial data for your app or simply importing data and setting that as the initial state.

Simple `init` usage with pre-defined state.

```js
const initialState = {
  count: 0,
}
app({
  init: initialState,
  // ...
})
```

Complex `init` usage with a side-effect that fetches data.

```js
const initialState = {
  loaded: false
  items: []
}

const SetTodoItems = (state, items) => ({
  ...state,
  loaded: true,
  items
})

const InitialAction = [
  initialState,
  http({
    url: '/todo-items',
    action: SetTodoItems
  })
]

app({
  init: InitialAction,
  // ...
});
```

#### view prop

<!-- prettier-ignore -->
```js
(state) => virtualDOM
```

View function that returns a virtual DOM for a given state.

It maps your state to a UI that Hyperapp uses for rendering the app.

Every time the state of you application changes, this function will be called again to render the UI based on the new state, using the logic you've defined inside of it.

#### node prop

DOM element to render the virtual DOM on. Also known as the application container or the mount node.

Hyperapp supports hydration out of the box. This means that, if the mount node you specify is already populated with DOM elements, Hyperapp will recycle and use these existing elements instead of throwing them away and create them again. You can use this for doing SSR or pre-rendering of your applications, which will give you SEO and performance benifits.

#### subscriptions prop

```js
state => subscriptions[]
```

Function that returns an array of [subscriptions](#subscriptions) for a given state.

In a similar fashion to how the view function is used to dynamically add and remove DOM elements based on the state, this subscriptions function is used for dynamically adding and removing [subscriptions](#subscriptions) to the app.

#### middleware prop

<!-- prettier-ignore -->
```js
(dispatch) => newDispatch
```

Higher order functions that changes the `dispatch` that hyperapp will use. They are used for wrapping all actions that the app will dispatch with extended behavior.

## memo()

```js
memo(view, props)
```

`memo` is higher order function (wrapper function) to cache your view functions based on props you pass into them.

It's a helps you achieve a performance optimization technique commonly refered to as memoization.

Immutability in Hyperapp guarantees that if two things are referentially equal, they must be identical. This makes it safe for Hyperapp to only re-compute your memoized components when values passed through their props change.

- **render** - Function that returns a virtual DOM. _Must be a named function._
- **...props** - Props to pass down to the view function. The underlying view is re-computed when those change.

```js
import { memo } from "hyperapp"
import { pizzaView } from "./components/Pizzas"

const lazyPizzaView = (props) =>
  memo(pizzaView, {
    key: "pepperoni-motzart",
    pizzas: props.pizzas,
    expanded: true,
  })
```

## Actions

<!-- prettier-ignore -->
```js
(state, props?) => nextState
```

Functions that describe the transitions between the states of your app.

They are the only way to change the state of your Hyperapp app.

Actions are pure, deterministic functions that produce no side-effects and return the next state. They are dispatched by either DOM events in your app, [effects](#effects) or by [subscriptions](#subscriptions). They come in multiple forms:

#### Simple action: `state => nextState`

No parameters, next state is determined entirely on the previous state.

```js
// Simple action
const Increment = (state) => state + 1

// Usage in the view
h("button", { onclick: Increment }, text("+"))
```

#### Action with a payload: `(state, props) => nextState`

Action with parameters along with the previous state.

```js
// Complex action
const IncrementBy = (state, by) => state + by

// Usage in the view, using an "action tuple"
h("button", { onclick: [IncrementBy, 5] }, text("+5"))
```

#### Action with side-effects: `(state) => [nextState, ...effects]`

Action that returns [effects](#effects) to run along with the next state.

```js
import { Http } from "./fx"

// Action with HTTP side-effect
const GetPizzas = (state) => [
  state,
  Http({
    url: "/pizzas",
    action: SetPizzas,
  }),
]

// Usage in the view
h("button", { onclick: GetPizzas }, text("Get pizzas"))
```

Actions with side-effects can also take in props, just like a complex action. If so, it will be dispatched in the same way using an "action tuple".

## Effects

<!-- prettier-ignore -->
```js
[fx, props]
```

Tuples that describe a side-effect that needs to run.

Effects are only descriptions of work that needs to be executed, they do not do any side-effects themselves. This allows your application to remain pure while also interacting with the outside world.

- **fx** - Effect runner.
- **props** Data to be passed to the effect runner.

#### Effect function `(dispatch, props) => void`

Encapsulates the implementation of side effects to run outside of hyperapp and can dispatch an [action](#actions) when it completes.

```js
// Effect runner
const httpFx = (dispatch, props) => {
  // Do side effects
  fetch(props.url, props.options)
    .then((res) => res.json())
    .then((data) => dispatch(data)) // Optionally dispatch an action
}

// Helper to easily create the effect tuple for the Http effect
const http = (props) => [httpFx, props]

// Usage of the effect in an action
const GetPizzas = (state) => [
  state,
  http({
    url: "/pizzas",
    action: SetPizzas,
  }),
  // Could add more effects here...
]

// Usage of the "action with side-effect" in the view
h("button", { onclick: GetPizzas }, text("Get pizzas"))
```

## Subscriptions

<!-- prettier-ignore -->
```js
[sub, props]
```

Tuples that describe the bindings between your app and external events.

They allow you to dispatch [actions](#actions) based on external events, such as websockets, keystrokes or any other events outside hyperapp using a declarative API instead of an event-driven one.

They are used for both adding and removing connections to events outside hyperapp.

- **sub** - Subscription configurator.
- **props** - Data to be passed to the configurator.

#### Subscription function `(dispatch, props) => cleanupFunction`

Binds **dispatch** to an external event. Returns a cleanup function that removes the binding.

```js
const keySub = (dispatch, props) => {
  // Hook up dispatch to external events
  const handler = (ev) => {
    if (props.keys.includes(ev.key)) {
      dispatch([props.action, ev.key])
    }
  }
  window.addEventListener("keydown", handler)

  // Cleanup function
  return () => window.removeEventListener("keydown", handler)
}

// Helper to easily create the subscription tuple
const key = (props) => [keySub, props]

// Usage in app
app({
  // ...
  subscriptions: (state) => [
    key({
      keys: ["w", "a", "s", "d"],
      action: ChangeDirection,
    }),
  ],
})
```
