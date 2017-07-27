# Keys

Every time your application is rendered, a virtual node tree is created from scratch.

Keys help identify which nodes were added, changed or removed from the old and new tree.

Use keys to tell the patch algorithm to re-order children instead of mutate them.

```jsx
<ul>
  {urls.map((url, id) =>
    <li key={id}>
      <img src={url} />
    </li>
  )}
</ul>
```
