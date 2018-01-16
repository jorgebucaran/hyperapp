# Sanitation

Use of the innerHTML method can lead to cross-site scripting ([XSS](https://en.wikipedia.org/wiki/Cross-site_scripting)) vunerabilities if not properly sanitized. If you can't use vnodes for any reason, create your own replacement function to explicitly state the intent of performing an "unsafe" operation.

```jsx
const dangerouslySetInnerHTML = html => element => {
  element.innerHTML = html
}

const ItemContent = ({ item: { url, summary } }) => (
  <div class="content">
    <a href={url} oncreate={dangerouslySetInnerHTML(summary)} />
  </div>
)
```

Use with caution! Setting HTML from code is dangerous because it's easy to inadvertently expose your users to an XSS attack. [DOMPurify](https://github.com/cure53/DOMPurify) and [sanitize-html](https://github.com/punkave/sanitize-html) are two popular HTML sanitizer libraries.
