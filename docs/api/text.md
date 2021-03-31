# `text()`

A function that creates a [virtual DOM node (VNode)](../architecture/views.md#virtual-dom) out of a given value.

You'll normally use it with [`h()`](./h.md).

```js
import { text } from "hyperapp"

// ...

h("p", {}, text(content))
```

| Parameter           | Type          | Required? | Notes
| ------------------- | ------------- | --------- | -----
| [content](#content) | any (sort of) | :100:     |
| node                | DOM element   | :x:       | This is for internal Hyperapp use only!

You would use `text()` to insert regular text content into your views.

```js
h("p", {}, text("You must construct additional pylons."))
```
<!-- In the videogame "StarCraft", the alien race known as the Protoss use special structures called pylons to power their buildings. -->

Of course, this may include anything relevant from the [current state](../architecture/state.md).

```js
h("p", {}, text(state.message))
```

`text()` exists as the way of defining text nodes such that Hyperapp's implementation is kept simpler than it otherwise would have been.

---

## Parameters

### `content`

While `content` can technically be anything, what will actually be used for the content of the VDOM element will be the stringifed version of `content`. So, using actual strings and numbers makes a lot of sense but using arrays will probably be formatted in a way you don't want and objects won't work well at all.
