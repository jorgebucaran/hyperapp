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
* [Integration](#integration)

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

Use [events](/docs/api.md#events) to get notified when your app is initialized, an action is called, before a view is rendered etc.

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
    ready: (state, actions) =>
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

For a practical example see the implementation of the [Router](https://github.com/hyperapp/router/blob/master/src/router.js).

#### Custom Events

The [app](/docs/api.md#app) call returns the [emit](/docs/api.md#emit) function, making it possible to trigger [custom events](#custom-events).

```jsx
const emit = app({
  view: (state, { fail }) =>
    <button onclick={fail}>Fail</button>,
  actions: {
    fail: (state, actions, data) => emit("error", "Fail")
  },
  events: {
    error: (state, actions, error) => {
      throw error
    }
  }
})
```

Custom events can be useful in situations where your application is a part of a larger system and you want to communicate from the outside.

```js
const emit = app({
  state: 0,
  actions: {
    setData: (state, actions, data) => data
  },
  view: state => <h1>{state}</h1>,
  events: {
    "outside:data": (state, actions, data) =>
      actions.setData(data)
  }
})

...

emit("outside:data", 1)
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

