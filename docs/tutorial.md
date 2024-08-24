# Tutorial #

If you're new to Hyperapp, this is a great place to start. We'll cover all the essentials and then some, as we incrementally build up a simplistic example. To begin, open up an editor and type in this html:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="./hyperapp-tutorial.css" />
    <script type="module">

/* Your code goes here */      

    </script>
  </head>
  <body>
    <main id="app"/>
  </body>
</html>
```

Save it as `hyperapp-tutorial.html` on your local drive, and in the same folder create the `hyperapp-tutorial.css` with the following css:

<details>
  <summary>(expand tutorial css)</summary>
  
```css
@import url('https://cdn.jsdelivr.net/npm/water.css@2/out/light.css');

:root {
  --box-width: 200px;
}

main { position: relative;}

.person {
  box-sizing: border-box;
  width: var(--box-width);
  padding: 10px 10px 10px 40px;
  position: relative;
  border: 1px #ddd solid;
  border-radius: 5px;  
  margin-bottom: 10px;
  cursor: pointer;
}

.person.highlight {
  background-color: #fd9;
}
.person.selected {
  border-width: 3px;
  border-color: #55c;
  padding-top: 8px;
  padding-bottom: 8px;
}

.person input[type=checkbox] {
  position: absolute;
  cursor: default;
  top: 10px;
  left: 7px;
}
.person.selected input[type=checkbox] {
  left: 5px;
  top: 8px;
}

.person p {
  margin: 0;
  margin-left: 2px;
}
.person.selected p {
  margin-left: 0;
} 

.bio {
  position: absolute;
  left: calc(var(--box-width) + 2rem);
  top: 60px;
  color: #55c;
  font-style: italic;
  font-size: 2rem;
  text-indent: -1rem;
}
.bio:before {content: '"';}
.bio:after {content: '"';}

```
  
</details>

Keep the html file open in a browser as you follow along the tutorial, to watch your progress. At each step there will be a link to a live-demo sandbox yo may refer to in case something isn't working right. (You could also use the sandbox to follow the tutorial if you prefer)

## Hello world ##

Enter the following code:

```js
import {h, text, app} from "https://cdn.skypack.dev/hyperapp"

app({
  view: () => h("main", {}, [
    h("div", {class: "person"}, [
      h("p", {}, text("Hello world")),
    ]),
  ]),
  node: document.getElementById("app"),
})
```

Save the file and reload the browser. You'll be greeted by the words "Hello world" framed in a box.

<img width="582" src="https://user-images.githubusercontent.com/2061445/116821112-d9986300-ab78-11eb-82c5-25c35667eb18.png">

[Live Demo][1-hello-world]

Let's walk through what happened:

You start by importing the three functions `h`, `text` and `app`.

You call `app` with an object that holds app's definition.

The `view` function returns a _virtual DOM_ – a blueprint of how we want the actual DOM to look, made up of _virtual nodes_. `h` creates virtual nodes representing HTML tags, while `text` creates representations of text nodes. The equivalent description in plain HTML would be:

```html
<main>
  <div class="person">
    <p>Hello world</p>
  </div>
</main>
```

`node` declares _where_ on the page we want Hyperapp to render our app. Hyperapp replaces this node with the DOM-nodes it generates from the description in the view.

## State, View, Action ##

### Initializing State ###

Add an `init` property to the app:

```js
app({
  init: { name: "Leanne Graham", highlight: true },
  ...
})
```

Each app has an internal value called _state_. The `init` property sets the state's initial value. The view is always called with the current state, allowing us to display values from the state in the view.

Change the view to:

```js
state => h("main", {}, [
  h("div", {class: "person"}, [
    h("p", {}, text(state.name)),
    h("input", {type: "checkbox", checked: state.highlight}),
  ]),
])
```

Save and reload. Rather than the statically declared "Hello world" from before, we are now using the name "Leanne Graham" from the state. We also added a checkbox, whose checked state depends on `highlight`. 

<img width="584" src="https://user-images.githubusercontent.com/2061445/116821122-e5842500-ab78-11eb-8ab6-09a4fe590557.png">

[Live Demo][2-render-with-state]


### Class properties ###

Change the definition of the div:

```js
h("div", {class: {person: true, highlight: state.highlight}}, [ ... ])
```

The class property can be a string of space-separated class-names just like in regular HTML, _or_ it can be an object where the keys are class-names. When the corresponding value is truthy, the class will be assigned to the element.

The `highlight` property of the state now controls both wether the div has the class "highlight" and wether the checkbox is checked.

<img width="584" src="https://user-images.githubusercontent.com/2061445/116821134-f03eba00-ab78-11eb-9054-fcfab957dee6.png">

[Live Demo][3-class-objects]

However, clicking the checkbox to toggle the highlightedness of the box doesn't work. In the next step we will connect user interactions with transforming the state.

### Actions ###

Define the function:

```js
const ToggleHighlight = state => ({ ...state, highlight: !state.highlight })
```

It describes a _transformation_ of the state. It expects a value in the shape of the app's state as argument, and will return something of the same shape. Such functions are known as _actions_. This particular action keeps all of the state the same, except for `highlight`, which should be flipped to its opposite.

Next, assign the function to the `onclick` property of the checkbox: 

```js
h("input", {
  type: "checkbox",
  checked: state.highlight,
  onclick: ToggleHighlight,
})
```

Save and reload. Now, clicking the checkbox toggles not only checked-ness but the higlighting of the box.

<img width="583" src="https://user-images.githubusercontent.com/2061445/116821148-fcc31280-ab78-11eb-9eaa-48ea590f3804.png">

[Live Demo][4-toggle-highlight]


### Dispatching ###

By assigning `ToggleHighlight` to `onclick` of the checkbox, we tell Hyperapp to _dispatch_ `ToggleHighlight` when the click-event occurs on the checkbox. Dispatching an action means Hyperapp will use the action to transform the state. With the new state, Hyperapp will calculate a new view and update the DOM to match.


### View components ###

Since the view is made up of nested function-calls, it is easy to break out a portion of it as a separate function for reuse & repetition.  

Define the function:

```js
const person = props =>
  h("div", {
    class: {
      person: true,
      highlight: props.highlight
    }
  }, [
    h("p", {}, text(props.name)),
    h("input", {
      type: "checkbox",
      checked: props.highlight,
      onclick: props.ontoggle,
    }),
  ])
```

Now the view can be simplified to:

```js
state => h("main", {}, [
  person({
    name: state.name,
    highlight: state.highlight,
    ontoggle: ToggleHighlight,
  }),
])
```

Here, `person` is known as a _view component_. Defining and combining view components is a common practice for managing large views. Note, however, that it does not rely on any special Hyperapp-features – just plain function composition.

[Live Demo][5-view-component]

### Action payloads ###

This makes it easier to have multiple boxes in the view. First add more names and highlight values to the initial state, by changing `init`:

```js
{
  names: [
    "Leanne Graham",
    "Ervin Howell",
    "Clementine Bauch",
    "Patricia Lebsack",
    "Chelsey Dietrich",
  ],
  highlight: [
    false,
    true,
    false,
    false,
    false,
  ],
}
```

next, update the view to map over the names and render a `person` for each one:

```js
state => h("main", {}, [
  ...state.names.map((name, index) => person({
    name,
    highlight: state.highlight[index],
    ontoggle: [ToggleHighlight, index],
  })),
])
```

Notice how instead of assigning just `ToggleHighlight` to `ontoggle`, we assign `[ToggleHighlight, index]`. This makes Hyperapp dispatch `ToggleHighlight` with `index` as the _payload_. The payload becomes the second argument to the action. 

Update `ToggleHighlight` to handle the new shape of the state, and use the index payload:

```js
const ToggleHighlight = (state, index) => {
  // make shallow clone of original highlight array
  let highlight = [...state.highlight]

  // flip the highlight value of index in the copy
  highlight[index] = !highlight[index]
  
  // return shallow copy of our state, replacing 
  // the highlight array with our new one
  return { ...state, highlight}
}
```

Save & reload. You now have five persons. Each can be individually highlighted by toggling its checkbox.

<img width="584" src="https://user-images.githubusercontent.com/2061445/116821165-0d738880-ab79-11eb-9144-ae07771d798e.png">

[Live Demo][6-action-payloads]

Next, let's add the ability to "select" one person at a time by clicking on it. We only need what we've learned so far to achieve this.

First, add a `selected` property to `init`, where we will keep track of the selected person by its index. Since no box is selected at first, `selected` starts out as `null`:

```js
{
  ...
  selected: null, 
}
```

Next, define an action for selecting a person: 

```js
const Select = (state, selected) => ({...state, selected})
```

Next, pass the `selected` property, and `Select` action to the `person` component:

```js
person({
  name,
  highlight: state.highlight[index],
  ontoggle: [ToggleHighlight, index],
  selected: state.selected === index, // <----
  onselect: [Select, index],          // <----
})
```

Finally, we give the selected person the "selected" class to visualize wether it is selected. We also pass the given `onselect` property on to the `onclick` event handler of the div.

```js
const person = props =>
  h("div", {
    class: {
      person: true,
      highlight: props.highlight,
      selected: props.selected,    // <---
    },
    onclick: props.onselect,       // <---
  }, [
    h("p", {}, text(props.name)),
    h("input", {
      type: "checkbox",
      checked: props.highlight,
      onclick: props.ontoggle,
    }),
  ])
