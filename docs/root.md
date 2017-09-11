# Root

Use the root to target the DOM node where the [view](/docs/view.md) will be rendered into.

```html
<body>
  <div id="app"></div>
</body>
```

```jsx
app({
  view: () => <h1>Hi.</h1>,
  root: document.getElementById("app")
})
```

```html
<body>
  <div id="app">
    <h1>Hi.</h1>
  </div>
</body>
```

If a root isn't supplied, the [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body) will be used instead.

```jsx
app({
  view: () => <h1>Hi.</h1>
})
```

```html
<body>
  <h1>Hi.</h1>
</body>
```
