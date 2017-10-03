# Lifecycle

You can be notified when a virtual node is created, updated or removed via lifecycle events. Use them for animation, data fetching, accessing the real DOM, etc.

## `oncreate`

The `oncreate` event is fired after the element is created and attached to the DOM.

Use it to manipulate the DOM node directly, make a network request, start an animation, etc.

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

## `onupdate`

The `onupdate` event is fired every time we update the element attributes.

This event will fire even if the attributes have not changed. You can use `oldProps` inside the event handler to check if they changed or not.

```jsx
export function MyComponent({ url, download }) {
  return (
    <main
      onupdate={(element, oldProps) => {
        if (url !== oldProps.url) {
          download(url)
        }
      }}
    />
  )
}
```

## `onremove`

The `onremove` event is fired before the element is removed from the DOM.

Use it for cleaning up resources like timers, creating slide out animations, etc.

```jsx
app({
  view: () => (
    <div onremove={element => remove => fadeout(element).then(remove)} />
  )
})
```
