# Lifecycle Events

You can be notified when a virtual node is created, updated or removed via lifecycle events. Use them for animation, data fetching and cleaning up resources.

## oncreate

This event is fired after the element is created and attached to the DOM. Use it to manipulate the DOM node directly, make a network request, create slide/fade in animation, etc.

```jsx
function Textbox({ placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      oncreate={element => element.focus()}
    />
  )
}
```

## onupdate

This event is fired every time we update the element attributes. Use `oldProps` inside the event handler to check if any attributes changed or not.

```jsx
function Textbox({ placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onupdate={(element, oldProps) => {
        if (oldProps.placeholder !== placeholder) {
          // Handle changes here!
        }
      }}
    />
  )
}
```

## onremove

This event is fired before the element is removed from the DOM. Use it to create slide/fade out animations. Call `done` inside the function to remove the element.

This event is not called in its child elements.

```jsx
const MessageWithFadeout = ({ title }) => (
  <div onremove={(element, done) => fadeout(element).then(done)}>
    <h1>{title}</h1>
  </div>
)
```

## ondestroy

This event is fired after the element has been removed from the DOM, either directly or as a result of a parent being removed. Use it for invalidating timers, canceling a network request, removing global events listeners, etc.

```jsx
const Camera = ({ onerror }) => (
  <video
    poster="loading.png"
    oncreate={element => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => (element.srcObject = stream))
        .catch(onerror)
    }}
    ondestroy={element => element.srcObject.getTracks()[0].stop()}
  />
)
```