```

Save, reload & try it out by clicking on the different persons.

<img width="578" src="https://user-images.githubusercontent.com/2061445/116821180-1e23fe80-ab79-11eb-9467-82880ce7a750.png">

[Live Demo][7-with-selection]

### DOM-event objects ###

But now, when we toggle a checkbox, the person also selected. This happens because the `onclick` event bubbles up from the checkbox to the surrounding div. That is just how the DOM works. If we had access to the event object we could call the `stopPropagation` method on it, to prevent it from bubbling. That would allow toggling checkboxes without selecting persons.

As it happens, we _do_ have access to the event object! Bare actions (_not_ given as `[action, payload]`) have a default payload which is the event object. That means we can define the `onclick` action of the checkbox as:

```js
onclick: (state, event) => {
  event.stopPropagation()
  //...
}
```

But what do we do with the `props.ontoggle` that used to be there? – We return it!

```js
h("input", {
  type: "checkbox",
  checked: props.highlight,
  onclick: (_, event) => {
    event.stopPropagation()
    return props.ontoggle
  },
})
```

When an action returns another action, or an `[action, payload]` tuple instead of a new state, Hyperapp will dispatch that instead. You could say we defined an "intermediate action" just to stop the event propagation, before continuing to dispatch the action originally intended.

Save, reload and try it! You should now be able to highlight and select persons independently. 

<img width="571" src="https://user-images.githubusercontent.com/2061445/116821193-2b40ed80-ab79-11eb-9d1e-1ae1fc0da62b.png">

[Live Demo][8-separate-highlight-selection]


### Conditional rendering ###

Further down we will be fetching the "bio" of selected persons from a server. For now, let's prepare the app to receive and display the bio.

Begin by adding an initially empty `bio` property to the state, in `init`:

```js
{
  ...,
  selected: null,
  bio: "",       // <---
}
```

Next, define an action that saves the bio in the state, given some server data:

```js
const GotBio = (state, data) => ({...state, bio: data.company.bs})
```

And then add a div for displaying the bio in the view:

```js
state => h("main", {}, [
  ...state.names.map((name, index) => person({
    name,
    highlight: state.highlight[index],
    ontoggle: [ToggleHighlight, index],
    selected: state.selected === index,
    onselect: [Select, index],
  })),
  state.bio &&                                  // <---
  h("div", { class: "bio" }, text(state.bio)),  // <---
])
```

The bio-div will only be shown if `state.bio` is truthy. You may try it for yourself by setting `bio` to some nonempty string in `init`.

[Live Demo][9-conditional-rendering]

This technique of switching parts of the view on or off using `&&` (or switching between different parts using ternary operators `A ? B : C`) is known as _conditional rendering_

## Effects ##

### Effecters ###

In order to fetch the bio, we will need the id associated with each person. Add the ids to the initial state for now:

```js
{
  ...
  selected: null,
  bio: "",
  ids: [1, 2, 3, 4, 5], // <---
}
```

We want to perform the fetch when a person is selected, so update the `Select` action:

```js
const Select = (state, selected) => {

  fetch("https://jsonplaceholder.typicode.com/users/" + state.ids[selected])
  .then(response => response.json())
  .then(data => {
    console.log("Got data: ", data)
  
    /* now what ? */
  })

  return {...state, selected}
}
```

> We will be using the JSONPlaceholder service in this tutorial. It is a free & open source REST API for testing & demoing client-side api integrations. Be aware that some endpoints could be down or misbehaving on occasion.

If you try that, you'll see it "works" in the sense that data gets fetched and logged – but we can't get it from there in to the state!

Hyperapp actions are not designed to be used this way. Actions are not general purpose event-handlers for running arbitrary code. Actions are meant to simply calculate a value and return it. 

The way to run arbitrary code with some action, is to wrap that code in a function and return it alongside the new state:

```js
const Select = (state, selected) => [
  {...state, selected},
  () => 
    fetch("https://jsonplaceholder.typicode.com/users/" + state.ids[selected])
    .then(response => response.json())
    .then(data => {
      console.log("Got data: ", data)
      /* now what ? */
    })
]
```

When an action returns something like `[newState, [function]]`, the function is known as an _effecter_ (a k a "effect runner"). Hyperapp will call that function for you, as a part of the dispatch process. What's more, Hyperapp provides a `dispatch` function as the first argument to effecters, allowing them to "call back" with response data:


```js
const Select = (state, selected) => [
  {...state, selected},
  dispatch => {                           // <---
    fetch("https://jsonplaceholder.typicode.com/users/" + state.ids[selected])
    .then(response => response.json())
    .then(data => dispatch(GotBio, data)) // <---
  }
]
```

Now when a person is clicked, besides showing it as selected, a request for the persons's data will go out. When the response comes back, the `GotBio` action will be dispatched, with the response data as payload. This will set the bio in the state and the view will be updated to display it.

<img width="567" src="https://user-images.githubusercontent.com/2061445/116821205-3ac03680-ab79-11eb-8814-74362f93de25.png">

[Live Demo][10-effecter-with-dispatch]

### Effects ###

There will be other things we want to fetch in a similar way. The only difference will be the url and action. So let's define a reusable version of the effecter where url and action are given as an argument:

```js
const fetchJson = (dispatch, options) => {
  fetch(options.url)
  .then(response => response.json())
  .then(data => dispatch(options.action, data))
}
```

Now change `Select` again:

```js
const Select = (state, selected) => [
  {...state, selected},
  [ 
    fetchJson,
    {
      url: "https://jsonplaceholder.typicode.com/posts/" + state.ids[selected],
      action: GotBio,
    }
  ]
]
```

A tuple such as `[effecter, options]` is known as an _effect_. The options in the effect will be provided to the effecter as the second argument. Everything works the same as before, but now we can reuse `fetchJson` for other fetching we may need later.

[Live Demo][11-effect]

### Effect creators ###

Define another function:

```js
const jsonFetcher = (url, action) => [fetchJson, {url, action}]
```

It allows us to simplify `Select` even more:

```js
const Select = (state, selected) => [
  {...state, selected},
  jsonFetcher("https://jsonplaceholder.typicode.com/users/" + state.ids[selected], GotBio),
]

```

Here, `jsonFetcher` is what is known as an _effect creator_. It doesn't rely any special Hyperapp features. It is just a common way to make using effects more convenient and readable.

[Live Demo][12-effect-creator]

### Effects on Init ###

The `init` property works as if it was the return value of an initially dispatched action. That means you may set it as `[initialState, someEffect]` to have the an effect run immediately on start. 

Change `init` to:

```js
[
  {names: [], highlight: [], selected: null, bio: "", ids: []},
  jsonFetcher("https://jsonplaceholder.typicode.com/users", GotNames)
]
```

This means we will not have any names or ids for the persons at first, but will fetch this information from a server. The `GotNames` action will be dispatched with the response, so implement it:

```js
const GotNames = (state, data) => ({
  ...state,
  names: data.slice(0, 5).map(x => x.name),
  ids: data.slice(0, 5).map(x => x.id),
  highlight: [false, false, false, false, false],
})
```

With that, you'll notice the app will now get the names from the API instead of having them hardcoded.

[Live Demo][13-init-effect]

## Subscriptions ##

Our final feature will be to make it possible to move the selection up or down using arrow-keys. First, define the actions we will use to move the selection:


```js
const SelectUp = state => {
  if (state.selected === null) return state
  return [Select, state.selected - 1]
}

