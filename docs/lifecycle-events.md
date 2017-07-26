# Lifecycle Events

Lifecycle events are custom function handlers invoked at various points in the life of a [virtual node](/docs/virtual-nodes.md).

<pre>
<i>event</i>(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>)
</pre>

## oncreate

The oncreate event is fired when the element is created, but before it is inserted into the DOM. Use this event to start animations before an element is rendered.

## oninsert

The oninsert event is fired after the element is created and inserted into the DOM. Use this event to wrap third party libraries that require a reference to a DOM node, etc.

## onupdate

The onupdate event is fired every time the element's data is updated.

## onremove

The onremove event is fired before the element is removed from the DOM.

When using `onremove`, you will most likely need the [node](/docs/virtual-nodes.md) to also be [keyed](/docs/keys.md). If not, the elements removed are not guaranteed to correspond to any particular node. As a consequence, `onremove` may not work for the topmost element of your [view](/docs/view.md).

You are responsible for removing the element if you use this event.

```js
if (element.parentNode) {
  element.parentNode.removeChild(element)
}
```

## CodeMirror Example

This example shows how to create a [component](/docs/components.md) and wrap a subset of the [CodeMirror](https://codemirror.net) editor.

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

