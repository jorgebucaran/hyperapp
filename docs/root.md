# Root

The `root` represents the top-level element in your application. If one isn't supplied, the [view](/docs/view.md) is rendered in a new element and appended to the [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body).

```jsx
app({
  view: () => <h1>Hi.</h1>
})
```

This is the result.

```html
<body>
  <h1>Hi.</h1> <!-- The root. -->
</body>
```

Use the `root` property to target an arbitrary HTML element, overwriting any existing elements inside it.

```jsx
app({
  root: document.getElementById("app"),
  view: () => <h1>Hi.</h1>
})
```

This is the original HTML.

```html
<body>
  <div id="app">Hello.</div>
</body>
```

This is the result after the view has been rendered.

```html
<body>
  <h1>Hi.</h1>
</body>
```
