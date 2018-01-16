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

Then instead of throwing away the server-rendered markdown, we'll turn your DOM nodes into an interactive application out of the box!
