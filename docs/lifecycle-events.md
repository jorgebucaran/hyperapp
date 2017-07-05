# Lifecycle Events

Lifecycle events are custom function handlers invoked at various points in the life of a [virtual node](/docs/core.md#virtual-nodes).

## oncreate

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

Called when an element is created, but before it is inserted into the DOM. Use this method to start animations before an element is rendered.

## oninsert

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

Fired after an element is created and inserted into the DOM. Use this event to wrap third party libraries that require a reference to a DOM node, etc.

## onupdate

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

Fired when the element's data is updated.

## onremove

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

Fired before the element is removed from the DOM.

Note that you are responsible for removing the element when using this event.

```js
if (element.parentNode) {
  element.parentNode.removeChild(element)
}
```

## Example

This example shows how to create a [stateless component](/docs/stateless-components.md) to wrap the [CodeMirror](https://codemirror.net/) editor.

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

