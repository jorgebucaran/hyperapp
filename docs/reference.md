> # Reference
>
> Below is a concise recap of Hyperapp’s core APIs and concepts. It’s geared towards developers who already have some familiarity with Hyperapp and want to look up something quickly. If you’re just getting started, we recommend [working through the tutorial](tutorial.md) first.
>
> - [API Functions](#api-functions)
>   - [`h( tag, props, children )`](#h-tag-props-children-) 
>     The hyperscript function that creates a virtual DOM node (hierarchy).
>     - [Special properties](#special-properties)
>       - [`key` property](#key-property)
>       - [`style` property](#style-property)
>       - [`class` property](#class-property)
>       - [`onxyz` event listeners](#onxyz-event-listeners)
>   - [`text( string )`](#text-string-) 
>     Function that creates a virtual text node
>   - [`app( {init, view, node, subscriptions?, dispatch?} )`](#app--init-view-node-subscriptions-dispatch--) 
>     Function that initializes and mounts a Hyperapp app.
>     - [Input properties](#input-properties)
>       - [`init` property](#init-property)
>       - [`view` property](#view-property)
>       - [`subscriptions` property](#subscriptions-property)
>       - [`node` property](#node-property)
>       - [`dispatch` property](#dispatch-property)
>     - [Return value: The `dispatch` function](#return-value-the-dispatch-function)
>   - [`memo( view, props )`](#memo-view-props-)
>     Function that helps with performance optimization.
> - [Core Concepts and Architecture](#core-concepts-and-architecture)
>   - [App](#app)
>   - [State](#state)
>   - [View](#view)
>     - [Sub view / Component](#sub-view--component)
>     - [Recommendation for naming sub views / components](#recommendation-for-naming-sub-views--components)
>   - [Action](#action)
>     - [Plain action](#plain-action)
>     - [Action with payload](#action-with-payload)
>     - [Action with an event object as payload](#action-with-an-event-object-as-payload)
>     - [Action with side-effects](#action-with-side-effects)
>     - [Action wrapping another action](#action-wrapping-another-action)
>     - [Recommendation for naming actions](#recommendation-for-naming-actions)
>   - [Effect](#effect)
>     - [Effect runner function](#effect-runner-function)
>     - [Effect creator functions](#effect-creator-functions)
>     - [Recommendation for naming effects](#recommendation-for-naming-effects)
>   - [Subscription](#subscription)
>     - [Subscription configurator function](#subscription-configurator-function)
>     - [Subscription creator functions](#subscription-creator-functions)
>     - [Recommendation for naming subscriptions](#recommendation-for-naming-subscriptions)




# API Functions



## h( tag, props, children )

```elm
h : (String, Object, VNode | [...VNodes]) -> VirtualDOM
```

> **Short description:** Function that creates a virtual DOM node (VNode). A single VNode or a hierarchy of nested VNodes are used for rendering the [view](#view-property).

A VNode is a simplified representation of an HTML element. It represents an element you want to see on the screen in your app. Unlike real DOM nodes, VNodes are cheap to create and easy for the CPU to work with.

- **tag** - Name of the node, eg: `"div"`, `"h1"`, `"button"`, etc.
- **props** - Object containing HTML or SVG attributes the DOM node will have and [special properties](#special-properties).
- **children** - Array of child VNodes or single VNode child. VNodes can also be VTextNodes, but never strings directly, see [`text( string )`](#text-string-).

```js
import { h, text } from "hyperapp"

const boxView = ({ showGreeting = false }) =>
  h("div", { id: "box" }, [
    h("h1", {}, text("Hello!")),
    showGreeting && h("p", {}, text("Nice to see you.")),
  ])
```

In Hyperapp, because you are using Javascript to represent the DOM of your application, you can use its full power to dynamically render elements to the screen. Here’s an example for doing conditional rendering in Hyperapp: 

```js
const accordionView = (title, description, isOpened) =>
  h("section", { class: "accordion" }, [
    h("h4", {}, text(title)),
    h("button", {}, text(isOpened ? "Expand" : "Collapse")),
    isOpened && h("p", {}, text("description")), // <-- conditional rendering
  ])
```



### Special properties



#### `key` property

```elm
key : String
```

The `key` is a unique string per VNode that helps Hyperapp track if VNodes are changed, added or removed in situations where it can’t, such as in arrays.

```js
const itemsView = (items) =>
  h("ul", {}, 
    items.map((item) => 
      h("li", { 
        key: item.id // <-- unique identifier
      }, text(item.text))
    ),
  )
```



#### `style` property

```elm
style : StyleObject
```

The `style` property must be an object of styles, whose keys can be either written in *lowerCamelCase* (aka *dromedaryCase*), in *kebab-case* within *quotes*, or if using CSS custom properties (alias CSS variables) as a *custom property name* within *quotes*.

```js
h("section", {
  style: {
    padding: "1rem",
    border: "1px solid currentColor",
    borderRadius: "0.5rem",     // <-- dromedaryCase
    "background-color": "#333", // <-- quoted kebab-case
    "--foreground": "#f48",     // <-- CSS custom property
  },
})
```

A CSS string as the value of `style`, e.g. `"padding: 1rem; border: 1px solid currentColor;"` is not supported. But you can pass a CSS string as `cssText` inside `style` (and even mix it with additional styles).

```js
h("section", {
  style: {
    cssText: "padding: 1rem; border: 1px solid currentColor; border-radius: 0.5rem",
    backgroundColor: state.emphasized ? "deeppink" : "slategrey",
  },
})
```



#### `class` property

```elm
class : String | Object
```

The `class` property can be either a string of (space-delimited) class names or an object of classes. For the object, the keys are the class names to add and the values are Booleans for toggling the classes.

```js
const variableProfileCardView = (user, useBorders, variant) =>
  h("section", {
    class: {
      box: true,
      disabled: user.role !== "admin",
      useBorders,
      [variant]: !!variant,
    },
  }, [
    h("div", {
      class: "box__user is-" + user.role,
    }, text(user.name))
  ])
```



#### `onxyz` event listeners

```elm
onxyz : Action
```

Event listeners such as `onclick` or `oninput` are the interface of Hyperapp to the user. They are assigned to VNodes as a property whose value is an [action](#action).



## text( string )

```elm
text : String -> VTextNode
```

> **Short description:** Function that creates a virtual text node.

Unlike with other hyperscript syntaxes, the [`h(type, props, children)`](#h-type-props-children) hyperscript function can only handle VNodes or VTextNodes as children. Thus you must use `text("Some string")` to represent a text node. In other words: ~~`h("span", {}, "Some string")`~~ is *invalid*, whereas `h("span", {}, text("Some string"))` is correct and required in this way.

```js
app({
  view: () => text("Think different."),
  node: document.getElementById("app"),
})
```



## app( { init, view, node, subscriptions?, dispatch? } )

```elm
app : { 
	init: Action | Object | String | Number | Boolean | undefined | null, 
	view: ViewFn, 
	node: HTMLElement, 
	subscriptions?: SubsFn, 
	dispatch?: DispatchHOFn 
} -> DispatchFn 
```

> **Short description:** Function that initializes and mounts a Hyperapp app.

There are five properties you can pass in to configure your app, all of which describe how your app will behave.

The first three options, [`init`](#init-property), [`view`](#view-property), and [`node`](#node-property), are required. The last two,  [`subscriptions`](#subscriptions-property) and [`dispatch`](#dispatch-property), will depend on your use case.

```js
import { app } from "hyperapp";
// ...
app({
  init: InitialAction,
  view: ViewFn,
  node: document.getElementById("app"),
  subscriptions: (state) => [/* ...someSubscriptions */],
  dispatch: (dispatch) => /* newDispatchFn */
});
```



### Input Properties



#### `init` property

```elm
init : Action | Object | String | Number | Boolean | undefined | null
```

> **Short description:** [Action](#action) (or an object, or a value of a primitive data type like string, number, Boolean, undefined or null) to initialize the app.

This property is used to set the app’s initial state and optionally kick off side-effects. Using the various types of [actions](#action) that exists in Hyperapp, you can do things like fetching initial data for your app or simply importing data and setting that as the initial state. Alternatively you can initialize the app with an object or a value of a primitive data type as the pre-defined state.

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
  loaded: false,
  items: [],
}

const SetTodoItems = (state, items) => ({
  ...state,
  loaded: true,
  items,
})

const InitialAction = [
  initialState,
  http({
    url: "/todo-items",
    action: SetTodoItems,
  })
]

app({
  init: InitialAction,
  // ...
});
```



#### `view` property

```elm
view : State -> VirtualDOM
```

> **Short description:** View function that returns a virtual DOM for a given state.

It maps your state to a UI that Hyperapp uses for rendering the app.

Every time the state of your application changes, this function will be called again to render the UI based on the new state, using the logic you’ve defined inside of it.

```js
app({
  init: { headline: "Welcome!" },
  // ...
  view: (state) => h('h1', {}, text(state.headline)),
})
```



#### `node` property

```elm
node : HTMLElement
```

> **Short description:** DOM element to render the virtual DOM on. Also known as the application container or the mount node.

Hyperapp supports hydration out of the box. This means that, if the mount node you specify is already populated with DOM elements, Hyperapp will recycle and use these existing elements instead of throwing them away and create them again. You can use this for doing SSR or pre-rendering of your applications, which will give you SEO and performance benefits.

```js
app({
  init: { headline: "Welcome!" },
  view: (state) => 
    h("body", { 
      class: "is-started" 
    }, [
      h("h1", {}, text(state.headline)),
      h("main", {}, [/* ... */]),
    ]),
  node: document.body,  // <-- the document's body is the app's mount node
})
```

```html
<!doctype html>
<html>
  <head><!-- ... --></head>
  <body class="is-starting">
    <h1>Starting...</h1>
  </body>
</html>
```

In the above example the <body> element will be preserved, but its `class` attribute will have a new value (to `"is-started"`). Furthermore, the `<h1>` element will be preserved, but its text content replaced (to `Welcome!`). Finally, the `<main>` element including its children is added as a new element.



#### `subscriptions` property

```elm
subscriptions: State -> [...Subscriptions]
```

> **Short description:** Function that returns an array of [subscriptions](#subscription) for a given [state](#state).

In a similar fashion to how the view function is used to dynamically add and remove DOM elements based on the state, this function is used for dynamically adding and removing [subscriptions](#subscription) to the app.



#### `dispatch` property

```elm
dispatch : DispatchFn -> (Action, Props) -> void
```

> **Short description:** Higher order function that changes the `dispatch` function that Hyperapp will use. 

This property can be used to wrap all actions that the app will dispatch with extended behavior. If for example you want to log actions that are dispatched by the app to the console, you can do this:

```js
app({
  // ...
  dispatch: (dispatch) => (action, props) => {
    if (typeof action === "function" ) {
			console.log({
        action: action.name || action,
				...(
					props === undefined	
						? {}
						: props instanceof Event 
						? { event: props }
						: { payload: props }
				)
      })
    }
    dispatch(action, props)  // <-- don't forget to still dispatch the action
  }
})
```





### Return value: The `dispatch` function

The `app` function exposes the `dispatch` function that is used by Hyperapp internally as a return value.

Having this function available outside the app lets you dispatch anything from the outside into the app. Thus you could control the app *remotely* – for instance from a legacy app, or between Hyperapps.  But keep in mind that a Hyperapp app should rather react to events of the outside world through [`subscriptions`](#subscription), which is better with regards to separation of concerns.

Another use case could be console debugging, where you’d use the `dispatch` function from the console to just set the state and check live what happens.

Yet another use case is halting the app and freeze it in its last used state. If you dispatch nothing – like `dispatch(/* empty */)` –  the app stops (because that is basically saying “set the state to `undefined`”). Stopping an app means two things: all subscriptions are stopped, and `dispatch`  stops working forever. The DOM is not touched, so the app with its last state will remain visible, with event listeners still attached. But since dispatch is disabled, they will not do anything. What remains of your app in the DOM is effectively a “corpse”.



## memo( view, props )

```elm
memo : (ViewFn, Object) -> MemoizedVNode
```

> **Short description:** Higher order function (wrapper function) to cache your view functions based on props you pass into them.

It helps you achieve a performance optimization technique commonly refered to as memoization.

Immutability in Hyperapp guarantees that if two things are referentially equal, they must be identical. This makes it safe for Hyperapp to only re-compute your memoized components when values passed through their props change.

- `view` - Function that returns a virtual DOM. _Must be a named function._
- `props` - Properties to pass down to the view function. The underlying view is re-computed when those change.

```js
import { memo } from "hyperapp"
import { pizzaView } from "./components/Pizzas"

const lazyPizzaView = (props) =>
  memo(pizzaView, {
    pizzas: props.pizzas,
    expanded: props.expanded,
  })

app({
  init: { 
    menu: { pizzas: [/* ... */], /* ... */ }, 
    expanded: { pizzas: false, /* ... */ } 
  },
  view: (state) => h("div", {}, [
    // ...
    lazyPizzaView({ pizzas: state.pizzas, expanded: state.expanded.pizzas }),
    // ...
  ])
})
```



---



# Core Concepts and Architecture

The conceptual parts of Hyperapp are described by the notions of [*app*](#app), [*state*](#state), [*view*](#view), [*action*](#action), [*effect*](#effect), and [*subscription*](#subscription). 



## App
```elm
App : ({ InitialState, View, MountNode, Subscriptions?, DispatchHOFn? }) -> DispatchFn
```

> **Definition:** A system that is in one of a finite number of states, each manifested and represented by a view, and whose changes of state are triggered by internal and external events.

A Hyperapp *app* is the implementation of the *finite state machine* (FSM) concept that is based on a mathematical model of computation. It is a closed system that can be in exactly one of a finite number of states at any given time. It changes from one state to another in response to both internal and external events (or inputs). In Hyperapp the [state](#state) transitions are called [actions](#action). The current state is presented to the user as DOM through the [view](#view). The [event listeners](#onxyz-event-listeners) attached to nodes in the view handle the app-internal events triggered by the user on that particular node, whereas [subscriptions](#subscription) let the app react on external events that not necessarily are directly triggered by the user's behavior (like moving the mouse, typing on the keyboard), but also by for instance changes to the browser's connection/online state, or by Web Sockets messages. All these events can cause state transitions described by actions. Sometimes actions spawn (or simply *have*) side-[effects](#effect).

To start the app, it needs an initial state or an action that sets it, the description of the [view](#view) and a DOM node to mount the view to.

For stopping the app (if needed), Hyperapp exposes its [`dispatch`](#return-value-the-dispatch-function) function, which when called without arguments, or with an action that returns nothing (that is `undefined`), will halt the app and render it inert to internal and external events.



---



## State

```elm
State : Object | Array | String | Number | Boolean | undefined | null
```

> **Definition:** An object (or a primitive value) that describes a snapshot of the internal data of your app.

States in Hyperapp are global to the app and describe the *status* of the Hyperapp app, waiting for an [action](#action) to change its state to another one. A state can be represented by a data object (most common) or a primitive value (for simple applications). Although arrays are not disallowed as direct state values, their handling is somewhat cumbersome (due to the fact that Hyperapp uses arrays as effect tuples and some action forms), their usage is discouraged.




---



## View

```elm
View : State -> VirtualDOM
```

> **Definition:** A function that creates a tree of virtual DOM nodes for a given state.

A description of how Hyperapp should render the app for any given state is done by composing a tree of virtual DOM nodes (VNodes) using hyperscript function calls (see [`h( tag, props, children )`](#h-tag-props-children-) and [`text( string )`](#text-string-)) and using the data of the (current) state to not only use the values for attributes and texts, but also to conditionally branch or loop over lists.



### Sub view / Component

```elm
SubView : State | Props -> VirtualDOM
```

Views can be further composed of sub views (or “view parts” or “components”) that typically encapsulate recurring DOM patterns and/or are imported from elsewhere. Their signature follows the same pattern as the view, but instead of the whole global state it can take a subset of properties, too.



### Recommendation for naming sub views / components

Use a noun written in *UpperCamelCase* that best describes the purpose or type of the component, for instance  `Sidebar`, `Header`, `ProductCard`.



---



## Action

> **Definition:** A function that describes the transition between one state of your app to another.

Actions are the only way to change the state of your Hyperapp app.

Actions are pure, deterministic functions that produce no side-effects and return the next state. They are dispatched by either DOM events in your app, by [effects](#effect) or by [subscriptions](#subscription). They come in multiple forms:



### Plain action

```elm
PlainAction : State -> NextState
```

A plain action only takes the (previous) state as parameter, the next state is determined entirely on the previous state.

```js
// Plain action
const Increment = (state) => state + 1  // <-- declaration

// Usage in the view
app({
  // ...
  view: (state) =>
	  h("button", { 
      onclick: Increment,  // <-- usage 
    }, text("+")),
})

```



### Action with payload

```elm
ActionWithPayload : (State, Payload) -> NextState

Payload : Object | Array | String | Number | Boolean | undefined | null
```

This form takes one additional parameter as the payload along with the previous state. The previous state together with the payload are used to transition to the next state. The action function reference and the payload that the function is called with are usually attached as a tuple to an event handler in the view.

```js
// Action with payload
const IncrementBy = (state, by) => state + by  // <-- declaration

// Usage in the view, using an "action tuple"
app({
  // ...
  view: (state) =>
    h("button", { 
      onclick: [IncrementBy, 5],  // <-- usage
    }, text("+5")),
})
```



### Action with an event object as payload 

```elm
ActionWithEvent -> (State, Event) -> NextState
```

This form takes the event object as the second parameter along with the previous state, and returns the next state. This form is directly attached to an event handler in the view. When the event is triggered, the event object is passed to the action.

```js
// Action with event object as payload
const Input = (state, event) => ({ ...state, value: event.target.value })  // <-- declaration

// Usage in the view
app({
  // ...
  view: (state) =>
    h("input", { 
      value: state.value, 
      oninput: Input,  // <-- usage
    }),
})
```



### Action with side-effects

```elm
ActionWithSideEffects : (State, PayloadOrEvent?) -> [NextState, ...Effects]
```

This action form returns one or multiple [effects](#effect) to run along with the next state. An effect in turn may dispatch one or multiple actions.

```js
import { http } from "./fx"

// Action with HTTP side-effect
const GetPizzas = (state) => [
  state,                   // <-- (previous) state
  http({                   // <-- effect
    url: "/pizzas",
    action: SetPizzas,     // <-- action for next state after effect completion
  }),
]

// Usage in the view
app({
  // ...
  view: (state) =>
    h("button", { 
      onclick: GetPizzas,  // <-- usage 
    }, text("Get pizzas")),
})
```

Actions with side-effects can also take in payload data or an event object, just like the previous two action forms. If so, such an action will be dispatched in the same way using an “action tuple”.



### Action wrapping another action

```elm
ActionWrappingOtherAction : (State?, PayloadOrEvent?) -> OtherAction | [OtherAction, ...Effects]
```

Instead of returning just a next state (with or without side-effects), an action can also return and thus wrap or alias another action.

```js
// Action with payload (partially derived from event object)
const ToggleVisibility = (state, { name, checked }) => ({ ...state, [name]: checked })

// Usage in the view
app({
  // ...
  view: (state) => h("form", {}, [
    h("label", {}, [
      text("Show appetizers"),
      h("input", { 
        type: "checkbox", 
        onclick: (state, event) => [        // <-- "outer" action
          ToggleVisibility,                 // <-- nested action instead of next state
          { 
            name: "appetizers",             // <-- direct payload
            checked: event.target.checked,  // <-- payload derived from event object
          },
        ] 
      }),
    ]),
    h("label", {}, [
      text("Show deserts"),
      h("input", { 
        type: "checkbox", 
        onclick: (state, event) => [ToggleVisibility, { name: "deserts", checked: event.target.checked }] 
      }),
    ]),
    // ...
  ])
})
```

One use case is when the wrapped action takes data from both payload data and the event object. 



### Recommendation for naming actions

We recommend using names for actions written in *UpperCamelCase* (aka *PascalCase*) to better reflect the nature of actions. An action shouldn't be regarded as a function that *executes* something rather than that it *describes a transition* from one state to another. 

It is further advisable to use either the imperative form of a verb, like `IncrementBy`, `ToggleVisibility`,  `GetPizzas` or `SaveAddress` (in general, but especially when the action also triggers side-effects), or the passed tense form of a verb (when the action is used for a state transition at the end of a side-effect operation, like `GotData`, `StoppedCounting`), to better distinguish them from [sub views / components](#sub-view-component) that are also written in UpperCamelCase, but use nouns for names (like e.g. `Toolbar`, `Footer`, `ContentBox`).



---



## Effect


```elm
Effect : [EffectFn, Payload]
```

> **Definition:** A tuple which describes a side-effect that needs to run.

Effects are only descriptions of work which needs to be executed, they do not do any side-effects themselves. This allows your application to remain pure while also interacting with the outside world.

The effect tuple's first and second items are:

- The [effect runner function](#effect-runner-function).
  ```elm
  EffectFn : (DispatchFn?, Payload?) -> void
  ```


- The data to be passed to the effect runner.
  ```elm
  Payload : Object | String | Number | Boolean | undefined | null
  ```



### Effect runner function

```elm
EffectFn : (DispatchFn?, Payload?) -> void
```

> Encapsulates the implementation of side effects to run outside of hyperapp and can dispatch an [action](#action) (or a new state) when it completes.

An effect runner function takes the `dispatch` function as the first argument – even if the `dispatch` function isn’t used to transition to a next state (usually on completion of the effect) –, and optional data as the second argument.

```js
// Effect runner
const httpFx = (dispatch, props) => {
  // Do side effects
  fetch(props.url, props.options)
    .then((res) => res.json())
    .then((data) => dispatch(props.action)) // Optionally dispatch an action
}

// Helper to easily create the effect tuple for the http effect
const http = (props) => [httpFx, props]

// Usage of the effect in an action
const GetPizzas = (state) => [
  state,
  http({                       // <-- usage
    url: "/pizzas",
    action: SetPizzas,
  }),
  // Could add more effects here...
]

// Usage of the "action with side-effect" in the view
app({
  // ...
  view: (state) =>
  	// ...
	  h("button", { onclick: GetPizzas }, text("Get pizzas"))
})

```



### Effect creator functions

For more convenience and better reuse you would want to not declare and define effects with their runner function and payload manually in a tuple. Instead we encourage you to use effect *creator* functions. An effect creator function is a function that returns an effect tuple. 

```elm
EffectCreatorFn : Payload -> [EffectFn, Payload]
```

Those creator functions are typically used in the (list of) side-effect(s) of actions.

```js
const logFx = (dispatch, text) => {
  console.log(text)
}
const log = text => [logFx, text]

const saveFx = (dispatch, [id, data]) => {
  fetch("/" + id, { method: POST, body: JSON.stringify(data) })
    .then((response) => {
			if (response.ok) {
        dispatch((state) => [{ ...state, saving: false }, log("done")])
      } else {
        dispatch((state) => [{ ...state, error: response.status }, log("error")])
      }
    })
}
const save = (id, data) => [saveFx, [id, data]]

const Save = (state) => [
  { ...state, saving: true },
  log("saving"),
  save(state.id, state.data),
]
```

It is advisable to generalize the effect creators as much as possible. The example above for instance handles IO very specifically. There it’d be better to use a generic creator that handles IO and reuse it throughout the app, and even for different apps. One possible pattern for a generic creator function is:

```elm
GenericEffectCreatorFn : EffectFn -> Payload -> [EffectFn, Payload]
```

And a sample usage is:

```js
// Generic effect creator
const fx = (effect) => (props) => [effect, props]

// Effect creator using effect runner
const io = fx((dispatch, props) => {
  fetch(props.url, props.options)
  	.then((response) => {
      if (response.ok) {
        return response[props.type || "text"]
      }
    	throw new Error("Error requesting " + props.url)
  	})
  	.then((data) => dispatch(props.onsuccess, data))
  	.catch((error) => dispatch(props.onerror, error))
})

// Effects
const uploadToDB = (data) => io({ 
  url: "/upload", 
  options: { 
    method: "POST", 
    body: JSON.stringify(data),
  },
  onsuccess: (state) => ({ ...state, saving: false }),
  onerror: (state, error) => ({ ...state, saving: false, error }),
})
const fetchFromDB = () => io({ 
  url: "/fetch", 
  type: "json",
  onsuccess: (state, data) => ({ ...state, reading: false, data }),
  onerror: (state, error) => ({ ...state, reading: false, error }),
})

// Actions
const SaveData = (state, data) => [{ ...state, saving: true }, uploadToDB(data)]
const ReadData = (state) => [{ ...state, reading: true }, fetchFromDB()]

// View
h("button", { onclick: SaveData }, text("Save"))
h("button", { onclick: ReadData }, text("Read"))
```



### Recommendation for naming effects

We recommend chosing the imperative form of verbs written in *lowerCamelCase* for effects to reflect that they actually *do something* as a side-effect of a state transition (alias [action](#action)). It is best to shortly describe the side-effect operation, like `uploadToDB` rather than just `upload`.



---



## Subscription


```elm
Subscription : [SubscriptionFn, Payload]
```

> **Definition:** A tuple that describes the bindings between your app and external events.

Subscriptions allow you to dispatch [actions](#action) based on external events, such as websockets, keystrokes or any other events outside Hyperapp using a declarative API instead of an event-driven one.

They are used for both adding and removing connections to events outside Hyperapp.

- Subscription configurator function.

  ```elm
  SubscriptionFn : (DispatchFn?, Payload?) -> CleanupFn
  ```

- Data to be passed to the configurator.
  ```elm
  Payload : Object | String | Number | Boolean | undefined | null
  ```



### Subscription configurator function

```elm
SubscriptionFn : (DispatchFn?, Payload?) -> CleanupFn
```

> Binds a `dispatch` function to an external event. Returns a cleanup function that removes the binding.

Like with [effect runners](#effect-runner-function), a subscription generator also takes a `dispatch` function as the first argument, and payload as the second argument.

```js
const keySub = (dispatch, props) => {
  // Hook up dispatch to external events
  const handler = (event) => {
    if (props.keys.includes(event.key)) {
      dispatch([props.action, event.key])
    }
  }
  window.addEventListener("keydown", handler)

  // Cleanup function
  return () => window.removeEventListener("keydown", handler)
}

// Helper to easily create the subscription tuple
const onKey = (props) => [keySub, props]

// Usage in app
app({
  // ...
  subscriptions: (state) => [
    onKey({
      keys: ["w", "a", "s", "d"],
      action: ChangeDirection,
    }),
  ],
})
```

Hyperapp calls the `subscriptions` function on every update because the state is an input to it. This means you can easily change your subscriptions based on the state.

```js
subscriptions: (state) => [
    state.isListening && onKey({
      keys: ["w", "a", "s", "d"],
      action: ChangeDirection,
    }),
  ]
```

Hyperapp calls `keySub` when `onKey` first appears in the subscriptions array. If `onKey` is removed from the array (by having a falsy value in its place), the anonymous cleanup function is called instead.

Also, when a subscription’s `props` change, Hyperapp calls the cleanup function and the subscriber function a second time with the new `props`. How does Hyperapp know when `props` change? We use strict equality—if your `props` contain an array or an object, then it needs to be the same object, or the subscription will restart every time!



### Subscription creator functions

For the same reasons as for [effect creator functions](#effect-creator-functions), you should use subscription *creator* functions. An subscription creator function is a function that returns an subscription tuple. 

```elm
SubscriptionCreatorFn : Payload -> [SubscriptionFn, Payload]
```

Those creator functions are used in the list of subscriptions that the function assigned to the [`subscriptions` property](#subscriptions-property) returns.



### Recommendation for naming subscriptions

Since subscriptions describe external events that the app should react to, it is recommended to use the prefix `on-` in conjunction with the event name or type of event, written together in *lowerCamelCase*. Examples are `onArrowKey` and `onMessageFromOuterSpace`.
