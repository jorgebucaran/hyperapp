# VDOM Events

VDOM or lifecycle events are functions called at various points in the life of a [virtual node](/docs/vnodes.md). They are used like any other [attribute](/docs/vnodes.md#attributes).

## oncreate

The [oncreate](/docs/api.md#oncreate) event is fired after the element is created and attached to the DOM. Use it to manipulate the DOM node directly, make a network request, start an animation, etc.

```jsx
app({
  view: () =>
    <input
      type="text"
      oncreate={element => {
        element.focus()
      }}
    />
})
```

## onupdate

The [onupdate](/docs/api.md#onupdate) event is fired after the element attributes are updated. This event will fire even if the attributes have not changed. You can use `oldProps` inside the function to check if they changed or not.

```jsx
app({
  view: state =>
    <main>
      <MyComponent
        value={state.value}
        onupdate={(element, oldProps) => {
          if (state.value !== oldProps.value) {
            // ...
          }
        }}
      />
    </main>
})
```

## onremove

The [onremove](/docs/api.md#onremove) event is fired before the element is removed from the DOM. Use it for cleaning up resources like timers, creating slide out animations, etc.

```jsx
app({
  view: () =>
    <div
      onremove={element => {
        element.classList.add("slide-out")
        setTimeout(() => {
          if (element.parentNode) {
            element.parentNode.removeChild(element)
          }
        }, 1000)
      }}
    />
})
```

Note that when using this event you must also remove the element.

## Adapting an External Library

This example shows how to integrate the [CodeMirror](https://codemirror.net/) editor in an application.

[Try it Online](https://hyperapp-code-mirror.glitch.me)

```jsx
const Editor = props =>
  <div
    oncreate={element => {
      const cm = CodeMirror(node => element.appendChild(node))

      // Share it.
      element.CodeMirror = {
        set: props =>
          Object.keys(props).forEach(key => cm.setOption(key, props[key]))
      }

      element.CodeMirror.set(props)
    }}
    onupdate={element => element.CodeMirror.set(props)}
  />

app({
  //...
  view: state =>
    <Editor
      mode={state.mode}
      theme={state.theme}
      lineNumbers={state.lineNumbers}
    />
})
```
