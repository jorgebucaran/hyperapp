# Lifecycle Events

Lifecycle events are custom function handlers invoked at various points in the life of a [virtual node](/docs/virtual-nodes.md).

## oncreate

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

The oncreate event is fired when the element is created, but before it is inserted into the DOM. Use this method to start animations before an element is rendered.

## oninsert

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

The oninsert event is fired after the element is created and inserted into the DOM. Use this event to wrap third party libraries that require a reference to a DOM node, etc.

## onupdate

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

The onupdate event is fired every time the element's data is updated.

## onremove

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

The onremove event is fired when the element is going to be removed from the DOM.

You are responsible for removing the element if you use this event.

```js
if (element.parentNode) {
  element.parentNode.removeChild(element)
}
```

## Example

This example shows how to create a [stateless component](/docs/stateless-components.md) to wrap the [CodeMirror](https://codemirror.net) editor.

[Try it online](https://hyperapp-code-mirror.glitch.me)

```jsx
const node = document.createElement("div")
const editor = CodeMirror(node)

const Editor = props => {
  const setOptions = props =>
    Object.keys(props).forEach(key =>
      editor.setOption(key, props[key]))

  return (
    <div
      oninsert={element => {
        setOptions(props)
        element.appendChild(node)
      }}
      onupdate={() => setOptions(props)}
    />
  )
}
```

