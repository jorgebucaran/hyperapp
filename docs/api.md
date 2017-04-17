# API

## h(<a href="#h_tag">tag</a>, <a href="#h_data">data</a>, <a href="#h_children">children</a>)

```js
h("button", { onClick: () => alert("Hi!") }, "Click Me")
```

Returns an object that looks like this:

```js
{
  tag: "button",
  data: {
    onClick: () => alert("Hi!")
  }
  children: "Click Me"
}
```

The returned object is called _virtual node_.

### <a name="h_tag"></a> tag

A tag name, e.g. `div`, `button`, etc.

Or a function returning a virtual node.

```js
const Link = ({ href }, children) => h("a", { href }, children)
```

### <a name="h_data"></a> data

An object with attributes, styles, events, [lifecycle events](#...), etc.

```js
{
  id: "myButton",
  style: {
    color: "red"
  },
  onClick: event => alert(event.target)
}
```

### <a name="h_children"></a> children

One or more virtual nodes or Array of virtual nodes.

```js
h("ul", null, [
  h("li", null, "Super"),
  h("li", null, "Ultra"),
  h("li", null, "Hyper")
])
```

## app(<a href="app_props">props</a>)

```jsx
app({
  state,
  view,
  actions,
  events,
  mixins,
  root
})
```

Starts an application with the given properties.

<a name="props"><a>

### [state](/docs/state.md)

Any type that represents the state of your application.


### [view(state, actions)](/docs/view.md)
### [actions.action(state, data, actions, emit)](/docs/actions.md#calling_actions)
### [events.loaded(state, actions, emit)](/docs/events.md#loaded)
### [events.action(state, actions, data, emit)](/docs/events.md#action)
### [events.update(state, actions, data, emit)](/docs/events.md#update)
### [events.render(state, actions, data, emit)](/docs/events.md#render)
### [mixins](/docs/mixins.md)
### [root](/docs/root.md)
## [emit(event, data)](/docs/events.md#emit)