const SelectDown = state => {
  if (state.selected === null) return state
  return [Select, state.selected + 1]
}
```

When we have no selection it makes no sense to "move" it, so in those cases both actions simply return `state` which is effectively a no-op.

You may recall from earlier, that when an action returns `[otherAction, somePayload]` then that other action will be dispatched with the given payload. We use that here in order to piggy-back on the fetch effect already defined in `Select`.

Now that we have those actions – how do we get them dispatched in response to keydown events? 

If effects are how an app affects the outside world, then _subscriptions_ are how an app _reacts_ to the outside world. In order to subscribe to keydown events, we need to define a _subscriber_. A subscriber is  a lot like an effecter, but wheras an effecter contains what we want to _do_, a subscriber says how to start listening to an event. Also, subscribers must return a function that lets Hyperapp know how to _stop_ listening:

```js
const mySubscriber = (dispatch, options) => {
  /* how to start listening to something */
  return () => {
    /* how to stop listening to the same thing */
  }
}
```

Define this subscriber that listens to keydown events. If the event key matches `options.key` we will dispatch `options.action`.

```js
const keydownSubscriber = (dispatch, options) => {
  const handler = ev => {
    if (ev.key !== options.key) return
    dispatch(options.action)
  }
  addEventListener("keydown", handler)
  return () => removeEventListener("keydown", handler)
}
```

Now, just like effects, let's define a subscription creator for convenient usage:

```js
const onKeyDown = (key, action) => [keydownSubscriber, {key, action}]
```

A pair of `[subscriber, options]` is known as a _subscription_. We tell Hyperapp what subscriptions we would like active through the `subscriptions` property of the app definition. Add it to the app call:

```js
app({
  ...,
  subscriptions: state => [
    onKeyDown("ArrowUp", SelectUp),
    onKeyDown("ArrowDown", SelectDown),
  ]
})
```

This will start the subscriptions and keep them alive for as long as the app is running. 

But we don't actually want these subscriptions running all the time. We don't want the arrow-down subscription active when the bottom person is selected. Likewise we don't want the arrow-up subscription action when the topmost person is selected.  And when there is no selection, neither subscription should be active. We can tell Hyperapp this using logic operators – just as how we do conditional rendering:

```js
app({
  ...,
  subscriptions: state => [

    state.selected !== null &&
    state.selected > 0 &&
    onKeyDown("ArrowUp", SelectUp),

    state.selected !== null &&
    state.selected < (state.ids.length - 1) &&
    onKeyDown("ArrowDown", SelectDown),
  ],
})
```

Each time the state changes, Hyperapp will use the subscriptions function to see which subscriptions should be active, and start/stop them accordingly.


<img width="570" src="https://user-images.githubusercontent.com/2061445/116821228-4f9cca00-ab79-11eb-9528-7f6d37641ea2.png">


[Live Demo][14-subscriptions]

## Conclusion ##

That marks the completion of this tutorial. Well done! We've covered state, actions, views, effects and subscriptions – and really there isn't much more to it. You are ready to strike out on your own and build something amazing!


[1-hello-world]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgUEQhMawfACehFp8WgDmpPDwbjzFkYHWKbHWCZ7Wzq7uPOYgBM4IbXJcwgDsSABMOCAAvni8AkIiAFZcMnIKSsIQYMbkpOJawKJ4WgoAHuKHJsYTWqwUYFqGEuLGhEhWVsRQPBiEANa5xnxiD8MFB4BorKJ-vBSBdDA4HBcABTAGoaCDwADuSC0iIAlFpdOYtKJEYYwHwIDxDIdgFMtDQat4SYZbNS9sQcoQXvcQMZoYQ5IY6QyvIEmaTeWzaYcTuIJQAJeBUchaDHbWBQQy43F4RlaJg6moG3WinjkUHYqDkYhxQTyDDFCoAUQQdvEACFcgBJKAS2EgQ08Ca4hxdECyTYcaHKABGfBjSrDPRcbn6ygAzEgAIx0SbTED8QTKDDELlh2TyRTiZQAAQ2Wx2WjipFgiIA5I9nq93p8MItQSkNKQMDwKlYeMYwFYMXwFMPS4QayMrOQ4uIrClihIS1y27iANzwnhICjkXYo0UAWkvMfIx0vGOg4lE2JGdDoxmOh6DR-JlL2WhbIQECpseWhlDkbgaPA+4TEeGB8qQApeBe3i3vewEAF6UsU2K3qQoKkDed7ft4j5QM+2IaHwpCIte6EPk+ogHjUAIwDh2I5p+WhcccPEfnxKACaRgHkMBoHYhBs6aDBNT4YRnHcQAxDAUBaAKKRQCJ8nQpeMLqHE3I4J++7eDU5KkMUlLEeI4jkGAnHCTUNpIds2JbJSc7fnBVJfIhyFiBAW6bhIexyYCPylKuPBQJesiwG5WhKawUBYN5DgIfycjfEqKbwGpqFaDpRHkZRWjpiZcnbIRcWUIlSk4DgxAiWx6hVJednGNiAAclWiq1OE2XZDlaL1X4OD5GX+XIOgTmuNDiFCujEKILg-OhTBhf1Ykge02Lxhpa6yaKLkCqQlrwKwfAJOIImdY5fXeAgrDiNigx9T5mWuV8yauPls3GPNi18stq1AhtW1PZdr1aMZ42ivdo0ffB01eMYkNaBZVlgXQIlY9Zz0wyMyN+VlP25X9ano4V+M8JehPYrjE33L5GAxu4GNAbtcj7TGh0KCJDNaMQfCwMQiLUbR9F3oxFHMVoADUWgjGUYAsQj5BdVoaBOSddXnUljXNTUrArJehCLQg2IgaLEDG6KpvyObECYfAr6q3d8CnJelKgvI2KXlmHsTRl7PhAmptlOyKxVtibaGG2sGh+4SB8C90LR5W-taPHICJz5SYU6BAwgHQSB0JeOBYOXkxMBMQA

[2-render-with-state]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgUEQhMawfACehFp8WvyChTxQhVrEoi4A1gBG5AAekYHWKbHWCZ7Wzq7uPOYgBM4I-XJcwgDsSADMaCAAvni8AkIiAFZcMnIKSsIQYMbkpOJawKJ4WgpN4lcmxotarBRgWoYS4saESFZWxFAeBhCLVcsY+MRahgoPANFZRGD4KQHoYHA4HgAKYCtCA8CDiJDnYprQmGAAy8D4PB48C0AHFkaIBIYrqIIABzUQpTkE66kOK05atDQQeAAd0JhHEfAUWl05i0ogxhjAfFxLPOyy0NFa3iVhlsGuAxByhB+7xAxiRhDkhi1Oq8gT1ystRq1N3EGKlMvgGBK8AAlAG8LrAvqQLjjHFxEbxIjSSBqnVGi1hlUapD4FBJdKFGIOVyC+JFsHQ0xS47yyHHTxyDDCVByMQ4oJ5Bh2fBxABRBCt8QAIVyAEkoC6USAKyWHMNE+Qjhwkcp6nx6vBpEQ1y43BNlFhUABaFBIAAcSxWIH9ygwxDNM9k8kU4mUAAFDsdTlo4qRYBiAOSfb5fn+QEMC2GEUg0Ug-U7KweGMMArDFH0oJvQhnwAJischoysbkJGvM1fwDABuNEeCQChyDObFHX3fcU33MVoHEURCXQug6GMJpSJ4RYyNVXEiWOQh8QGQlSDXGVNHgYi+J4BwMCtUgbS8GjvAYkSAC9cXZQlGlIGFSHo5oeO8JioBYwkND4UgMTohjzJYkjWnBGAdMJABGTimi0LyuN87ytBQbzTK0YTRLkcTJLcDQZNafTDM8-yAGIYAqG0UigUKEqRfdkXUOJzRwLjiO8VpVVIdlcWM8RxDnTyQtaZtlJOQljlxBRSB4uSFKUlT805PDqPiiFanZCg4nKfdZFgVqtGS1goCwbreutORgU3Vws3OeKTkMxjmNYrRZhK3aDNyma5uSnAcGIULXPUHh2X3OrjEJY9TsdB6dJquqwHez6eqBPq5B0ODoxoOMrV0JNIRTJgdq+8gRO3cjCnqDLozix1mptUgG3gVg+AScRQtehrPu8BBWF5KZAdWlqgVGLdtsjCGofgGGMwaZoEbUrRqd5YruNacmtA+kXeLIxS1q8YxEe8CqqrRuhQqV6rBbY+ngdljaxgUCp5f59WeH3TWtFVhwnml+p3AVsLkYitGV0xhRQvN4g+FgYgMWs2z7OaA6LNEAMtAAai0dCJLAZzHTFtBGpxygrpuu7WlYXZ9ylXIEEJfEvYgNPHQz+Qs4gTT4DY6OyfgW591xGF5EJfcPOrq2FNt8JVwziTznvPZeV-Qxf1kjv3CQPgaaRPvdkfQkh5AEe5JnZnxh4SYQDoJA6H3HA9zoJYmEWIA

[3-class-objects]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgUEQhMawfACehFp8WvyChTxQhVrEoi4A1gBG5AAekYHWKbHWCZ7Wzq7uPOYgBM4I-XJcwgDsSADMaCAAvni8AkIiAFZcMnIKSsIQYMbkpOJawKJ4WgpN4lcmxotarBRgWoYS4saESFZWxFAeBhCLVcsY+MRahgoPANFZRGD4KQHoYHA4HgAKYCtCA8CDiJDnYprQmGAAy8D4PB48C0AHFkaIBIYrqIIABzUQpTkE66kOK05atDQQeAAd0JhHEfAUWl05i0ogxhjAfFxLPOyy0NFa3iVhlsGuAxByhB+52MSMIckJ4n58FZHK5Tt5Upl8DETu5EkWWp1XkCeuVIDMw01Vxu4gxboUGBK8AAlAm8LrAvqQLjjHFxEbxIjSSBqnVGi0w0XIfAoJLpbG2ZzveJFsnU0xmwHWymAzxyDDCVByMQ4oJ5Bh2fBxABRBDD8QAIVyAEkoMGUSA202HMNC+Qjhwkcp6nx6vBpEQTy43BNlDhUABaG9oKZLFYgePKDDEM1b2TyRTiZQAAKHMcpxaHEpCwBiADknzfL8-yAhgWwwikGikHG45WDwxhgFYYruuhn6EABABMVjkNmVgNh+ZpQQmADcaI8EgFDkGc2IBret4lreYrQOIoiEiRdB0MYTSMTwixMaquJEschD4gMhKkCeMqaPA9FSTwDgYJapDWl4HHeDxCkAF64uyhKNKQMKkNxzQSd4fFQAJhIaHwpAYlxPHOQJDGtOCMAWYSACMolNFoYViZF4VaCg4WOVo8mKTaWgqTkbgaBprTWbZoXRQAxDAFTWikUCJblSK3si6hxOaOBifR3itKqpDsri9niOIO6hQlrSDvpJyEscuIKKQElaTpekGZ69YuucOUQrU7IUHE5S3rIsBDVoBWsFAWATVNVpyMC56uJWC0BpVdm+YJWizI1OUnLZG2UNtBU4DgxCJYF6g8Oyt7dcYhIAByPQGv0WZ13VgKD4OTUC01yDo2HZjQeaWro5YNM0TCXd4yWXsxhT1KV2bZQGA3WqQfbwKwfAJOIiVA714PeAgrC8lM8NHYNQKjBeF2ZmjGPwFjNSQiWeNGVoHO8g14mtCzWhg4rklMbpx1eMY+NaK17XE3QiX6x1ctCTziNa6dYwKBUOsyybPC3mbWhGw4Twa-U7i64TSkk2TCiJS7xB8LAxAYu5nnec0vH8aICZaAA1FoJEqWA-kBsraB9ZTb00ztn3fa0rC7LeUq5AghL4qHEBFwGJfyGXECmfAQlp8z8C3LeuIwvIhK3iF7fuzpXvhMeJcqecP57LyUGGFBmkj+4SB8JzSJT7sf6EnPIAL1pW4C+MPCTCAdBIHQ95YOfSxMIsQA

[4-toggle-highlight]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQAq5ADmWQha4qLwWsSFxADWAEbkAB755HU5eQVFohBZoint4pGB1imx1gme1s6u7jzmIATOCGNyXMIA7EgAjABMIAC+eLwCQiIAVlwycgpKwhBgxuSk4lrAonj58NXiTybGm1qsFGBahhJxMZCEgrFZiFAeBhCGUAJ7GPjlDBQeAaKyieHwUgfQwOByyHiEO6ZRrwAASbQ6lLuui0RL4Ci0unMWgAFMAtBgufSFE9Wu1OhIkFoAIQ8+BiSmCu6bACUeP4pnZPQgPAg4mFHP4gmFhgAMvA+DweEUAOLY0QCQx8qXU4XiUhxIrbHoaCDwADuwvFTJZolZhjAfFV1vu2y0NB63n9hlsoeAxFgfEIIPuxixhDk9sd8BtArtdPEDIl-KpXU24cjXkC0YDIDMUzDTwUr1Z4ow2vgstleCjgRjIFVxji3UbwD7NfEmN1IBKLkqNWtE8Cc-K8Cg3qLCkl+a6verNe8ckTEHKwpJuXJtr3y7l+5rTB7PUf960PHIKOFUHIxDignkGBZPA4gAKIIP+4gAEKwgAklAdY4iAT48HKDhTLO5BXBwWLKBUfAVPA0hEIRLhuPMyjrEgADMVFbDsICdsoGDECm6EEmc4jKAAApc1y3FocSkLArIAOSAsCoLgpCGBHCiKQaKQHbAVYPDGGAVgesWiksYQXFrFY5AjlY0rMSmImygA3AqSAUOQdzjtWAC0jlVNUjketABTCmsdB0MY1RWShCpBqq9xaNchDquMwqkIRDKaPAFmbAqGDpqQmZeA53iuY5kUAF6qlkwpVKQKKkC5NSBd4HlQF5WgaHwpCss5OU1QUlk9AiMCFcKKx+bUfX+Vog21Cg-VVeF5CRWRPAxXFbgaIlPQlWVvVDQAxDAUB0pQ0ATStWKOdi6hxKmOD+RZ3g9EGpBZKqFXiOImG9eNPS-ulNzCtcqoKKQgXJTwDipRmcg7mWEj3MtiJlFkFBxDwUCObIsCfVo62sFAWD-UDaUZdCJGuOukPVgd5VtaIwpURdy03GVSOUKj604DgxATV16g8FkjlPcYwoABzU9W7OFQ9T1gPzgsAzjINeEOI40FO6a6KuC7VEwxPeBFUVZlo+GZrAI5LdW72ZqQX7wKwfAJOIE08y9gveAgrAaloiyS9LH1QjMpFE3L4gK5iyulKr6tZVoTsu+dAU9HbWgC9HQWA1CuNyOFGtaDdd2zVodATZn90R957vJzL+OzAo23GOn+c8I5hc5-9-xJxgFTuOnWszcKeuUIbE318QfCwMQrINU1LU1O5nmiLKWgANRaGssVgB11ax2gr3GwzZto8zrM9Kwpy5VOCDCuqg+nhNB-yLlEB5fA3lL7bLziI5qoovIwqOSsj8OADLfuEgAiB9Yr3HYooF2IlDAiSSkDVu4Q+DOyxKA044DhSQJANAgG6FvZzEJMoOgSA6CORwFgQhWwmCbCAA

[5-view-component]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQAq5ADmWQha4qLwWsSFxADWAEbkAB755HU5eQVFohBZoint4pGB1imx1gme1s6u7jzmIATOCGNyXMIA7EgAjABMIAC+eLwCQiIAVlwycgpKwhBgxuSk4lrAonj58NXiTybGm1qsFGBahhJxMZCEgrFZiFAeBhCGUAJ7GPjlDBQeAaKyieHwUgfQwOBxgrQAWmJWgAggBhdIASQA8gA5ADKROJeJ4sh4hDumUa8AAEm0OgK7rotJy+AotLpzFoABTALQYRVihRPVrtToSJBaACEyvgYgFGrumwAlKyCcTCVoAGpUgCiAHUtOSaQBZAAK9LtdPSTMtrPZnK0xixhDkkuDFGBktiohlhlshiewB63mIsD4hBB91TgRDpDDPC14lIcXgeFz3jVgq6WuMUcIBvVQtzmx62y0NFzccMZim9w7CleMvr5GBGH4ghNJorXkCPZAEB4xji3X7KbngXymK1hhKLkqNSTleKpTK8CgdYbTZrElnW+8cnTEHKV7HjdO2Vy5dbM56TDNHh8SsZkrQAJQAVTpUDWQ+OUeiXCBxC1eVJ3gXcQAAGXgPgeB4IoAHFsVEAQky0asjWLUsim2HoNAgeAAHctT1GNyPjcA+CXMjgA7LtN2DUM5HggTvDQljxHFfU0PvB8KKFCSpJvI1ZK3T8eS1blv35ZsulUrRTVkgDZJ4cgUS1KByGIOJBHkDAsngcQ7QQWzxAAIVhKkoA4nEQD-HhTQcKYQFkK4OCxZQKj4Cp4GkIhYpcNx5mUNYAA5Vg2bZdkEZQMGILNgvZM5xGUAABS5rluLQ4lIWAZQAckBYFQXBSEMCOFEUg0UgJ0cqxlzAKxGKknr8sIUq1ischVysI08qzeqTQAblZJAKHIO4N28YkqmqQlGOgAotTWOg6GMaoVoC1kwC4rx5WuQgkPGLVSFi8VNHgJa2yAqF80LHM512wlHoALyXLItSqUgUVIQldsu7wDqgI6tA0PhSBlHaan2w7RGWnoERgcGtRWM7alJ86tAp2oUDJhHg3IR6kqLLRXozNwNE+nooZhknKYAYhgKBRUoaB6Z5rFCWxdQ4mzHBzqW7wehu0gsiXOGNvEcgwBJumemsgsbjrcglwUUhLu+hwMD+uRlKFAHvCi8osgoOIeCgQlZFgI2tH51goCwC2rZtqEZkSi8Ha0CXYaRlGAGYFe5m4Yc9ygff5nAcGIenCfUHgskJLXjC1VLE7nXPwY18QtZ1rRS4uhxLd+oSvCXFdxBocRMV0fdyl2phI4ep65C1aKw1gVcubnA2w1ICz4FYPgEnEemi91svvAQVhkK0RYy++62W+hBLXAjtvV077ve8PaoB62rQt53+WG7nNe6-31lD8NrxjEjlW1ZZnQem-91aP2Oh-Zu39j6zAUMLX+98QE8EJGArQQDG7-B+hgCo7hB6M2HizMelBJ70xQcQPgsBiAyjRhjLGe1Y54y0AAai0GsV6YB8avzHFqNAetp5pznr7TO2ceisFOMDLuCAtRIXIS+emoj5DAwgCDdCLC2GrxeOIQkS4UTyC1ISFYajG5W2weEGKojXr3CKooHe9VDD1S+sY9wSA+DbyxJY041itS2JAPY76wUw5zA5MoOgSA6CEhwFgUJWwmCbCAA


[6-action-payloads]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQDCoi4A1lriWVoARuQAHlo88CXieeRafOUC8DVaohAA5qIpHdUQ4pGB1imx1gme1s6u7jzmIATOCJNyXMIA7Eg4dCAAvni8jcoYAFZcMnIKSsIQYMbkpNXAonh5leJPJsZbWqwUYFqGEuJjIQkFYrMQoDwMIRsgBPYx8YjZDBQeAaKyiOHwUjvQwOBygrQAWmJWgAgukACoASQA8gA5ADKROJeJ4sh4hGqFPIbTaCAAEu1OkLqrotAAKTl8BRPCA8FElACUWl05i0wH6BLAfGyTUIoj4VHIAHctMRYHImuRWFpbu05YaWkKuhI6qRsTD+ghqq0Oi7RVoaBhg1KFGJnSKmKzvATWCljHkCr7hd0tBpDXErTa5QqdF58k1ZMZPV4nX6RTQc5UmCqtABCZP+yvy6v9TVWLSkeDiOKkLz6w0W01FmG2m3kXtaUPwJ5d4ywBFytp-UsEgtllOuvjuvij429US2ycVU2W-pdnt99VaYNQ8TSmcb-1bBwvnj4jvEwlaABqVIAogA6lo6Q0gAsgACvS-50hSTJfqy7KcloxhYoQci1sYFBAiqsSiOKhi2IYTwaqW3jmnwhDAuq-SBChaFyEgeSkJmeC0YEjYikxWHkEC4blt07Fvt4OyBux+GGGYszqqJChVOKPF8fwgiKoqbFkS0BEgHKxhxH00mkXR3jiJiTGGMQWSIsUJTEex5GWbqUDcdhhD8Zurx2babIpIizm8a5Zw8nyM5CWp-RMIqrIEl+WgAEoAKp0syhKsu84qGXmvRMRl3jKfAwIAAU0J5hgADLwHwPAVFoADi2IGmAtkad4hj-qQGhylo-ImvAVBNUZfwgOkCCCPIcpNAAQnwcQWf1RmGBB0qkBAxAQPU5WFIQCLZHNdGGJkvXOKOQQQN2y2zbM7EsOJEbdExxXNV8hrOOpA3iCxIWPawz2fQN32wC9nn-YDGnXaWOz9B18DGkx064ZphjanKxEyU8D10be04YHlrnasY4rinlsotkq8OoaQ6E8OlnlE55nF3VO95hvTEjNgqYMDYFvIIPd3Lc-AgoCRIxPs69gRbKpYsRWLPDkCiTFQOQxBxKN4gYG03b-iNijiBNMJUlAWk4iAYU8BLDizCAsjXBwWLKIUfCFL1lvzC4bhLMoADMSCbDseyCAcxBUZb7LnOIygAAJXDcdxaL2sDigA5ACQIgmCEJHIQKIpBopDY92Vg8MYYBWMaD550HhARwATFYE7iFY-oYJXieKgA3KySAUOQ9z9MS1mEvuUD5Ex1d0HQxglB3ZuskjXjACh5CEL0UxMV2C5uBo8Bt2+DgYOTlM0aWA-LwAXkuTHFKQKKkIS1nT94Q8j2m27iv3pSD9A+Tt-08IwBfWgACME8yjAMnkAkBWgUAgIfovZe7seBr16tKTQ29+hXxvkxQB4CADEMAoBTkoNAWBGCsSEmxOoOI1EcCTzbi1Us2pSBtDlHfHu4hyBgCwTA-oysKa3G4uQOUChSDT13pCA+cg3L+iPt4B2iI2gUDiPKQksgLSkCYjg1gUAsCiL3hIyErtXDwAIRlUht8n6iCYp7Wh6Dbg3xUZQfhWgcE4BwMQWBf91A8DaISdhxgmIAA4bGlk8UuVh4h2GcK0EEqer5WT7wYl4HSekaAmVQroCyORrI1gyjceBq86ibUoHpNBpZeHoXUVoFE30EjiFgX4rhwTvAIFYOIJiKxglvgSXwgxvU3bGLzLpcQqTMQZIctkmRWgWltK0DQ2JpYGnRM6fE-RKFJmMOYYgrQdBYEbJYdM0eyzxGJKhH0oxBCEwZT2TwQkBztmiJXHvQo7hJl5JXoxQp6FYAlNgXc4ghpiDinTKQN+rCSif2HqIZUABqLQ1cuxgB-gs3iTE0DcLKY4ypLi3GwNYGcQknIYQ8x0PeHyuL8Vn3gKPBF9SXiEirPIJihJAE0riZCZ54QnZ4q7OqUOOsmKJ0MInHeTz3BID4K0rEvKzj8q0IKkAwq3wuzOQg5YIA6A+0JDgLAPtthMC2EAA

[7-with-selection]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQDCoi4A1lriWVoARuQAHlo88CXieeRafOUC8DVaohAA5qIpHdUQ4pGB1ilpKkP9gVrpKcS5cnUNgs1gfNlNvXkFhs4IrvBQhvPwYz5Wo17HCZ7Wzq7uPOYgBFsubnJcwgCMdEg4AEwgAL54XiNZQYABWXBkcgUSmEEDAxnIpGqwFEeDylXE6JMxn+WlYFDAWkMEnExkISCsVmIUB4GEI2QAnsY+NMMFB4BorKJmfBSDjDA4HFStABacVaACC6QAKgBJADyADkAMpi8VCniyHiEaoy8htNoIAAS7U6Zuqui0AApdXwFOiIDwOSUAJRaXTmLTAfoIaqtDpdCQerQ0DDhu0KMRmoPiJj9APm7o0J0upghgCEidjKedlXjZ1I8HEcVIXmAWnD9PE9vg6OzFv+DibPAc2t1WhV8G2lptkbrWieOyg7s9NuAVf76KHCig-1dmpF4tFWgAanKAKIAdQmCoAsgAFZUbpUytXLzXt6rGPmEWZW4wUcke2Kia2GWyGdE+s7eYiwPhCApb0jm8G9SDvHgkDyUg4jrUCWhjC1oMfchyWjQMLTwBCZ12FCn0Ielu2eXZ0UCEUVAvX8tEBI45H-CBpnwtDCNeYjXDI8YtAoqjvEBUMjjfQwzAeb1+IUKprVQ9D+EEV1XWw6ihJAJ1jDiPpRJ-Li8l5aDDGILJpmKEovwQgycjwrRpMIhtukU7T6KmbJmPQ6EDSNeDqPneytCYBdWx4JcJQAJQAVSVdVRU1HFrS0nQeF6aC4u8WT4ApAACmgEMMAAZeA+B4CotAAcX5UQBFM6jvEMDdSA0J0tGNcgAHdu1gSrtMMSZQkUNwioAIT4OIDI6rjDAPe1SEYiB6jywpCFZbJRvGLqslgZxGS0IIIGLKaRoeI4WEEpDumgrKqvxPh1s87TxFgm6uNYK7nB88Ynuu17Anel7Ds+3CoGgngElgdF+los56vgZroP7F8WnfcA+CdL8xPRc7xknGso1SwilmMa1rVSx08zdOHwMg2KEKJhDbIkGGsfgDCkwkXM00+7w3MNBAzv1Ln4FNTC7PitmcPY2d6drIie12D1dCtVNKnRHjeK4tiezOrse2JtntPGZWNS8+SfL8nyeHIDloKgchiDiQR5AwNpiw3BA7fEfrGTlKAEYFEAFObfyHhAWQEQ4PllEKPhCm7QOZ1uN4QHeABmJA6ABIEQFS0FiCAwPtRhcRlAAAXhRFkS0UtYGtAByUlyUpalaXBQgORSDRSAwCpxCsHhjDAKxmtrdvs8IQufisch1JOC0MGHqvXQAbk1JAKHIFF+nFYzRWa6B8mgn46DoYwSkXngWwcJYGorRFCF6W5oKLAC3A0eB57PulydmOLN5vgAvJ02mgsUUgHJSCimMifbw28oC7y0BoPgpBrQb1KFvHeogF79BZDAf+0FPhHy0LgsoBCtAoEPsfDB5Ab4vCgloB+9pNAv36EAkBOC8EAGIYBQEHJQaAECihIhAaKfk6g4jARwEfee1UzhLFIG0J0YDV7iHIGAHBpDeE2wgkiFC5AnQKFICfN+GAP50lpmvM4EdphtAoHEZ0opZCwE0VoVhrAoBYH0Q4Qxt45BSxIpwr+-C+QoOgaIaCidxGMP8aAuxDjWE4BwMQXhmD1A8DaKKRRxhoIAA4wlnESf-eR4hFHKK0Fkshp9NQeI0V4VS6kaDiF5LocyRlSjpjitfW+choKRzvLAdSDCzjqLvKQS28AnoJHELwtJKjsneAQKwcQ0EADs2SWwVMgt44c8U1LiFqfUxp2RjItN9CM+ZWgxGlO8JM4pyzylGKsiBKR8DZHULoLw6RTzRSzJOT8a579PF0n+ncuKby5GfOgi85sxIAoYEKO4e5YEKHtOoV0ygvTeGgq0MQK6xBrRwIQUgkogT8jugANRaB+EWMA6CziXLQKo-oUShmONifE-orBoSil1IybmOgaxTF4Wy+QHKIA-3gHvClEzMSigVvIaCop3jiubO4mF4Qo5sqLN6POvVoJV0MFXV+Sr3BID4HMvkGroRaq0DqkAeqWwxzFnHZQXw6CihwFgFOAImD-CAA


[8-separate-highlight-selection]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQDCoi4A1lriWVoARuQAHlo88CXieeRafOUC8DVaohAA5qIpHdUQ4pGB1ilpKkP9gVrpKcS5cnUNgs1gfNlNvXkFhs4IrvBQhvPwYz5Wo14Dp+PekxDTEDxtc8RZ08VlUOTwhOXk1Vsu1fkmvxBEdBql+tYEp5rM5XO4eOYQAQ-nC5FxhABGADMSBwdBAAF88LxGsoMAArLgyOQKJTCCBgYzkUjVYCiPB5SriDkmYwErSsChgLSGCTiYyEJBWKzEKA8DCEbIAT2MfGmGCg8A0VlEKvgpF5hgcDmlWgAtBatABBdIAFQAkgB5AByAGVzRbjTxZDxCNVbeQ2m0EAAJdqdcPVXRaAAUfr4Cg5d01JQAlFpdOYtMB+ghqq0Ol0JBmtDQMOX4woxOGi+ImP0CxHujRk5UmCWAISN2stngp+tnUjwcRxUheYBacsK8QJ+Ac7uRgkOJc8Bw+v1aV3wbZR2OVudaFEKKDpzOx4BT-cco+7Ampr2mi1mrQANXtAFEAOoTR0AWQACi677Ora7pPl667VMY+qELM0bGBQEoZrEogxoYtiGByOZnN4xCwHwhCStmRzeNBpCwTwSB5KQcRziRLQ1pGVEIeQErVoWkZ4PRN5QMxiGEAq27-LsXE4VoRJHHIeE3NkfGsQJaJCa4oneESpZHKhhhmEi2ZqQoVQxixbHAvAqapipgSaSAdzGHEfQ6dhlx5HqVGGE8OSvJh9HudMuxyWxC7dBZ4xSVMsmxgA+hyWqKOIp5Zo5TlaDF8jTqx-6IXwbQJvCMb3mJ4xDiOY5aEZCnyIGwaHAV4nBeJ5n9Ew+UmlYHrPgASgAqs6bVeryMaJXcvRUYl3gmZKAAFND0YYAAy8B8DwFRaAA4gaogCF5NWGO+pAaHcWghuQADu26wFtTmGJMoSxXcTQAEJ8HETwXZchj-gmpA3BA9TzYUhBqtkr3jFdWSwM4SpaEEEDDl9L1IkcLAaYx3RUdNNWsHw4N0TV4g0TjTmY9jdXeETzgkwKWPk4jdU8VRPAJLAHL9BJZz7fAx1UfuyEtGh4B8HcmG6Ry6PjJeM5VuNGBLMYMYxiZSZ9pU8WlTBcgDfRCv0YFEhcxL8DsU2Ei9v2FM0pVCBowGQahijEiK6b3FKceeuzoJO67BmujRq2JRm76zto1uO4O22dV3g1ZxNRZPDkJqVHvMQcSCKlbTDu+CAp+I91KvaUB84aICR3eDhIiAsiMhw+rKIUfCFNuZdHvC6IgAATAAHEgrf4kSJKCGSxCEWXPq0uIygAAIMkyLJaKOsAxgA5GKEpSjKcoUoQmopBopAYBU4hWDwxhgFYx2zrvg+EOPrdWOQdknJGGCXwvqYANxekgFA-MRZwWq8ZrHWgPkKi3c6DGBKO-HgK4HBLAOhOJkhBejwiokOfCbgNDwFftA+UZEKI-28P-RBAAvO4bQqLFFIJqUgZpXiQO8IAqAwCtAaD4KQGMf9SgAKAaIN+-RVQwFIVRDEYCyjCPAVoMRZQUAiLoaVcgiC3ByBQduHKGDZEUKoUI8RABiGAUBDyUGgOo5kVCzQGnUHEIiOBwGv28P0JYpA2h3BoT8cQ5AwBCJkf0JO5FmTMXIHcBQpBIHYIwLguQhtaz4KKIDNoFA4h9jNLIWAfitDaNYFALAISHBhLVvKHi0SNH6i4Yw0QVEsQ2P6EU6hyTUnaJwDgYgsj+HqHuGaNxxgqLt0qWcFppCXHiDcR4rQ3SIHLi9Lk3xXgbJ2RoOIPUugfLZFeO2RKCCkFKLqP9SgdlMHeNHLBUgCd4CYwSOIWRHTPE9O8AgVg4gqIAHYekrkmRRd2wl9EzPEHMhZSyVnRNufcrQ1ixlnEuSM55EzwleGMNEhxTjKJaDoLI+FzjAUgMhTgvJ7ydj6NhYlVFPAzToqRSEkUq55SFHcNE9ZijEV11grAXZsiSXECxsQGMLC2EcJKCU-I6YADUWhW5DjALwsFrEqJoC8WcWpRy0kNKaf0VgNIzR+iVJbHQM4piyJVfINVEAiHwBAaKi5XIzStnkFRM0GJTXjMpe4JA9cVVDmzCPWKVEF6GAXlgnJVLwh8DufqN1NIPVaC9SAH1K5G7O2bsoOgSA6BmhwFgRNhImAEiAA

[9-conditional-rendering]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQDCoi4A1lriWVoARuQAHlo88CXieeRafOUC8DVaohAA5qIpHdUQ4pGB1ilpKkP9gVrpKcS5cnUNgs1gfNlNvXkFhs4IrvBQhvPwYz5Wo14Dp+PekxDTEDxtc8RZ08VlUOTwhOXk1Vsu1fkmvxBEdBql+tYEp5rM5XO4eOYQAQ-nC5FxhABGADMSBwdBAAF88LxGsoMAArLgyOQKJTCCBgYzkUjVYCiPB5SriDkmYwErSsChgLSGCTiYyEJBWKzEKA8DCEbIAT2MfGmGCg8A0VlEKvgpF5hgcDmlWgAtBatABBdIAFQAkgB5AByAGVzRbjTxZDxCNVbeQ2m0EAAJdqdcPVXRaAAUfr4Cg5d01JQAlFpdOYtMB+ghqq0Ol0JBmtDQMOX4woxOGi+ImP0CxHujRk5UmCWAISN2stngp+tnUjwcRxUheYBacsK8QJ+Ac7uRgkOJc8Bw+v1aV3wbZR2OVudaFEKKDpzOx4BT-cco+7Ampr3r6oAcR+ACF3CW4zPE1ooAm+KeWYxheFbfgehTuEgv7-hgsiMnwPBKhghSEHeXqmhaZpaAAavaACiADqEyOgAsgACi6eHOra7qYQ+aLVMY+qELM0bGBQEoZrEogxoYtiGByOZnN4xCwHwhCStmRzeExpAsTwUHiKQcRztJLQ1pGUHseQErVoWkZ4GpN5QFpHGEAq27-LshnCVoRJHHIok3Nkpk6eZaKWa4NneESpZHDxhhmEi2a+QoVQxtpunAvAqapt5gQBSAdzGHEfTBUJlx5HqUGGE8OSvAJal5dMuyubpC7dPF4yOVMLmxgA+hyWqKOIgFSbZ4zNfI046WRHF8G0CbwjG94dYEQ4jmOWiRe58iBsGhxjfZtl3vFTCjSaVgelhABKACqzrbV6vLAf0dy9FBGWBNFkoAAU0GphgADLwAhFRaE+BqiAIhVjYYeGkBodxaCG5AAO7brAv2ZYYkyhC1dxNK+fBxE80OXIYZEJqQNwQPUL0oWq2To+MsNZLAzhKloQQQMOONo0iRwsP5GndFBD1jawfAU6pY1KSpVWBFzPOC94wvOKLArcxLTOC8ZUE8AksAckcEHhCKIACZlWimiodFnMt3hA-AYNQfuXEtLx4B8HcWvAL5HPjJeYEYDdGBLMYMYxtFSZ9pUbWyfJp1jT7akVRIZsu+H4i9v2ks0vNCDswGQahqzEi+3HRmecekezhZO67BmujRq2JTx76Ofs1uO6Z22gt3nFRz7shH4AGRt9rXfdz3uv6+MiX8elWiieJkmGGr+yhVyX752rsUcjrW1656ZzrfFPDkJqUHvMQcSCN1bTDnhCAH+Ir5KvaUBW4aIBNzwaE8EiIBwcYHD6sohR8IU27P0e8LohADgHASAMT4iJCSQQZJiASWfj6Wk4hlAAAEGRMhZFoUcsAYwAHIxQSilDKOUFJCCahSBoUgrthxWB4MYMAVgwazgoTAwgSCABMVhyCpROJGWCElsGpgANxeiQBQH47VvAWleGaMG0B8hQVYXQOgxgShCIfl6JYwMJxMkIL0eEUEhxiTcBoeAAiVwOAwIHWYV0pE6IAF53DaFBYopBNSkDNK8VR3gZFQDkVoDQfBSAxkkaUaRsjRCCP6KqGADioJgOUVoOJZRElaBQEolRkTyA6LcHIfR24hrGM8UUZkrjYnxIAMQwCgIeSg0BCnONcWaA06g4iSRwMogR3h+hLFIG0O47ifjiHIGAWJaTCl7zksyLS5A7gKFIKosx8pLHymjuIooRM2gUDiH2M0shYCTK0GU1gUAsDzPMUsguVkqnWOKfqUJPjRBQSxO0-o9Tbm7P2WU4BxBClRPUPcM0gzjBQQABzPLOL8hx-TxCDOGVoUF6S1GrkWcxWYyVUo0HEHqXQxVsivHbFdbRuicl1BQpQVKJj+jjJYqQHe8AuYJHEIUwFIywXeAQKwcQUEADsYKVwWJRfKYyOgaHosxUxbFzxcWlHxbmOlnKtBtIRd4ZlcLeVen5RMrwxhVndN6QpLQdBCm6r6ey+VrC1XIs1RcnYVTtVXWNTwM0pqoKGuXCKJFrdagEsyUS-V38WKwHJYU51I9ubEBjP4wJwSSh3PyOmAA1FoVhQ4wARLOCqtAozKWUA+V8wprAaRmj9EqJOOgZxTHzYWux8B5EpqZVyM0rZ5BQTNBiOty5zFqyQD-AtQ5szwJalBbBhhsGmM7ZBPgHL9T9ppIOrQw6QCjpXH-HOADlB0CQHQM0OAsCbsJEwAkQA

[10-effecter-with-dispatch]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQDCoi4A1lriWVoARuQAHlo88CXieeRafOUC8DVaohAA5qIpHdUQ4pGB1ilpKkP9gVrpKcS5cnUNgs1gfNlNvXkFhs4IrvBQhvPwYz5Wo14Dp+PekxDTEDxtc8RZ08VlUOTwhOXk1Vsu1fkmvxBEdBqlQRdLgBleDbNz3ObApqseDiJ6fOo8KBadSEYywPgATy+gKK7i0rHIpHWfGqxngpEIclBJ3BZ2sCU81mcrncPHMIAIf15ci4wgAjAB2JBYEAAXzwvEaygwACsuDI5AolMIIGBjFTqsBRHg8pVxKaTMY5RSKGAtIYJOJjIQkFYrMQoDwMIRsoTjHxphgoPANFZRP6GVbDA4HO6tABaJNaACC6QAKgBJADyADkoYmk7GeLIeIRqunyG02ggABLtToN6q6LQACnLtPgpruIZKAEotLpzFpgP0ENVWh0uhJB1oaBgFx2FGIG9PxEx+pPG90aD3KkxZwBCLdr3dY-f9UiouKkLzALQLn3iTumk9NuUOD88Byl8taGFwrO7bPgoprCgoUADkOc79MAj5Ll2WjgbsCr9DQuIBmioiDsO96XPhBGEfGKhJgmRwolhraOuIzquu66pyPigbwKIlAhqQGDiP6NzkCGGCyGAVhxM4jJWPsADUSEgfAGDQIQNDIVATB9kcnFZDwrZXniopNNBWkGmWMkMRpfYqWc3hqYorZQLS9TQRhtJPK2ADiPwAELuKaNnPqZWjEaR-RyhuPDBT+orVK54gebULbAS+OK2VBw6tnBi7SaahTuEgCXPvx5D6nwPCEhghSEHKZlxlYhYJloABqmYAKIAOoTNmACyAAKeYNbm6YFgF34luFWj0oyswtsYFAujhm5USAtiGKao7mVoxAEoQrojkc3ijUyPDZeIpBxF220tKuTbZZN5AuiuU5Nngp2KZdU2ED6sL-LsD0rahK1yGtNzZM912vTpcJfd4CowStohzWYgojpDChVK2V03Uipng4EMOGHcxhxH08PLfhXH0tlhjoi8pSLadFMrFAQM3W+3SY+Mf1TIDbYAPqmqGijiElW0reMvPyE+10dVNfBtLSfKtmZhFXuIN5eKjIPyFWNaHELWg-eM5WY8pxbxqRWgAEoAKq5tVxZWil-R3L02VE4ESKugABTQp2GAAMvAhUVFozmkHwogCNT2uGA1pAaHcWi1uQADusKwOH+GGJMoR83cTRuXwcRPKnlyGB1tKkDcED1L7pWBtkhfjOnWSwM4hJaEEEComXBeCkcLBHEzEjZZ72usHwTcndrh3HSzgQj2P0-eLPzjzxSo9Lz309PeUCSwKaRyZeEDogHXOhQJtNDiqaABMpoAMymigpo4CwflVSRRZnLrWgx-ACfZQhOEtDmksO4i0EamiHuMeC0kMCuwwEsYwrZWxIm7OefsADdpyDttrZBp1+7iD-tAvBZ5ey921lqDWCBB6VmrHWc6zMdCoNIfhTeCE3pwl2IOXQLY9wlGXqDf4g8AL-BQSQ6e5U+wb2gfvLQAAyGRfc5oLUJqtdam1DD732Ijc0cVlz7wxv0ZSmMeC8XgNld4xA4iCFFm0VEDUEBWKioSTMUA5rRhABIz8ZlBQgAEsYDgDJlCFD4IUWE3jwJ8jFCALASA6DykVCAJEKpiAbW8aWbU4hlAAAE9QGlINUG8sBWwAHInQujdB6L0apCAhhSBoDiFRxBWB4MYQSCdOwcWSYQTJl8rDkHxqybo-ENpFL7AAbmLEgCgPxBbeCTK8BMCdoD5GypfOgdBjAlHGTwL8DhgF3hGuQQgvQ+TZSvASNwGh4CjJ2d6DBd5+jzKOQALzuG0bKxRSDsQTK8LZ3hFlQGWV-PgpBWxzNKAspZogxn9ADDAV52VxTrLKIijZWgUVlBQEi35ByjluDkKc2EMtLnYo+exBFqKADEMBsRMhSFAElVIvnB3UMJbKOANmjO8P0JYpA2h3G+T8cQ+UEVYv6BYsapBLrkDuAoUgWybkYDubdbcM5nZBOmG0CgcQsQJlkLAKk2UKWsCgFgeVDhFUMj2mwj62I1WMoZBCgFohso3w5Q8+1pBdWUANVoClOAcDEGxbC9Q9wExCuMNlAAHG6s4wbXkCposKrQ0bNmfmLBasaXhcb4xoCTeAuhaavAPM7A0uKTl1FKpQfGVyxU3iZJKnE8AR4JHENi8NIqY3eAQKwfBWhJQxq-Bmq1ikGF43ELmyMBbnjZCLTMrQ3be3stTWcdtyaB3pruSNOdPK+X7S0HQbFO7+ULpWeu25lq5DWp2NiYw27gW7oTCe-d8qHSDRKuSEthzjn4orbS6t2Kn3EFHsQVsGhgWgoFSUR1+QBySUvleMA0KV3XWymgUVZw9U+r9QG7FlJ5AJnLISShOhnxTFw1qAjEAnmmK0PB0IbbzQJj3PIbKCZxQIbNd6feSAQmUivCONJfNspFMMEU655ruN8B7QyATWohNaBEyAMTX4wnvRFGWZQdAYkJhwNE2JQU5RAA

[11-effect]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQDCoi4A1lriWVoARuQAHlo88CXieeRafOUC8DVaohAA5qIpHdUQ4pGB1ilpKkP9gVrpKcS5cnUNgs1gfNlNvXkFhs4IrvBQhvPwYz5Wo14Dp+PekxDTEDxtc8RZ08VlUOTwhOXk1Vsu1fkmvxBEdBqlQRdLgBleDbNz3ObApqseDiJ6fOo8KBadSEYywPgATy+gKK7i0rHIpHWfGqxngpEIclBJ3BZ2sCU81mcrncPHMIAIf15ci4wgAjAB2JBYEAAXzwvEaygwACsuDI5AolMIIGBjFTqsBRHg8pVxKaTMY5RSKGAtIYJOJjIQkFYrMQoDwMIRsoTjHxphgoPANFZRP6GVbDA4HLIeIRqii0aIAFJMry6LQAClxAZTpvIxjcooAlFpdOYtMB+smntmiyWExg4qRYKX+hhATxs6RPgaE01K1o+3jRfA1Rns6WO2cu1ke1BafVh3nafXG3zCBhA03TUvxHwZw45bGeO6tABaa9aACC6QAKgBJADyADkoVfr2f44mtA-yDaNoEAACXaTpwOqLNs0TWl4FNO4QxKcthxrM4EGqVoOi6CQKy0GgMEI2CFDEcCcPEJh+iwiDuhoRDKiYPCAEJqPIuisQY-o+3EVsvGALRCJ9Q8FFNVjINPHgJLjUVqhhOE8Jg4T4K0YUFCgFCqxofpgEE4jlNU3YFX6GgHTObw6zTDM8CONDLi0VtYCQB0QCdF03SsdU5HxQN4FESgQ1ILt-RucgQwwWQwCsOJnEZKx9gAahUpSMGgQgaAMqAWCObxdz5JyAHEfgAIXcayzK0CTvEonhqukhNqkK8QStqaC9P3ZcNJzHSiKU01CncJyDz4cLyH1PgeEJDBCkIOVZwcC9r0vLQADUnwAUQAdQmF8AFkAAV3zWt8H0-RafxkrR6UZWYs2MCgXQrWJRGzQxbEMU1bMCYgCUIV1q2yy6GQzJzxFIOJ4IBsTuicu6i23KGJDKuyMph+7twypHAiM8q5G+m5slRuGMHHOFMYVfCjmewwzEFatyYUKps1hl0MCRGdMe8KmQDuYw4j6WnPvGcRIycwx0ReUp3oB8WVigQmWYRi0AdxqYCZzAB9U1Q0UcROsFy5tfkISiz2+6+DaWk+WnAHvG43jLrR4n5EA4DDnK7xsfGWbMaYObzysL8loAJQAVTfQOzytbNPruXonP1pFXQAAq093nIAGXgcaKi0fLSD4UQBCltPDDW0gNDuLQQPIAB3WFYGLuzDEmUIdbuJoir4OInkby5DD22lSBuCB6kz6bA2yXvxmbrJYGcQktCCCBUSHnvBSOLLysVpzU7s1g+DniG09B8GOcCffD7P8yD+cK+KRvo-xk38YUfKBJYFNI5+vCZyp50KA-o0HFKaAATKaAAzKaFApocAsC0BeFQZ0ziey0BXeANcnJ6Uei0F64A+B3HenTU0u9Ai6WSonDASxjDZmzEiBCHFkLYKulOfW3g6GQzIpBTByVFbsSQs-S4WoXYIB3gBICoFOHdHofwu+r89I+lhP8XYFZdBZnoiUO+JN-g7zkv8aRDEz6zVLGfeR38tAADJzGU1wW9AWWhvp8F+qLEA399j03NIpOCU13Ds36L7TGPBQrwEGuQYgcRBBGzaKiNaCAIlNUJE+KAuDowgGMSeWcgoQARWMBwBkyhCh8EKLCTJqktzKHFEgOg8pFQgCRCqYgv1Mnxm1OIZQAABPUBpSDVActmAA5K5V07pPTenVCGFIGhAoVHEFYHgxhIo1zgoFBphA2kgKsOQPmrJujhV+n00sABuM8SAKA-H+mca8rxLw12gPkJyIC6B0GMCUI5kkzxLErvxA0hBeh5RHLCS2Gh4AHKkt6ZhsxPpXJ+QALzuG0JyxRSABUvK8V53gblQDuagvgpBsyXNKNc25ohDn9ADDAOFTlxRPLKFS55WhaVlBQNStFl1yA-KbE5PsBI3BApZYigKlK6UAGIYDYiZCkKAfKqTIvzuoaKTkcDPIOd4foSxSBtDuCin44hRqUuZf0MJ11SAw3IHcBQpBXmgowOC70itzneAKdMNoFA4hYkvLIWAVInJCtYFALAlqHDWqBnIBRcJlGQulQyQlmLRBOXAUq-o-Ko0eq9VoIVOAcDEBZWS9Q9xLw6uME5AAHAms4Oa4VavEDqsAxbS1WptToOZfMaDC3pLoGWrxGKfW+b8uQTlCnir5sCg1rYmTGpxPAfeCRxAsoLXq0t3gECsHEE5SUdbA02tDUo7EPNm2tvgO2542RO32q0EuldWhFUvP6HOrQJbr1vJ4Bu4NXhjCnrVRqngTk6Aso-Zq899z11gpfVunY2I32fT-TwS8AGtA-pPKZQNZju1st7V+uo01KBDpZbB4gB9iDZg0DivFWqSjRvyOWRKIC+xgBJWcW9aB9VnBTeO9NmaWWUnkJeRMhIRE6EPFMDjWpuMQGhcErQ1HQizvNJeei8gnKXnFDRgN3pv5ICKZSPs1Zmk6ycn0wwfSQVIYGnwZdDJtNal01ofTIBDMSRKYokUCZlB0EqZeHAWBKnyiYHKIAA

[12-effect-creator]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQDCoi4A1lriWVoARuQAHlo88CXieeRafOUC8DVaohAA5qIpHdUQ4pGB1ilpKkP9gVrpKcS5cnUNgs1gfNlNvXkFhs4IrvBQhvPwYz5Wo14Dp+PekxDTEDxtc8RZ08VlUOTwhOXk1Vsu1fkmvxBEdBqlQRdLgBleDbNz3ObApqseDiJ6fOo8KBadSEYywPgATy+gKK7i0rHIpHWfGqxngpEIclBJ3BZ2sCU81mcrncPHMIAIf15ci4wgAjAB2JBYEAAXzwvEaygwACsuDI5AolMIIGBjFTqsBRHg8pVxKaTMY5RSKGAtIYJOJjIQkFYrMQoDwMIRsoTjHxphgoPANFZRP6GVbDA4HO6tABaJNaABiAFEACrpAASWgAUlCAPIAOS0aZT6fSGcTSdjPFkPEI1RRaNEeaZXl0WgAFLiA63TeRjG5RQBKLS6cxaYD9FtPbtDkeNjBxUiwUf9DCAnjd0ifA2NpqTrR7vGi+Bqjvd0cbs5brI7qC0+rHvu0+eLvmEDCBpemp-iHwN4OHKdYNk2WjqnIKaoui1Jdt2q6wJaIo8OOx40HObYdqawBIShS5ykwdbxkmCZaAAglWACSJZQjWCZgaK1QZuQbRtAg2btJ03HVAhTa0vApp3CGJToVOM5nAg1StB0XQSBOWg0BgKkCQoYjcfJ4jEWcsk8d0NAiZUTCKQAhHpWmGVixn9Hu4irl4wBaCpPqAQopoWbxoE8N5DjgdUMJwop3ZqUJWjCgoUDiUp-TAC5oWmhFuwKv0UE8DBrYMt2jriM6rruml+KBvAoiUCGpBbv6NzkCGGCyGAVhxM4jJWPsADU4VuRe0CEDQSVQCwWgAOI-AAQu4o54A4Ol+cxw1jeS-Fdf+z7Rd2cWqctZLhDiz51eQ+p8DwhIYIUhByrecZWAxWgAGrUWmADqEyFgAsgACiWabFhm9FkUxjZ0gyHaKcYFAuhOsSiNlIC2IYuFHMQBKEK605HN49KMnISB5KQcRCejLSabxONg0O36ed0U1nOM-Wk+D379dT4wpTTWhyEjNzZPT5MYOecLM1oCoxWz0OGGYgrTsLChVN2ZMuhgSI3oL3hiyAdzGHEfSS5Jlx5JGOOGOiLylPDhPGysUA8wrlMSCrgQc1M3M9gA+qaoaKOI0W63rWge-IrlDu94N8G0tJ8tehPeHZDlaPL35amxHGHGz3isyzk39Ewl08KRyYAEoAKqlv9PAOFa639HcvQ4z73hIq6AAFNCE4YAAy8BHRUw2kHwogCGbqcOiAaakBodxaNm5AAO6wrAg964YkyhJ7dxNKNfBxE8C+XIY720qQNwQPUHdnYG2Q7+MS9ZLAziEloQQQKih-b4KRwsEctviDjLdD6wfC3wJkPcQeMgF63-oA+23gIHOCgRSABsD372zpuUBIyEHRs0KO4Q2IBL46CgKjGg4pTQACZTQAGZTQoFNDgD+Zx05aHHvAaeONQqQxaDDJYdx4ZS1NL-cY8UuqK0aN+JYxhuzdiRMJayYl2GYyvHXQIUjCZf1YUIr+VlRJ0L1ondiCAf6sT0fALicleLSK0XAlBoUfSwn+LsCcuguxGRKHA-m-wf6BX+OY4y9sLqZzZtYrBtQABkwTP4wzhjrLQSM+AoxwUE-Y0tzQhSEUE5WWd-H1xqvAHG7xiBxEEAHNoqI0wIEKeIUahJqJQBhtGEA-iLoOEFCAeqxgOAMmUIUPghRYTNIil+ZQJCSFIBIfKRUIAkQqmICjZpDZtTiGUAAAT1AaUg1QkLdgAOROhdG6D0XpLwhhSBoCqFRxBWB4MYBq09BIVWmYQRZJCrDkC1qybodUUabNHAAbjrEgCgPw0ZnCTK8BM09oD5BxiQugdBjAlF+T5OsXDHJx3IIQXofIcZ7gJG4DQ8Bvm+W9PI2YPtQXooAF53DaDjYopByoJleAi7w4KoCQsYXwUg3YQWlDBRC0QPz+gBhgFSnG4pYVlDFXCrQkqygoHFUy1F6KlxYthOHPFCraXlVFVKgAxDAbETIUhQA1VSelvd1BNRxjgOF3zvD9CWKQNodwGU-HEAdUV8r+j5KxqQUm5A7gKFIAiwlGBiXei-kC7wXTphtAoHELECZZCwCpDjHVrAoBYGDQ4UNwM5A2LhPY0lpqGS8tZaIHG5CbX9E1SWpNKatA6pwDgYgCqhXqHuAmN1xgcYAA4q1nDbVSl1uV3VaD7fCkCdYc1Yy8BrLWNBxCRl0BbV4JkfYGiVZiuoZ1KBa3xV61cTJfU4ngP-BI4gFVdo9f27wCBWDfy0JKft3lp0dnzXY7Ec7xALqXSu0oa7+h3ofdaidZwr1jufVOsNcdI1aAdU6ngOM6AKvg86oDULINEtzd6fqMGfaoZ4AmdDWhkMgQwdmoJsGN0Yuxtuw1e6FXEeIAA4g3YNAcq5S6kopb8jjg6iQvcYABVgaHDjNAnqzh1uPY25tCrKTyATE2Qk+idCASmHJrUimIDkpyVoAToRL3mgTEZeQOMEzikE1m70QSkA9MpHuacczPY402YYTZBKKPYL4PehkjmtTOa0K5kA7nvJ9NsahMUIA6BIDoAmHAWAYvyiYHKIAA

[13-init-effect]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQDCoi4A1lriWVoARuQAHlo88CXieeRafOUC8DVaohAA5qIpHdUQ4pGB1ilpKkP9gVrpKcS5cnUNgs1gfNlNvXkFhs4IrvBQhvPwYz5Wo14Dp+PekxDTEDxtc8RZ08VlUOTwhOXk1Vsu1fkmvxBEdBqlQRdLgBleDbNz3ObApqseDiJ6fOo8KBadSEYywPgATy+gKK7i0rHIpHWfGqxngpEIclBJ3BZ2sCU81mcrncPHMIAIf15ci4wgAjAB2JBYEAAXzwvEaygwACsuDI5AolMIIGBjFTqsBRHg8pVxKaTMY5RSKGAtIYJOJjIQkFYrMQoDwMIRsoTjHxphgoPANFZRP6GVbDA4HO6tABaJNaABiAFEACrpAASWgAUlCAPIAOS0aZT6fSGcTSdjPFkPEI1RRaNEeaZXl0WgAFLiA63TeRjG5RQBKLS6cxaYD9FtPbtDkeNjBxUiwUf9DCAnjd0ifA2NpqTrR7vGi+Bqjvd0cbs5brI7qC0+rHvu0+eLvmEDCBpemp-iHwN4OHKdYNk2WjqnIKaoui1Jdt2q6wJaIo8OOx40HObYdqawBIShS5ykwdbxkmCZaAAglWACSJZQjWCZgaK1QZuQbRtAg2btJ03HVAhTa0vApp3CGJToVOM5nAg1StB0XQSBOWg0BgKkCQoYjcfJ4jEWcsk8d0NAiZUTCKQAhHpWmGVixn9Hu4irl4wBaCpPqAQopoWbxoE8N5DjgdUMJwop3ZqUJWjCgoUDiUp-TAC5oWmhFuwKv0UE8DBrYMt2jriM6rruml+KBvAoiUCGpBbv6NzkCGGCyGAVhxM4jJWPsADU4VuRe0CEDQSVQCwWgAOI-AAQu4o54A4Ol+cxw1jeS-Fdf+z7Rd2cWqctZLhDiz51eQ+p8DwhIYIUhByres2NtUI3iMWjRfEtgkrYBa2Sd48XLf0SKurtgE+lM8DdgwWg4KOGBLMY3ZlMeJQYEik39D1SB-XwAM3EDINgxDJjQxOU5w9AiO6ZpvEo5hfCwM4pqsJT1MUnTYW01TTOMywIGXTwpHJgAatRaYAOoTIWACyAAKJZpsWGb0WRTHXVo9KMrMXbGBQLr4-0ojZSAtiGLhRzEAShC-e9lxKx2KPiKQcRCUc3ied0KNq0O36OxIU1nOM-XO+r379Z74wpV7WhyEbNzZL7rsYOecKB1oCoxSH2uGGYgrTonChVN2LsuvDjQ3vHDs63cxhxH06dm+M4iRijhjoi8pT6-bWgNysUBR3n7sWi3YdTJHPYAPqmqGijiNFVeXKP8iuUOYvq3wbS0ny14t94dkOYrfsx-IbEcYcIfeMHQfE94TCc9z5EAEoAKqlnLPAOFa61IzwvTk0cwA-eTg3dz-iWwn+LsFGPAEjIW2nXEA+sdBQF+jQJgx9AhpQynBHWToXRuisIVAkxASplQZJVYw1Var1Uas1Qg0Dbr3UEIQW8Z944aAgPAAA7ijUK+MWg6yWHcaBwBE40COJ9QS+caE4yht2JEwlrJiQ4RbOQL9D4HCLoEP+nVhHdysqJdmiitR7wQOTVi7FOKk26FIrRyjvA+zUepfqE5dBdiMiUCxodDxwnJoFf4ZjjLKIuqfQIoVTrkgAGRBKOCnXWmheGt2Nr9QwhR3D7EzuaEKXVAnkELv0c+8ceA1XgCjd4xA4iCBnm0VEaYEDFPEKNQk1EoA62jCAYmF0HCChAPVIhCBSDKEKHwQosJWkRS-MoNAdAkBoHlIqEASIVTEBNq0hs2pxDKAAAJ6gNKQaoSFuwAHJ0H5Q9F6S8IYUgaAqhUcQVgeDGAaswwSFVZmEGWQAJisOQcurJuh1RNts0cABuOsSAKA-GnP0JMrwEzMOgPkFGTy6B0GMCUf5Pk6zcMcorcghBeh8hRnuAkbgNDwF+b5b0cjHL9HBZigAXncNoKNiikHKgmV4SLvCQqgNCrQGg+CkG7GC0oEKoWiD+f0AMMAaUo3FPCsokqEVaBlWUFAUqWXosxUuHFsJl4EuVfS8qErZUAGIYDYiZCkKA2qqSMtIHwdQTUUY4ARb87w-QlikDaHcJlPxxAHQlUq-ohTlakGduQO4ChSBIuJRgUlGk5K8RBWcHp0w2gUDiFiBMshYBUhRvq1gUAsDhocJGhkHYfSAJ2NiM2OqGQCvZaIFGABmB15KLVVvTZmrQ+qcA4GIMq0V6h7gJi9cYFGAAORtZxe00o9blb1WhR2IpAnWQtysvCl3LjQGu9JdBt1eCZM2BpVXYrqGdSg5dCV+tXEyQNOJ4C0wSOIZVg6fVju8AgVg4gUaSjHd5JdxbbGrvEOuyMW7njZB3XGl9N732g2fTUIds6v2LtJYrcDWgXVup4CjOgyq0PutfVBp5CGSVFrkCWuEuxkNmxwzwBMeHMPhodI-b08Tah7oxViuQKNekmtPcq2jrdKbEG7FynlfKSjVvyOODqTy9xgGFWcR9WgRkwdbVejtXblWUnkAmJshJ9E6EAlMDTWptMQEpXkrQ0nQgPvNAmIy8gUYJnFDJ-NTH3BID6ZSPc04FljxRtsww2yiUFuY0gPgb6GTea1L5rQ-mQCBe8gM0tS4xQgFGXQBMOAsBIDoPKBBQA

[14-subscriptions]: https://flems.io/#0=N4IgtglgJlA2CmIBcAWAbAOgJwFYA0IAzgMYBOA9rLMgNoAMedAugQGYQKG2gB2AhmERIQGABYAXMNQLFyPcfHnIQAHigQAbgAJoAXgA6IPgAdjhgHwqA9Oo3n9PFYXjFxEOfZ5atK0Sk-e3gAi8GDkSA7e1n4BPgCusLFRsBBJgQDCoi4A1lriWVoARuQAHlo88CXieeRafOUC8DVaohAA5qIpHdUQ4pGB1ilpKkP9gVrpKcS5cnUNgs1gfNlNvXkFhs4IrvBQhvPwYz5Wo14Dp+PekxDTEDxtc8RZ08VlUOTwhOXk1Vsu1fkmvxBEdBqlQRdLgBleDbNz3ObApqseDiJ6fOo8KBadSEYywPgATy+gKK7i0rHIpHWfGqxngpEIclBJ3BZ2SbMuWgAqsYbOQAO5ePikCgCrQrYlaMIaJp-VzuHgsyHWBKeazOBUeEAEeVuORcYQARiwSAAzFgQABfPC8RrKDAAKy4MjkCiUwggYGMVOqwFEeDylXEgZMxitFIoYC0hgk4mMhCQVisxCgPAwhGyhOMfGmGCg8A0VlE2YZYcMDgcya0AFo61oANIAUQAmkEAPIAdQAcloodyAEJQ9IAJQAkgAFAAqY-bvbrNcrPFkPEI1Ul7yFULihRIpAghQZWl0WgAFLic2iA1pyMZ9auAJTH8xaYD9Fdrlp8LEIaknwvPq+RwQKwZ6FhgkpaAAhLoJ63vehAQfAhJPqQqJxKQSrsjiEB4rSTynvBiqIbm94Pv0Vr9HwMBNrK8gADK4e6DKnoYG6CkqOpfj+DLkWcaHiBhXink+ugvmhMrwLRijiIxa6KCxbHIZunGBqI35wLxDiUVhH7VHIDbIUEHHHmekqhlqPCiS+NDsVuO57geDKBsA5l1JZVpMEu1YLloABiTZTukAASWgAFJQnOWhNn5AXpFOtZ1kuekUqiTxhUyXgnueuGXk8gZEQa1lAWcKJXoRd7ERgGGwHx3gYICPCnmheIGk0YlaC1PqrvATqZSJdVaA1WRNVAtL1B1F74aIFUIRgpGKoGY3iHwD58TpDgpc6ch+WlWR-meNUWWRgE0GV6WZS5R3ufenneVYiU1loACC8Wzt2UKPclBrVFO5BtG0CDBe0nQg9U2VrrS8CBncBYlMVb5nAg1StB0XQSKZNAYNjkMKGIIPo+IXlnKjoPdDQsOVEwplQaThMU1iVP9AJQmvkNOMrQoakE2DOkbcuP19rC-ymaeuPQ1oeq7MVND9MA2MZpzEtS1ANr9NtPC7VeikgHGCZJlYGv4rm8CiJQBakA12Y3OQBYYLIYBWHEziMlY+wANSS0rGDQIQNAqywWgAOI-AO7gPngDjE5tgsh+IYe1BDStLeNxWnvLHNQ4GhTuEgOLjfb5Det+hIYLuVp8THq7VHH3aNF8SdZ-nK1p4j9WZ1z-RIomzd8BmUzwKeDBaDgD4YEsxinmUHUlBgSIR-0vt58tfeEAPQ+BqP48mFPgGz9AC8kzz3R52dfCwM4gasOfl8UjfEvXxfD-3yw2mVwL1dC3CvKmeLgFtzoUCYtvYq2PLBcoCRaqdXQphL2UNmYwK8DQGEcJAziwzMLHY2InpGmJvzFKKD-jGSFL-JW-9F5APQaA2CJ4eCQNQoguBCgEGCVgcgzBIYmG9VAZ7XB2l7qPS0AANTHE2TsEx2wAFkJxzibN2Kcn0FzfU-vSRkswTzGAoAmZ8-QZqGFsIYFyRxiAEkID3AB4xVGZTzuIUgcRoZHG8HTMGedNG3kQs47okdsLeBVq4rRiEVbePGGrbCcgTE3GyP49xGA2qoIooGWW2E9EgDMFxYANogxVFPG4hMc9GhrWCYEFJdxjBxD6OkxxeRSx50MOiF4pRDFVPqSsKA0S8meIkEU8Y4SphRLPAAfUDIWGSCMqneBGfIRWt4JxaL4G0WkioRLjOgawrwuTEJun+oDQ4PitChJCYfbwTB34+XrCObk84kpYTDOnRePBeinyOMAbup9A6dPEG8tBHDdh5zoVQbOucYwgEMToKAPcaBMAOYEDWWt0SkFYrrcQ8ZEzJiNgSYgptzYMitsYG2dsHZOxdoQUFtd66DVfmcDQEB4ACjzn-DqKSlh3FBRkxJRwFboO7tvSep4kQw0ZvDQCVi5B3L2fyqpHz6Xew+QzOGlKuRbIBggU+f1lXwGBmjMGAr5XdMCH4rhGC4S7DASeSmJQ9XeDif8U+hDXA6qpnqiuRz9XexzrUAAZB6o4KSDHpK0CYvgZjakgHdfsTJChsnoPdYU-oJyik8FtvAZe5BiBxEEFMtoqImwIAzfHQkY4oCIvLCAF1hAHJkAgJVA00qoanSXOMKhPzsQwVoZArQXqjhNuNdiF8dAO3erCTwQyhJiFNUMM9UUgpeSgrteIXkh8u0gObdBcB-zYADqXVDI1-wTUqDPOg32GAED3HyLWLQRonydqHSOsdiLJ1ijHbOjhY6XWUorg4HUIAHZ4t-MoQofBDzSCIBw4iygsAAA4kBGiNNaW0IAkQOmIGYr9K53TiGUAAAS9D6Ug1QaqngAOR61RSmNMfUCwpA0JbCo4grA8GMI7AUUNLbIcIJhgATFYcg5TWTdHtmYwjD4ADcS4kAUB+CVbwdZXg1gFNAfIecON0DoMYEoomeD82ZV4YAWgfSEF6IqPOaECRuFlMJ-mGARU6f6LJgzAAvO4bQ87FFIBbGsrwNPeHk1ARTWgNAilPDJ0ocmFOiBE-0HMMAnN5yNKpsocW1MXvi1oFA8WvN6fIAZ+8xnYSLPM7ZqkFtYtJYAMQwGxEyFIUAMuufc6QaiEBnZ5xwGp4T3h+hLFIG0O4HmfjiCLrF9L74MJMlIK48gdwFCkA05Z6z+MtXdCk0UXM2Q2gUDiFiGsshYBUjzqV1gUAsCzYcFZhkmUd1YOW3VhkoXfOiDzmaNrhW3O3Z23trQpWcA4GIBlqL6h7g1gG8YPOEHntnH+05vryLBtaDB+p-hWEztqK8KU8pNBxCll0C0141MAH6cM3IPOgGqvlPgBltNajxs4ngNfBI4gMvA6G+D7wCBWCfK0AAdnBzpZHF3QFo-EBjrHOPSh4-6GzjnrWEdnCZ3DnnS4+ezGMMtrrPWeB5zoBltXvXJdKYV+meboCVcAJ1zwGseutBa+0jGJH7rlsE5y3UXclAycZct8Qc+xBTwBYRcFkod38hPk9hxiSEXZe3jzmgYbZx3vU6+z9jLlJ5A1jXISFVOgVpTCT26VPEB7PJq0KH0IjPgw1kpvIPONYjQSRO+md1SBDyUjQq+NDMk86EcMIRizp2G98HZ0eYAbfK9aE7yAbvOkv16jA8IOgSA6A1hwKaOg1ooVAA
