# TweetBox

In this section we'll implement a simple TweetBox clone and learn how to create custom tags.

[Try it online](https://codepen.io/hyperapp/pen/bgWBdV?editors=0010)

```jsx
const MAX_LENGTH = 120
const OFFSET = 10

const OverflowWidget = ({ text, offset, count }) =>
  <div class="overflow">
    <h1>Whoops! Too long.</h1>
    <p>
      ...{text.slice(0, offset)}
      <span class="overflow-text">
        {text.slice(count)}
      </span>
    </p>
  </div>

const Tweetbox = ({ count, text, update }) =>
  <main>
    <div class="container">
      <ul class="flex-outer">
        <li>
          <textarea
            placeholder="What's up?"
            value={text}
            oninput={update}
          />
        </li>

        <li class="flex-inner">
          <span class={count > OFFSET ? "" : "overflow-count"}>
            {count}
          </span>

          <button
            onclick={() => alert(text)}
            disabled={count >= MAX_LENGTH || count < 0}
          >
            Tweet
          </button>
        </li>
      </ul>

      {count < 0 &&
        <OverflowWidget
          text={text.slice(count - OFFSET)}
          offset={OFFSET}
          count={count}
        />}

    </div>
  </main>

app({
  state: {
    text: "",
    count: MAX_LENGTH
  },
  view: (state, actions) =>
    <Tweetbox
      text={state.text}
      count={state.count}
      update={e => actions.update(e.target.value)}
    />,
  actions: {
    update: (state, actions, text) => ({
      text,
      count: state.count + state.text.length - text.length
    })
  }
})
```

The state stores the text of the message and the number of remaining characters `count`, initialized to `MAX_LENGTH`.

```js
state: {
  text: "",
  count: MAX_LENGTH
}
```

The view consists of our custom TweetBox tag. We use the attributes, often referred to as _props_, to pass down data into the widget.

```jsx
<TweetBox
  text={state.text}
  count={state.count}
  update={e => actions.update(e.target.value)}
/>
```

When the user types in the input, we call `actions.update` to update the current text and calculate the remaining characters.

```js
update: (state, actions, text) => ({
  text,
  count: state.count + state.text.length - text.length
})
```

The subtracting the length of the current text, from the length of the previous text, tells us how the number of remaining characters has changed. Hence the new count of remaining characters is the old count plus the aforementioned difference.

When the input is empty, this operation is equivalent to `(MAX_LENGTH - text.length)`.

When `state.count` becomes less than 0, we know that `state.text` must be longer than `MAX_LENGTH`, so we can disable the tweet button and display the OverflowWidget custom tag.

```jsx
<button
  onclick={() => alert(text)}
  disabled={count >= MAX_LENGTH || count < 0}
>
  Tweet
</button>
```

The tweet button is also disabled when `state.count === MAX_LENGTH`, because that means we have not entered any characters.

The OverflowWidget tag displays the unallowed part of the message and a few adjacent characters for context. The constant `OFFSET` tells us how many extra characters to slice off `state.text`.

```jsx
<OverflowWidget
  text={text.slice(count - OFFSET)}
  offset={OFFSET}
  count={count}
/>
```

By passing`OFFSET` into OverflowWidget we are able to slice `text` further and apply an `overflow-text` class to the specific overflowed part.

```jsx
<span class="overflow-text">
  {text.slice(count)}
</span>
```
