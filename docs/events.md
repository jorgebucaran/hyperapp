# Events

Use events to get notified when your app is initialized, an action is called, before a [view](/docs/view.md) is rendered, etc.

```jsx
app({
  state: {
    x: 0,
    y: 0
  },
  view: state =>
    <h1>
      {state.x + ", " + state.y}
    </h1>,
  actions: {
    move: (state, { x, y }) => ({ x, y })
  },
  events: {
    init: (state, actions) =>
      addEventListener("mousemove", e =>
        actions.move({
          x: e.clientX,
          y: e.clientY
        })
      )
  }
})
```

#### init

The init events fires immediately before the view is rendered the first time. This is a good place to initialize your application, create a network request, access the local [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage), etc.

<pre>
init(<a href="/docs/state.md">state</a>, <a href="/docs/actions.md">actions</a>)
</pre>

#### loaded

The loaded event fires immediately after the view is rendered the first time. This event can be useful if you need to access real DOM nodes to initialize your application.

<pre>
loaded(<a href="/docs/state.md">state</a>, <a href="/docs/actions.md">actions</a>)
</pre>

#### action

The action event fires every time before an action is called.

<pre>
action(<a href="/docs/state.md">state</a>, <a href="/docs/actions.md">actions</a>, <a href="#action-data">data</a>)
</pre>

* <a id="action-data"></a>data
  * **name**: the name of the action
  * **data**: the data passed to the action

#### update

The update event fires every time before the state is updated.

<pre>
update(<a href="/docs/state.md">state</a>, <a href="/docs/actions.md">actions</a>, <a href="#update-data">data</a>): <a href="#update-data">data</a>
</pre>

* <a id="update-data"></a>**data**: the data used to update the state.

#### render

<pre>
render(<a href="/docs/state.md">state</a>, <a href="/docs/actions.md">actions</a>, <a href="#/docs/view.md">view</a>): <a href="#/docs/view.md">view</a>
</pre>

The render event fires every time before the view is rendered. You can use this event to overwrite the current view by returning a new one.

```jsx
app({
  view: state => <h1>Hi.</h1>,
  events: {
    render(state, actions) {
      if (location.pathname === "/warp") {
        return state => <h1>Welcome to warp zone!</h1>
      }
    }
  }
})
```

## Custom Events

The app returns the [emit](/docs/api.md#emit) function, making it possible to trigger custom events.

Custom events can be useful in situations where your application is a part of a larger system and you want to communicate with it from the outside.

```js
const emit = app({
  state: 0,
  actions: {
    setData: (state, actions, data) => data
  },
  view: state =>
    <h1>
      {state}
    </h1>,
  events: {
    "outside:data": (state, actions, data) => actions.setData(data)
  }
})

...

emit("outside:data", 1)
```
