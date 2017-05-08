# Gif Search

In this section we'll implement a gif search using the [Giphy API](https://api.giphy.com/) and learn how to update the state asynchronously.

[Try it online](https://codepen.io/hyperapp/pen/LybmLe?editors=0010)

```jsx
const GIPHY_API_KEY = "dc6zaTOxFJmzC"

app({
  state: {
    url: "",
    isFetching: false
  },
  view: (state, actions) => (
    <div>
      <input
        type="text"
        placeholder="Type to search..."
        onkeyup={actions.search}
      />
      <img
        src={state.url}
        style={{
          display: state.isFetching ? "none" : "block"
        }}
      />
    </div>
  ),
  actions: {
    search: (state, actions, { target }) => {
      const text = target.value

      if (state.isFetching || text === "") {
        return { url: "" }
      }

      actions.toggleFetching()

      fetch(
        `//api.giphy.com/v1/gifs/search?q=${text}&api_key=${GIPHY_API_KEY}`
      )
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

The state has a string for the gif URL and a boolean flag to know when the browser is fetching a new gif.

```jsx
state: {
  url: "",
  isFetching: false
}
```

The <samp>isFetching</samp> flag is used to hide the gif while the browser is busy. Without it, the last downloaded gif would be shown as another one is requested.

```jsx
style={{
  display: state.isFetching ? "none" : "block"
}}
```

The view consists of a text input and an <samp>img</samp> element to display the gif.

To handle user input, the <samp>onkeyup</samp> event was used, but <samp>onkeydown</samp> or <samp>oninput</samp> would have worked just as well.

On every key stroke <samp>actions.search</samp> is called and a new gif is requested, but only if a fetch is not already pending and the text input is not empty.

```jsx
if (state.isFetching || text === "") {
  return { url: "" }
}
```

Inside <samp>actions.search</samp> we use the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API to request a gif URL from Giphy.

When <samp>fetch</samp> is done, we receive the payload with the gif information inside a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

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

Once data has been received, <samp>actions.toggleFetching</samp> is called (which allows further fetch requests to be made) and the state is updated by passing the fetched gif URL to <samp>actions.setUrl</samp>.
