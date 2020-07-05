# API reference

### Overview of hyperapp's core APIs

Below is a consice recap of hyperapp's core APIs, packed with information about the framework.

It's geared towards developers who already have some level of understanding on what hyperapp is and want to see documentation for it's concepts.

- [`h()`](#h)
  - [on<i>event</i>](#onevent-props)
  - [key](#key-prop)
  - [style](#style-prop)
  - [class](#class-prop)
- [`app()`](#app)
  - [init](#init-prop)
  - [view](#view-prop)
  - [subscriptions](#subscriptions-prop)
  - [node](#node-prop)
  - [middleware](#middleware-prop)
- [`Lazy()`](#lazy)
- [actions](#actions)
  - [Simple](#simple-action-state--nextstate)
  - [Complex](#complex-action-state-params--nextstate)
  - [With side-effects](#action-with-side-effects-state--nextstate-effects)
- [effects](#effects)
- [subscriptions](#subscriptions)

## h()

```javascript
h(type, props, ...children);
```

Hyperscript function to create virtual DOM nodes (VNodes), which are used for [rendering](#rendering).

A VNode is a simplified representation of an HTML element. It represents an element you want to see on the screen in your app. Unlike real DOM nodes, VNodes are cheap to create and easy for the CPU to work with.

- **type** - Name of the node, eg: div, h1, button, etc.
- **props** - Object containing HTML or SVG attributes the DOM node will have and [special props](#special-props).
- **children** - Array of child VNodes.

```javascript
import { h } from "hyperapp";

const Box = ({ showGreeting = false }) =>
  h("div", { id: "box" }, [
    h("h1", {}, "Hello!"),
    showGreeting && h("p", {}, "Nice to see you."),
  ]);
```

A tree of VNodes is achieved using the `children` parameter on the `h` function. This tree is called a virtual DOM.

This is what the virtual DOM returned by the `Box` function above looks like, abridged for clarity.

```javascript
// Box({ showGreeting: true }) or <Box showGreeting={true} />
// =>
{
  name: "div",
  props: {
    id: "box"
  },
  children: [
    {
      name: "h1",
      props: {},
      children: ["Hello!"]
    },
    {
      name: "p",
      props: {},
      children: ["Nice to see you."]
    },
  ]
}
```

which hyperapp renders to:

```html
<div id="box">
  <h1>Hello!</h1>
  <p>Nice to see you.</p>
</div>
```

In hyperapp, because you are using javascript to represent the DOM of your application, you can use it's full power to dynamically render elements to the screen. Here's an example for doing conditionnal rendering in hyperapp:

```javascript
const AccordionComponent = ({ title, description, isOpened }) => (
  <div class="accordion">
    <h4>{title}</h4>
    <button>{isOpened ? "Expand" : "Collapse"}</button>
    {isOpened && <p>{description}</p>}
  </div>
);
```

### Special props

#### On<i>event</i> props

<code><a href="https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers" target="_blank">on<i>event</i></a></code> props such as onclick, onsubmit, onblur, etc. dispatch [actions](#actions) directly to hyperapp. In the action tuple, the second element can be a function that processes the events before passing the params to the action.

```javascript
<input
  name="amount"
  type="number"
  onchange={[SetAmount, (ev) => parseInt(ev.target.value)]}
/>
```

#### Key prop

The `key` is a unique string per VNode that help hyperapp track if VNodes are changed, added or removed in situations where it can't, such as in arrays.

```javascript
const Items = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>{item.text}</li>
    ))}
  </ul>
);
```

#### Style prop

The `style` prop can be either a string of CSS or an object of styles

```javascript
<div
  style={{
    padding: "1rem",
    border: "1px solid currentColor",
    borderRadius: "0.5rem",
    color: "#333",
  }}
>
  Hello!
</div>
```

#### Class prop

The `class` prop can be either a string of classes or an object of classes. For the object, the keys are the names of the classes to add and the values are booleans for toggling the classes.

```javascript
const VariableProfileBox = ({ user, useBorders, variant }) => (
  <div
    class={{
      box: true,
      disabled: user.role !== "admin",
      ["has-borders"]: useBorders,
      [variant]: !!variant,
    }}
  >
    {user.name}
  </div>
);
```

## app()

```javascript
app({ init, view, node, subscriptions, middleware });
```

The app function is used to initialize and mount an hyperapp app.

There are 5 properties you can pass in to configure your app, all of which describe how your app will behave.

The first 3 options, init, view and node, are required. The last two, subscriptions and middleware, will depend on your use case.

```javascript
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

```javascript
const initialState = {
  count: 0,
};
app({
  init: initialState,
  // ...
});
```

Complex `init` usage with a side-effect that fetches data.

```javascript
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
  Http({
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

```javascript
(state) => virtualDOM;
```

View function that returns a virtual DOM for a given state.

It maps your state to a UI that hyperapp uses for rendering the app.

Every time the state of you application changes, this function will be called again to render the UI based on the new state, using the logic you've defined inside of it.

#### node prop

DOM element to render the virtual DOM on. Also known as the application container or the mount node.

Hyperapp supports hydration out of the box. This means that, if the mount node you specify is already populated with DOM elements, hyperapp will recycle and use these existing elements instead of throwing them away and create them again. You can use this for doing SSR or pre-rendering of your applications, which will give you SEO and performance benifits.

#### subscriptions prop

```javascript
state => subscriptions[]
```

Function that returns an array of [subscriptions](#subscriptions) for a given state.

In a similar fashion to how the view function is used to dynamically add and remove DOM elements based on the state, this subscriptions function is used for dynamically adding and removing [subscriptions](#subscriptions) to the app.

#### middleware prop

```javascript
(dispatch) => newDispatch;
```

Higher order functions that changes the `dispatch` that hyperapp will use. They are used for wrapping all actions that the app will dispatch with extended behavior.

## Lazy()

```javascript
Lazy({ render, ...props });
```

Lazy is higher order function (wrapper function) to cache your view functions based on props you pass into them.

It's a helps you achieve a performance optimization technique commonly refered to as memoization.

Immutability in hyperapp guarantees that if two things are referentially equal, they must be identical. This makes it safe for hyperapp to only re-compute your Lazy components when values passed through their props change.

- **render** - Function that returns a virtual DOM. _Must be a named function._
- **...props** - Props to pass down to the view function. The underlying view is re-computed when those change.

```javascript
import { Lazy } from "hyperapp";
import { Pizzas } from "./components/Pizzas";

const LazyFoo = (props) =>
  Lazy({
    render: Pizzas,
    key: "unique-key", // Make sure the lazy component itself doesn't re-render
    pizzas: props.pizzas,
    expanded: true,
  });
```

## actions

```javascript
(state, params?) => nextState;
```

Functions that describe the transitions between the states of your app.

They are the only way to change the state of your Hyperapp app.

Actions are pure, deterministic functions that produce no side-effects and return the next state. They are dispatched by either DOM events in your app, [effects](#effects) or by [subscriptions](#subscriptions). They come in multiple forms:

#### Simple action: `state => nextState`

No parameters, next state is determined entirely on the previous state.

```javascript
// Simple action
const Increment = (state) => state + 1

// Usage in the view
<button onclick={Increment}>+</button>
```

#### Complex action: `(state, params) => nextState`

Action with parameters along with the previous state.

```javascript
// Complex action
const IncrementBy = (state, by) => state + by

// Usage in the view, using an "action tuple"
<button onclick={[IncrementBy, 5]}>+5</button>
```

#### Action with side-effects: `(state) => [nextState, ...effects]`

Action that returns [effects](#effects) to run along with the next state.

```javascript
import { Http } from './fx'

// Action with HTTP side-effect
const GetPizzas = (state) => [
  state,
  Http({
    url: '/pizzas',
    action: SetPizzas
  })
]

// Usage in the view
<button onclick={GetPizzas}>Get pizzas</button>
```

Actions with side-effects can also take in params, just like a complex action. If so, it will be dispatched in the same way using an "action tuple".

## effects

```javascript
[fx, params];
```

Tuples that describe a side-effect that needs to run.

Effects are only descriptions of work that needs to be executed, they do not do any side-effects themselves. This allows your application to remain pure while also interacting with the outside world.

- **fx** - Effect runner.
- **params** Data to be passed to the effect runner.

#### Effect runner `(dispatch, params) => void`

Encapsulates the implementation of side effects to run outside of hyperapp and can dispatch an [action](#actions) when it completes.

```javascript
// Effect runner
const httpFx = (dispatch, params) => {
  // Do side effects
  fetch(params.url, params.options)
    .then(res => res.json())
    .then(data => dispatch(data)) // Optionnally dispatch an action
}

// Helper to easily create the effect tuple for the Http effect
const Http = params => [httpFx, params]

// Usage of the effect in an action
const GetPizzas = (state) => [
  state,
  Http({
    url: '/pizzas',
    action: SetPizzas
  })
  // Could add more effects here...
]

// Usage of the "action with side-effect" in the view
<button onclick={GetPizzas}>Get pizzas</button>
```

## subscriptions

```javascript
[sub, params];
```

Tuples that describe the bindings between your app and external events.

They allow you to dispatch [actions](#actions) based on external events, such as websockets, keystrokes or any other events outside hyperapp using a declarative API instead of an event-driven one.

They are used for both adding and removing connections to events outside hyperapp.

- **sub** - Subscription configurator.
- **params** - Data to be passed to the configurator.

#### Subscription configurator `(dispatch, params) => cleanupFunction`

Binds **dispatch** to an external event. Returns a cleanup function that removes the binding.

```javascript
// Subscription configurator
const keySub = (dispatch, params) => {
  // Hook up dispatch to external events
  const handler = (ev) => {
    if (params.keys.includes(ev.key)) {
      dispatch([params.action, ev.key]);
    }
  };
  window.addEventListener("keydown", handler);

  // Cleanup function
  return () => window.removeEventListener("keydown", handler);
};

// Helper to easily create the subscription tuple
const Key = (params) => [keySub, params];

// Usage in app
app({
  // ...
  subscriptions: (state) => [
    Key({
      keys: ["w", "a", "s", "d"],
      action: ChangeDirection,
    }),
  ],
});
```
