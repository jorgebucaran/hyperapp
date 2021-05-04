# `memo()`

**_Definition:_**

> A wrapper function to cache your [views](../architecture/views.md) based on properties you pass into them.

**_Import & Usage:_**

```js
import { memo } from "hyperapp"

// ...

memo(view, props)
```

**_Signature & Parameters:_**

```elm
memo : (View, IndexableData) -> VNode
```

| Parameters    | Type                                            | Required? |
| ------------- | ----------------------------------------------- | --------- |
| [view](#view) | [View](../architecture/views.md)                | yes :100: |
| [data](#data) | anything indexable (i.e. Array, Object, String) | no        |

| Return Value                                         | Type  |
| ---------------------------------------------------- | ----- |
| [virtual node](../architecture/views.md#virtual-dom) | VNode |

`memo()` lets you take advantage of a performance optimization technique known as [memoization](../architecture/views.md#memoization).

---

## Parameters

### `view`

A [view](../architecture/views.md) you want [memoized](../architecture/views.md#memoization).

### `data`

The data to pass along to the wrapped view function instead of the [state](../architecture/state.md). The wrapped view is recomputed when the data for it changes.

---

## Example

Here we have a list of numbers displayed in a regular view as well as a memoized version of the same view. One button changes the list which affects both views. Another button updates a counter which affects the counter's view and also the regular view of the list but not the memoized view of the list.

```js
import { h, text, app, memo } from "hyperapp"

const randomHex = () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
const randomColor = () => "#" + Array.from({ length: 6 }, randomHex).join("")

const listView = (list) =>
  h("p", {
    style: {
      backgroundColor: randomColor(),
      color: randomColor(),
    },
  }, text(list))

const MoreItems = (state) => ({ ...state, list: [...state.list, randomHex()] })
const Increment = (state) => ({ ...state, counter: state.counter + 1 })

app({
  init: {
    list: ["a", "b", "c"],
    counter: 0,
  },
  view: (state) =>
    h("main", {}, [
      h("button", { onclick: MoreItems }, text("Grow list")),
      h("button", { onclick: Increment }, text("+1 to counter")),
      h("p", {}, text(`Counter: ${state.counter}`)),
      h("p", {}, text("Regular view showing list:")),
      listView(state.list),
      h("p", {}, text("Memoized view showing list:")),
      memo(listView, state.list),
    ]),
  node: document.querySelector("main"),
})
```

---

## Other Considerations

### Performance

Using `memo()` too often will lead to [degraded performance](../architecture/views.md#performance). Only use `memo()` when you know it will improve rendering. When in doubt, benchmark!

### Memo Data Gotcha

When Hyperapp checks memo data for changes it will do index-for-index comparisons between what the data currently is with how it was in the previous state. So, any indexable type like strings and arrays can be compared with one another and in certain edge cases be considered "equal" when it comes to determining if a re-render should happen.

We can modify parts of the example from earlier to illustrate this:

```js
// ...

const MoreItems = (state) => ({
  ...state,
  list: Array.isArray(state.list)
    ? [...state.list, randomHex()]
    : state.list + "" + randomHex(),
})

const Increment = (state) => ({
  ...state,
  counter: state.counter + 1,

  // The following should cause the memoized view to rerender but it doesn't.
  list: Array.isArray(state.list)
    ? state.list.join("")
    : state.list.split(""),
})

// ...
```
