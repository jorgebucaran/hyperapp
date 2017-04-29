# Lifecycle Events

Lifecycle events are custom event handlers invoked at various points in the life of a [virtual node](/docs/virtual-nodes.md).

They are useful for starting animations, wrapping third party libraries that require a reference to a DOM element, etc.

## <a name="oncreate"></a> oncreate

Type: <samp>([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))</samp>

Called after an element is created and added to the DOM.

## <a name="onupdate"></a> onupdate

Type: <samp>([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))</samp>

Called when the element's data is updated.

## <a name="onremove"></a> onremove

Type: <samp>([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))</samp>

Called before the element is removed from the DOM.

## Examples

Integration with [CodeMirror](https://codemirror.net/).

<a name="cb1"><a/>[View Online](https://hyperapp-code-mirror.glitch.me)

```jsx
const node = document.createElement("div")
const editor = CodeMirror(node)

const Editor = props => {
  const setOptions = props =>
    Object.keys(props).forEach(key => editor.setOption(key, props[key]))

  return (
    <div
      oncreate={element => {
        setOptions(props)
        element.appendChild(node)
      }}
      onupdate={() => setOptions(props)}
    />
  )
}
```
