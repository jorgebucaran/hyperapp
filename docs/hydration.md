# Hydration

Hyperapp works transparently with SSR and pre-rendered HTML, enabling SEO optimization and improving your sites time-to-interactive. The process consists of serving a fully pre-rendered page together with your application.

```html
<html>
<head>
  <script defer src="bundle.js"></script>
</head>

<body>
  <main>
    <h1>0</h1>
    <button>–</button>
    <button>+</button>
  </main>
</body>
</html>
```

Then instead of throwing away the server-rendered markdown, we'll walk through your DOM tree and turn nodes into an interactive application. The default [root](/docs/root.md) is `document.body`, but you can specify another if you have multiple apps on the same page.
