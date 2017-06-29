# Tweetbox

In this section we'll implement a simple Tweetbox clone and learn how to assemble a view using custom tags.

[Try it online](https://codepen.io/hyperapp/pen/bgWBdV?editors=0010)

```jsx
const MAX_LENGTH = 120
const OFFSET = 10

const OverflowText = ({ text, offset, count }) =>
  <p>
    ...{text.slice(0, offset)}
    <span class="overflow-text">
      {text.slice(count)}
    </span>
  </p>

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
            disabled={count >= MAX_LENGTH || count <= 0}
          >
            Tweet
          </button>
        </li>
      </ul>
      {count < 0
        ? <div class="overflow">
            <h1>Whoops! Too long.</h1>
            <OverflowText
              text={text.slice(count - OFFSET)}
              offset={OFFSET}
              count={count}
            />
          </div>
        : ""}

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
<Tweetbox
	text={state.text}
	count={state.count}
	update={e => actions.update(e.target.value)}
/>
```

When the user types in the input, we call `actions.update` to update the current text and calculate the remaining characters.

To calculate the number of remaining characters, we subtract the new text length from the current text length and add it to `state.count`.

```js
state.count + state.text.length - text.length
```

When the input is empty, this operation is equivalent to `(MAX_LENGTH - text.length)`. As the text grows `state.count` shrinks and vice versa.

When `state.count` becomes 0 or less, we know the `state.text` must be as long or longer than `MAX_LENGTH`, so we can disable the tweet button and display the OverflowText custom tag.

```jsx
<button
	onclick={() => alert(text)}
	disabled={count >= MAX_LENGTH || count <= 0}
>
	Tweet
</button>
```

The Tweet button is also disabled when the input is empty, which we can tell by looking at `state.count`.

The OverflowText tag displays the unallowed part of the message and a few adjacent characters for context. The constant `OFFSET` tells us how many extra characters to slice off `state.text`.

```jsx
<OverflowText
  text={text.slice(count - OFFSET)}
  offset={OFFSET}
  count={count}
/>
```

By passing`OFFSET` into OverflowText we are able to slice `text` further and apply an `overflow-text` class to the specific overflowed part.

```jsx
<span class="overflow-text">
  {text.slice(count)}
</span>
```
