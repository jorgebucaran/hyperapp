# gif Search

In this example we'll implement a gif search using the [Giphy API](https://api.giphy.com/) and learn how to update the state asynchronously.

[Try it Online](https://codepen.io/hyperapp/pen/ZeByKv?editors=0010)

```jsx
import { h, app } from "hyperapp"

const GIPHY_API_KEY = "dc6zaTOxFJmzC"

const state = {
  url: "",
  query: "",
  isFetching: false
}

const actions = {
  downloadGif: query => async (state, actions) => {
    actions.toggleFetching(true)
    actions.setUrl(
      await fetch(
        `//api.giphy.com/v1/gifs/search?q=${query}&api_key=${GIPHY_API_KEY}`
      )
        .then(data => data.json())
        .then(({ data }) => (data[0] ? data[0].images.original.url : ""))
    )
    actions.toggleFetching(false)
  },
  setUrl: url => ({ url }),
  setQuery: query => ({ query }),
  toggleFetching: isFetching => ({ isFetching })
}

const view = (state, actions) => (
  <main>
    <input
      type="text"
      placeholder="Type here..."
      autofocus
      onkeyup={({ target: { value } }) => {
        if (value !== state.query) {
          actions.setQuery(value)
          if (!state.isFetching) {
            actions.downloadGif(value)
          }
        }
      }}
    />
    <div class="container">
      <img
        src={state.url}
        style={{
          display: state.isFetching || state.url === "" ? "none" : "block"
        }}
      />
    </div>
  </main>
)

const main = app(state, actions, view, document.body)
```

The state consists of three properties: `url`, the url of the gif; `isFetching` to track when the browser is fetching a new gif, and query, what the user has typed into the text input.

```jsx
const state = {
  url: "",
  query: "",
  isFetching: false
}
```

The `isFetching` flag is used to hide the gif while the browser is busy. Without it, the last downloaded gif would be shown as another one is requested.

```jsx
style={{
  display: state.isFetching ? "none" : "block"
}}
```

The view is made up of a text input and an `img` element to display the gif.

Inside `onkeyup` we retrieve the input text and call `actions.setQuery` to update the current search query, then call `actions.downloadGif` to request a new gif. If a fetch is still pending, we skip the action.

```jsx
if (value !== state.query) {
  actions.setQuery(value)
  if (!state.isFetching) {
    actions.downloadGif(value)
  }
}
```

Inside `actions.downloadGif` we use the [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API to download a gif url from Giphy.

When `fetch` is done, we receive the payload with the gif metadata and call `actions.setUrl` with the value.

```jsx
actions.setUrl(
  await fetch(
    `//api.giphy.com/v1/gifs/search?q=${query}&api_key=${GIPHY_API_KEY}`
  )
    .then(data => data.json())
    .then(({ data }) => (data[0] ? data[0].images.original.url : ""))
)
```
