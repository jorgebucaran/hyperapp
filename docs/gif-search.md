# Gif Search

In this example we'll implement a GIF search using the [Giphy API](https://api.giphy.com/) and learn how to update the state asynchronously.

[Try it Online](https://codepen.io/hyperapp/pen/ZeByKv?editors=0010)

```jsx
app({
  state: {
    url: "",
    isFetching: false
  },
  view: (state, actions) =>
    <main>
      <input
        type="text"
        placeholder="Type to search..."
        onkeyup={actions.search}
      />
      <div class="container">
        <img
          src={state.url}
          style={{ display: state.isFetching ? "none" : "block" }}
        />
      </div>
    </main>,
  actions: {
    search: (state, actions, { target }) => {
      const text = target.value

      if (state.isFetching || text === "") {
        return { url: "" }
      }

      actions.toggleFetching()

      fetch(`//api.giphy.com/v1/gifs/search?q=${text}&api_key=${GIPHY_API_KEY}`)
        .then(data => data.json())
        .then(({ data }) => {
          actions.toggleFetching()
          data[0] && actions.setUrl(data[0].images.original.url)
        })
    },
    setUrl: (state, actions, url) => ({ url }),
    toggleFetching: state => ({ isFetching: !state.isFetching })
  }
})
```

The state consists of two properties: `url`, the GIF URL; and `isFetching` to track when the browser is fetching a new GIF.

```jsx
state: {
  url: "",
  isFetching: false
}
```

The `isFetching` flag is used to hide the GIF while the browser is busy. Without it, the last downloaded GIF would be shown as another one is requested.

```jsx
style={{
  display: state.isFetching ? "none" : "block"
}}
```

The view consists of a text input and an `img` element to display the GIF.

Using `onkeyup` retrieve the input text and call `actions.search` to request a new GIF. If a fetch is pending or the text input is empty exit early.

```jsx
if (state.isFetching || text === "") {
  return { url: "" }
}
```

Inside `actions.search` use the [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API to download a GIF URL from Giphy.

When `fetch` is done, we receive the payload with the GIF metadata inside a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```jsx
fetch(
  `//api.giphy.com/v1/gifs/search?q=${text}&api_key=${GIPHY_API_KEY}`
)
  .then(data => data.json())
  .then(({ data }) => {
    actions.toggleFetching()
    data[0] && actions.setUrl(data[0].images.original.url)
  })
```

Finally, call `actions.toggleFetching` to allow further fetch requests to be made and update the state by passing the fetched GIF URL to `actions.setUrl`.
