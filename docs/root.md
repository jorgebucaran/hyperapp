# Root

The view is attached to the [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body) by default.

To mount the application on a different element, use the root property.

```jsx
app({
  view: () => <h1>Hi.</h1>,
  root: document.getElementById("app")
})
```
