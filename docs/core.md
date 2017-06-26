# Core Concepts

* [Virtual Nodes](#virtual-nodes)
* [Data Attributes](#data-attributes)
* [Applications](#applications)
  * [View and State](#view-and-state)
  * [Actions](#actions)
    * [Namespaces](#namespaces)
  * [Events](#events)
    * [Custom Events](#custom-events)
  * [Mixins](#mixins)

## Virtual Nodes

A virtual node is an object that describes an HTML/DOM tree.

It consists of a tag, e.g. <samp>div</samp>, <samp>svg</samp>, etc., data attributes and an array of child nodes.

```js
{
  tag: "div",
  data: {
    id: "app"
  },
  children: [{
    tag: "h1",
    data: null,
    children: ["Hi."]
  }]
}
```

The virtual DOM engine consumes a virtual node and produces an HTML tree.

```html
<div id="app">
  <h1>Hi.</h1>
</div>
```

You can use the [h(tag, data, children)](/docs/api.md#h) utility function to create virtual nodes.

```js
h("div", { id: "app" }, [
  h("h1", null, "Hi.")
])
```

Or setup a build pipeline and use [Hyperx](/docs/hyperx.md) or [JSX](/docs/jsx.md) instead.

### Data Attributes

Any valid HTML [attributes/properties](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [events](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers), [styles](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference), etc.

```js
data: {
  id: "myButton",
  class: "PrimaryButton",
  onclick: () => alert("Hi."),
  disabled: false,
  style: {
    fontSize: "3em"
  }
}
```

Attributes also include [lifecycle events](/docs/lifecycle-events.md) and meta data such as [keys](/docs/keys.md).

## Applications

Use the [app(props)](/docs/api.md#app) function to create an application.

```jsx
app({
  view: () => <h1>Hi.</h1>
})
```

The app function renders the given view and appends it to [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body).

To mount the application on a different element, use the [root](/docs/api.md#root) property.

```jsx
app({
  view: () => <h1>Hi.</h1>,
  root: document.getElementById("app")
})
```

### View and State

The [view](/docs/api.md#view) is a function of the state. It is called every time the state is modified to rebuild the application's [virtual node](/docs/core.md#virtual-nodes) tree, which is used to update the DOM.

```jsx
app({
  state: "Hi.",
  view: state => <h1>{state}</h1>
})
```

Use the [state](/docs/api.md#state) to describe your application's data model.

```jsx
app({
  state: ["Hi", "Hola", "Bonjour"],
  view: state => (
    <ul>
      {state.map(hello => <li>{hello}</li>)}
    </ul>
  )
})
```

### Actions

Use [actions](/docs/api.md#actions) to update the state.

```jsx
app({
  state: "Hi.",
  view: (state, actions) => (
    <h1 onclick={actions.ucase}>{state}</h1>
  ),
  actions: {
    ucase: state => state.toUpperCase()
  }
})
```

To update the state, an action must return a new state or a part of it.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOne}>+1</button>
    </main>
  ),
  actions: {
    addOne: state => state + 1
  }
})
```

You can pass data to actions as well.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button
        onclick={() => actions.addSome(1))}>More
      </button>
    </main>
  ),
  actions: {
    addSome: (state, actions, data = 0) => state + data
  }
})
```

Actions are not required to have a return value. You can use them to call other actions, for example after an asynchronous operation has completed.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOneDelayed}></button>
    </main>
  ),
  actions: {
    addOne: state => state + 1,
    addOneDelayed: (state, actions) => {
      setTimeout(actions.addOne, 1000)
    }
  }
})
```

An action may return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This enables you to use [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

```jsx
const delay = seconds =>
  new Promise(done => setTimeout(done, seconds * 1000))

app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOneDelayed}>+1</button>
    </main>
  ),
  actions: {
    addOne: state => state + 1,
    addOneDelayed: async (state, actions) => {
      await delay(1)
      actions.addOne()
    }
  }
})
```

#### Namespaces

Namespaces let you organize actions into categories and help reduce name collisions as your application grows larger.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <button onclick={actions.counter.add}>+</button>
      <h1>{state}</h1>
      <button onclick={actions.counter.sub}>-</button>
    </main>
  ),
  actions: {
    counter: {
      add: state => state + 1,
      sub: state => state - 1
    }
  }
})
```

### Events

Use [events](/docs/api.md#events) to get notified when your application is completely loaded, an action is called, before a view is rendered etc.

```jsx
app({
  state: { x: 0, y: 0 },
  view: state => (
    <h1>{state.x + ", " + state.y}</h1>
  ),
  actions: {
    move: (state, { x, y }) => ({ x, y })
  },
  events: {
    loaded: (state, actions) =>
      addEventListener("mousemove", e =>
        actions.move({
          x: e.clientX,
          y: e.clientY
        })
      )
  }
})
```

Events can be used to hook into the update and render pipeline.

```jsx
app({
  view: state => <h1>Hi.</h1>,
  events: {
    render: (state, actions, data) => {
      if (location.pathname === "/warp") {
        return state => <h1>Welcome to warp zone!</h1>
      }
    }
  }
})
```

For a practical example see the implementation of the [Router](https://github.com/hyperapp/hyperapp/blob/master/src/router.js).

#### Custom Events

To create custom events, use the [emit(event, data)](/docs/api.md#emit) function. This function is passed as the last argument to actions/events.

```jsx
app({
  view: (state, actions) =>
    <button onclick={actions.fail}>Fail</button>,
  actions: {
    fail: (state, actions, data, emit) =>
      emit("error", "Fail")
  },
  events: {
    error: (state, actions, error) => {
      throw error
    }
  }
})
```

### Mixins

Use [mixins](/docs/api.md#mixins) to extend your application state, actions and events in a modular fashion.

```jsx
const Logger = () => ({
  events: {
    action: (state, actions, data) => console.log(data)
  }
})

app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOne}>+1</button>
    </main>,
  actions: {
    addOne: state => state + 1
  },
  mixins: [Logger]
})
```

Mixins can also compose with other mixins:

```js
const Counter = () => ({
  mixins: [Logger],
  state: {
    count: 0
  },
  actions: {
    up: state => ({ count: state.count + 1 }),
    down: state => ({ count: state.count + 1 })
  }
})

app({
  mixins: [Counter],
  view: state =>
    <div class="counter">
      <button onclick={actions.up}>+</button>
      <span>{state.count}</span>
      <button onclick={actions.down}>-</button>
    </div>
})
```

