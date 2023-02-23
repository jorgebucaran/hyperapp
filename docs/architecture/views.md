# Views

**_Definition:_**

> A **view** is a declarative description of what should get rendered and is usually influenced by the current [state](state.md).

A view is implemented as a pure function that accepts the current state and returns a [virtual DOM node (VNode)](#virtual-dom). When [state transitions](state.md#state-transitions) happen your views are automatically updated accordingly.

**_Signature:_**

```elm
View : (State) -> VNode
```

---

## Describing Views

The [`h()`](../api/h.md), [`text()`](../api/text.md), and [`memo()`](../api/memo.md) functions are the building blocks of your views.

[`h()`](../api/h.md) not only describes what HTML elements are being used but also what [actions](actions.md) are wired up if any.

```js
const view = (state) =>
  h(
    "button",
    {
      class: { "calling-acid-burn": state.beingFramed },
      onclick: FindThatDisk,
    },
    text("It's in that place where I put that thing that time.")
  )
```

<!-- In the 1995 movie "Hackers", the hacker "The Phantom Freak" calls his friend "Acid Burn" from jail as he's being framed for a crime he didn't commit. -->

[`text()`](../api/text.md) just creates text nodes so the views it can create on its own are necessarily simplistic.

```js
const view = () => text("Go home and be a family man!")
```

<!-- In the videogame "Street Fighter II: The World Warrior", the fighter known as Guile says this taunt to his opponent after defeating them. -->

[`memo()`](../api/memo.md) is designed to be used with other functions that produce VNodes, so it doesn't really describe a view by itself.

```js
const view = (state) => memo(scenicView, state.vacationSpot)
```

<!-- Just a play-on-words between how "view" is used in Hyperapp and everyday language. -->

---

## Components

Views are naturally composable so they can be as simple or complicated as you need. Simpler apps probably just need a single view but in more complicated apps there could be plenty of subviews.

**_Definition:_**

> A **component** in Hyperapp can either be a subview or some other function that generates VNodes.

**_Signature:_**

```elm
Component : (GlobalState | PartialState) -> VNode | [...VNodes]
```



You would typically make components for widgets that provide the building block elements of your app's UI. Components for larger UI segments such as dashboards or pages would make use of these widgets.

In the following example, `coinsDisplay` is a component in the form of a subview while `questionBlock` is a component in the form of some function that returns a VNode. Notice the former cares directly about the state while the latter doesn't:

```js
// Component : (GlobalState) -> VNode
const coinsDisplay = (state) =>
  h("div", { class: "coins-display" }, text(state.coins))

// Component : (PartialState) -> VNode
const questionBlock = (opened) =>
  opened
    ? h("button", { class: "question-block opened" }, text("?"))
    : h(
        "button",
        {
          class: "question-block",
          onclick: [
            HitBlockFromBottom,
            { revealItem: "beanstalk" },
          ],
        },
        text("?")
      )

// Component : (GlobalState) -> VNode
const level = (state) =>
  h("div", { class: "level" }, [
    coinsDisplay(state),
    questionBlock(state.onlyQuestionBlockOpened),
  ])
```

<!-- In the videogame "Super Mario Bros." coins are important for earning extra lives and the question blocks often contain useful contents. -->

**_Naming Recommendation:_**

Components are recommended to be named in `camelCase` using a noun that concisely describes the (purpose of the) composed group of contained elements best, for instance `articleHeader` or `questionBlock`.

### Components Returning Multiple VNodes

Components are allowed to return an array of VNodes. However, to make use of such components in a list of other siblings, you'll need to spread their result.

```js
// Component : () -> [...VNodes]
const finishingMoveOptions = () => [
  h("button", { onclick: FinishHim }, text("Fatality")),
  h("button", { onclick: FinishHimAsAnAnimal }, text("Animality")),
  h("button", { onclick: TurnHimIntoABaby }, text("Babality")),
  h("button", { onclick: BefriendHim }, text("Friendship")),
]

const view = () => h("div", {}, [
  h("em", {}, text("Finish them:")),
  ...finishingMoveOptions(),
])
```

<!-- In the "Mortal Kombat" videogame series there are multiple ways to finish off your opponent. The opportunity to do so occurs at the end of a match once the match announcer exclaims "Finish Him!" -->

---

## Using Views

### Top-Level View

Every Hyperapp application has a base view that encompasses all others. This is the **top-level view** that's defined by the [`view:`](../api/app.md#view) property when using [`app()`](../api/app.md). Hyperapp automatically calls this view and gives it the current state when the state is initially set or anytime it's updated.

```js
app({
  // ...
  view: (state) =>
    h("main", {}, [
      earthrealm(state),
      edenia(state),
    ]),
})
```

<!-- "Earthrealm" and "Edenia" are two of several realms in the "Mortal Kombat" videogame series. -->

### Conditional Rendering

Elements of a view can be shown or hidden conditionally.

```js
const view = (state) =>
  h("div", {}, [
    state.flying && h("div", {}, text("Flying")),
    state.notSwimming || h("div", {}, text("Swimming")),
  ])
```

### Recycling

Hyperapp supports hydration of views out of the box. This means that if the mount node you specify is already populated with DOM elements, Hyperapp will recycle and use these existing elements instead of throwing them away and creating them again. You can use this for doing SSR or pre-rendering of your applications, which will give you SEO and performance benefits.

---

## Virtual DOM

**_Definition:_** 

> The **virtual DOM**, or **VDOM** for short, is an in-memory representation of the [DOM](https://dom.spec.whatwg.org/) elements that exist on the current page.

Hyperapp uses it to determine how to efficiently update the actual DOM. The virtual DOM is a tree data structure where each of its nodes represent a particular VDOM element that may or may not get rendered.

We've already seen how [`h()`](../api/h.md), [`text()`](../api/text.md), and [`memo()`](../api/memo.md) all return different types of VNodes.

### Patching the DOM

When Hyperapp is ready to update the DOM it will do so starting at the element that corresponds to the root VNode of the [top-level view](#top-level-view). Hyperapp checks if there were changes made to that VNode representing that element. If so, the element gets rerendered the process repeats recursively for every child of that VNode.

### Keys

Sometimes Hyperapp needs help determining how certain elements have changed. This is generally the case for VNodes that are rendered based on arrays in the state. This is because array items may have shifted around a lot during a state change, so when they get rendered the VNodes that currently represent them might be completely different than before.

Since Hyperapp can't know for sure it must assume everything had changed requiring a full render every time.

For an example, look at the [`key:`](../api/h.md#key) documentation for [`h()`](../api/h.md).

### Memoization

The optimization technique known as **memoization**, is where the result of a calculation is stored somewhere to be used again in the future without incurring the cost of calculating again.

Memoization in Hyperapp concerns how VNodes are rendered and is implemented using [`memo()`](../api/memo.md). When memoized views are rerendered the "state" they receive is actually the props defined for the view when the memoization was setup.

Immutability in Hyperapp guarantees that if two things are referentially equal, they must be identical. This makes it safe for Hyperapp to only re-compute your memoized components when values passed through their props change.

For an example, look at the documentation for [`memo()`](../api/memo.md#example).

#### Performance

Memoization exists to help improve rendering performance but it's not a panacea. If it was used with nodes that need to update on every state change, the cost of checking if the memoization's props had changed before carrying out the rendering would be a net loss of performance over time.

Memoization was designed for nodes that don't need to update at all or just occasionally.

As always when it comes to optimizations, be sure to measure the performance of your app to make sure you're getting true benefits and adjust if necessary.
