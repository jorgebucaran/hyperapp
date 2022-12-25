<h1 title="The name of the `h()` function is short for **hyperscript** which is named after the original hyperscript function from [HyperScript](https://github.com/hyperhype/hyperscript)."><code>h()</code></h1>

**_Definition:_**

> A function that creates [virtual DOM nodes (VNodes)](../architecture/views.md#virtual-dom) which are used for defining [views](../architecture/views.md).

**_Import & Usage:_**

```js
import { h } from "hyperapp"

// ...

h(tag, props, children)
```

**_Signature & Parameters:_**

```elm
h : (String, Object, VNode? | [...VNodes]?) -> VNode
```

| Parameters            | Type                     | Required? |
| --------------------- | ------------------------ | --------- |
| [tag](#tag)           | String                   | yes :100: |
| [props](#props)       | Object                   | yes :100: |
| [children](#children) | VNode or array of VNodes | no        |

| Return Value                                         | Type  |
| ---------------------------------------------------- | ----- |
| [virtual node](../architecture/views.md#virtual-dom) | VNode |

`h()` effectively represents the page elements used in your app. Because it's just JavaScript we can easily render whichever elements we see fit in a dynamical manner.

```js
const hobbit = (wearingElvenCloak) =>
  h("div", {}, [
    !wearingElvenCloak && h("p", {}, text("Frodo")),
  ])
```

<!-- In "The Lord of the Rings" book/movie series, Frodo is a main character who eventually obtains a special cloak that makes him invisible when worn. -->

---

## Parameters

### `tag`

Name of the node. For example, `div`, `h1`, `button`, etc. Essentially any [HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) or [SVG element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) or [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

### `props`

HTML or SVG properties ("props") for the DOM element are defined using an object where the keys are the property names and the values are the corresponding property values.

```js
h("input", {
  type: "checkbox",
  id: "picard",
  checked: state.engaging,
})
```

<!-- In the television series "Star Trek: The Next Generation", one of captain Picard's catchphrases is "Engage!". -->

Hyphenated props will need to be quoted in order to use them. The quotes are necessary to abide by JavaScript syntax restrictions.

```js
h("q", { "data-zoq-fot-pik": "Frungy" }, text("The Sport of Kings!"))
```

<!-- In the videogame "Star Control II: The Ur-Quan Masters" the alien races known as the Zoq-Fot-Pik have a favorite mysterious sport called Frungy which they regard as "The Sport of Kings". -->

Certain properties are treated in a special way by Hyperapp.

#### `class:`

The [classes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) to use with the VNode. The `class` prop can be given in various formats:

- As a string representing a class name. Because of the way Hyperapp internally processes class strings they're allowed to have a space-separated list of different class names.

  ```js
  h("div", { class: "muggle-studies" })
  ```

  <!-- In the "Harry Potter" book/movie series, "Muggle Studies" is a class that can be taken at the Hogwarts School of Witchcraft and Wizardry. -->

- As an object where the keys are the names of the classes while the values are booleans for toggling the classes.

  ```js
  h("div", { class: { arithmancy: true, "study-of-ancient-runes": true } })
  ```

  <!-- In the "Harry Potter" series, "Arithmancy" and "The Study of Ancient Runes" are classes that can be taken at Hogwarts. -->

- As an array that contains any combination of the various formats including this one.

  ```js
  h("div", { class: ["magical theory", "xylomancy"] })
  ```

  <!-- In the "Harry Potter" series, "Magical Theory" and "Xylomancy" are classes that can be taken at Hogwarts. -->

  This means the array format is recursive.

  ```js
  h("input", {
    type: "range",
    class: [
      { dragonzord: state.green && !state.white },
      "mastodon",
      state.pink && "pterodactyl",
      [
        { triceratops: state.blue },
        "sabretooth-tiger",
        state.red && "tyrannosaurus",
      ],
    ],
  })
  ```

  <!--
  In the television show "Mighty Morphin Power Rangers", Tommy Oliver was initially the Green Ranger and eventually became the White Ranger.
  The Green Ranger's Zord was called the Dragonzord.
  The Black Ranger had the Mastodon Dinozord.
  The Pink Ranger had the Pterodactyl Dinozord.
  The Blue Ranger had the Triceratops Dinozord.
  The Yellow Ranger had the Sabretooth Tiger Dinozord.
  The Red Ranger had the Tyrannosaurus Dinozord.
  -->

#### `style:`

The [inline CSS styles](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style) to use with the VNode. The `style` prop can be an object of [CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) where the keys are the CSS property names and the values are the corresponding CSS property values. Hyphenated CSS property names can either be in camelCase or quoted to abide by JavaScript syntax restrictions.

```js
h(
  "span",
  {
    style: {
      backgroundColor: "white",
      color: "blue",
      display: "inline-block",
      "font-weight": "bold",
    },
  },
  text("+\\")
)
```

<!-- The combination of the plus and backslash characters along with the blue and white colors are reminiscent of Hyperapp's logo. -->

#### `key:`

A unique string per VNode that helps Hyperapp track if VNodes are changed, added, or removed in situations where it's unable to do so, such as in arrays.

```js
const pokedex = (pokemon) =>
  h(
    "ul",
    {},
    pokemon.map((p) => h("li", { key: p.id }, text(p.name)))
  )
```

<!-- The Pokédex is a digital encyclopedia used by Trainers in the world of Pokémon. -->

#### Event Listeners

Props that represent event listeners, such as [`onclick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event), [`onchange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event), [`oninput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event), etc. are where you would assign [actions](../architecture/actions.md) to VNodes.

Synthetic events can be added in the same way as long as their name starts with "on", so an event created with 
```js
const buildEvent = new Event("build")
``` 
can be used like this: 
```js
h("button", { onbuild: BuildAction }, text("Click Me"))
```

### `children`

The children of the VNode are other VNodes which are directly nested within it.

`children` can either be given as a single child VNode:

```js
h("q", {}, text("There is no spoon."))
```

<!-- In the movie "The Matrix", a young boy says "There is no spoon." to the protagonist Neo. -->

or as an array of child VNodes:

```js
h("q", {}, [
  text("I know Kung Fu."),
  h("em", {}, text("Show me.")),
])
```

<!-- In the movie "The Matrix", Neo says "I know Kung Fu." after having downloaded martial arts knowledge into his head. His mentor Morpheus replies with "Show me." before they spar with each other. -->

---

## Other Considerations

### JSX Support

Hyperapp doesn't support [JSX](https://reactjs.org/docs/introducing-jsx.html) out-of-the-box. That said you can use this custom JSX function to be able to use it.

```js
import { h, text } from "hyperapp"

const jsxify = (h) => (type, props, ...children) =>
  typeof type === "function"
    ? type(props, children)
    : h(
        type,
        props || {},
        [].concat(...children).map((x) =>
          typeof x === "string" || typeof x === "number" ? text(x) : x
        )
      )

const jsx = jsxify(h) /** @jsx jsx */
```
