Tutorial
===================================

Welcome! If you're new to Hyperapp, you've found the perfect place to start learning.

The Set-up
-----------------------------------

Together we'll build a simple newsreader-like application. As we do, we'll work
our way through the five core concepts: view, state, actions, effects and subscriptions.

To move things along, let's imagine we've already made a static version of the
app we want to build, with this HTML:


```html
<div id="app" class="container">
  <div class="filter">
    Filter:
    <span class="filter-word">ocean</span>
    <button>&#9998;</button>
  </div>
  <div class="stories">
    <ul>
      <li class="unread">
        <p class="title">The <em>Ocean </em>is Sinking</p>
        <p class="author">Kat Stropher</p>
      </li>
      <li class="reading">
        <p class="title"><em>Ocean </em>life is brutal</p>
        <p class="author">Surphy McBrah</p>
      </li>
      <li>
        <p class="title">
          Family friendly fun at the
          <em>ocean </em>exhibit
        </p>
        <p class="author">Guy Prosales</p>
      </li>
    </ul>
  </div>
  <div class="story">
    <h1>Ocean life is brutal</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
      ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      aliquip ex ea commodo consequat.
    </p>
    <p class="signature">Surphy McBrah</p>
  </div>
  <div class="autoupdate">
    Auto update:
    <input type="checkbox" />
  </div>
</div>
```

...and some CSS [here](https://zaceno.github.com/hatut/style.css).

It looks like this:

![Initial static mockup](https://user-images.githubusercontent.com/6243887/73389558-15d97580-42dd-11ea-90fa-f79a2c351fe8.png)

We'll start by making Hyperapp render the HTML for us. Then we will
add dynamic behavior to all the widgets, including text input and
dynamically fetching stories.

First, let's begin with the traditional "Hello World!"

Hello World
------------------------------

Create this html file:

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="https://zaceno.github.com/hatut/style.css">
    <script type="module">

// -- IMPORTS --

import {h, app} from "https://unpkg.com/hyperapp?module"



// -- ACTIONS --



// -- VIEWS ---



// -- RUN --

app({
  node: document.getElementById("app"),
  view: () => h("h1", {}, [
      "Hello ",
      h("i", {}, "World!")
  ])
})
    </script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

> The section structure outlined in the comments is not important. It's
> just a suggestion for how to organize the code we'll be
> adding throughout the tutorial.

Open it in a browser, and you'll be greeted with an optimistic **Hello _World!_**.

View
------------------------------------

Let's step through what just happened.

### Virtual Nodes

Hyperapp exports the `app` and `h` functions.
`h` is for creating _virtual nodes_, which is to say: plain javascript objects
which _represent_ DOM nodes.

The result of

```js
h("h1", {}, [
  "Hello ",
  h("i", {}, "World!")
])
```

is a virtual node, representing

```html
<h1>
  Hello
  <i>World!</i>
</h1>
```

### Rendering to the DOM

`app` is the function that runs our app. It is called with a single argument - an object
which can take several properties. For now we're just concerned with `view` and `node. `

Hyperapp calls the `view` function which tells it the DOM structure we want, in the form
of virtual nodes. Hyperapp proceeds to create it for us, replacing the node specified in `node`.

To render the HTML we want, change the `view` to:

```js
view: () => h("div", {id: "app", class: "container"}, [
  h("div", {class: "filter"}, [
    " Filter: ",
    h("span", {class: "filter-word"}, "ocean"),
    h("button", {}, "\u270E")
  ]),
  h("div", {class: "stories"}, [
    h("ul", {}, [
      h("li", {class: "unread"}, [
        h("p", {class: "title"}, [
          "The ",
          h("em", {}, "Ocean"),
          " is Sinking!"
        ]),
        h("p", {class: "author"}, "Kat Stropher")
      ]),
      h("li", {class: "reading"}, [
        h("p", {class: "title"}, [
          h("em", {}, "Ocean"),
          " life is brutal"
        ]),
        h("p", {class: "author"}, "Surphy McBrah"),
      ]),
      h("li", {}, [
        h("p", {class: "title"}, [
          "Family friendly fun at the ",
          h("em", {}, "ocean"),
          " exhibit"
        ]),
        h("p", {class: "author"}, "Guy Prosales")
      ])
    ])
  ]),
  h("div", {class: "story"}, [
    h("h1", {}, "Ocean life is brutal"),
    h("p", {}, `
      Lorem ipsum dolor sit amet, consectetur adipiscing
      elit, sed do eiusmod tempor incididunt ut labore et
      dolore magna aliqua. Ut enim ad minim veniam, quis
      nostrud exercitation ullamco laboris nisi ut aliquip
      ex ea commodo consequat.
    `),
    h("p", {class: "signature"}, "Surphy McBrah")
  ]),
  h("div", {class: "autoupdate"}, [
    "Auto update: ",
    h("input", {type: "checkbox"})
  ])
]),
```

Try it out to confirm that the result matches the screenshot above.

> In many frameworks it is common to write your views/templates
> using syntax that looks like HTML. This is possible with Hyperapp as well.
> [JSX](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)
> can compile a HTML-like syntax into `h` calls at build-time. If you'd rather
> not use a build system, [htm](https://github.com/developit/htm) does the same at run-time.
>
> In this tutorial we'll stick with `h` to keep it simple and close to the metal.

### Composing the view with reusable functions

The great thing about using plain functions to build up our virtual DOM
is that we can break out repetitive or complicated parts into their own functions.

Add this function (in the "VIEWS" section):

```js
const emphasize = (word, string) =>
  string.split(" ").map(x => {
    if (x.toLowerCase() === word.toLowerCase()) {
      return h("em", {}, x + " ")
    } else {
      return x + " "
    }
  })
```

It lets you change this:

```js
  ...
  h("p", {class: "title"}, [
    "The ",
    h("em", {}, "Ocean"),
    " is Sinking!"
  ]),
  ...
```

into this:

```js
  ...
  h("p", {class: "title"}, emphasize("ocean",
    "The Ocean is Sinking"
  ))
  ...
```

Story thumbnails are repeated several times, so encapsulate
them in their own function:

```js
const StoryThumbnail = props => h(
  "li",
  {class: {
      unread: props.unread,
      reading: props.reading,
  }},
  [
    h("p", {class: "title"}, emphasize(props.filter, props.title)),
    h("p", {class: "author"}, props.author)
  ]
)
```

> The last example demonstrates a helpful feature of the `class` property. When
> you set it to an object rather than a string, each key with a truthy value
> will become a class in the class list.

Continue by creating functions for each section of the view:

```js

const StoryList = props => h("div", {class: "stories"}, [
  h("ul", {}, Object.keys(props.stories).map(id =>
    StoryThumbnail({
      id,
      title: props.stories[id].title,
      author: props.stories[id].author,
      unread: !props.stories[id].seen,
      reading: props.reading === id,
      filter: props.filter,
    })
  ))
])

const Filter = props => h("div", {class: "filter"}, [
  "Filter:",
  h("span", {class: "filter-word"}, props.filter),
  h("button", {}, "\u270E")
])

const StoryDetail = props => h("div", {class: "story"}, [
  props && h("h1", {}, props.title),
  props && h("p", {}, `
    Lorem ipsum dolor sit amet, consectetur adipiscing
    elit, sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam, qui
    nostrud exercitation ullamco laboris nisi ut aliquip
    ex ea commodo consequat.
  `),
   props && h("p", {class: "signature"}, props.author)
])

const AutoUpdate = props => h("div", {class: "autoupdate"}, [
  "Auto update: ",
  h("input", {type: "checkbox"})
])

const Container = content => h("div", {class: "container"}, content)

```


With those the view can be written as:

```js
view: () => Container([
  Filter({
    filter: "ocean"
  }),
  StoryList({
    stories: {
      "112": {
        title: "The Ocean is Sinking",
        author: "Kat Stropher",
        seen: false,
      },
      "113": {
        title: "Ocean life is brutal",
        author: "Surphy McBrah",
        seen: true,
      },
      "114": {
        title: "Family friendly fun at the ocean exhibit",
        author: "Guy Prosales",
        seen: true,
      }
    },
    reading: "113",
    filter: "ocean"
  }),
  StoryDetail({
    title: "Ocean life is brutal",
    author: "Surphy McBrah",
  }),
  AutoUpdate(),
])
```

What you see on the page should be exactly the same as before, because we haven't
changed what `view` returns. Using basic functional composition, we were able to make
the code a bit more manageable, and that's the only difference.

State
-------------------------------

With all that view logic broken out in separate functions, `view` is starting to look like
plain _data_. The next step is to fully separate data from the view.

Add an `init` property to your app, with this pure data:

```js
  init: {
    filter: "ocean",
    reading: "113",
    stories: {
      "112": {
        title: "The Ocean is Sinking",
        author: "Kat Stropher",
        seen: false,
      },
      "113": {
        title: "Ocean life is brutal",
        author: "Surphy McBrah",
        seen: true,
      },
      "114": {
        title: "Family friendly fun at the ocean exhibit",
        author: "Guy Prosales",
        seen: true,
      }
    }
  },
```

The value of `init` becomes the app's _state_. Hyperapp calls `view` with the state
as an argument, so it can be reduced to:

```js
  view: state => Container([
    Filter(state),
    StoryList(state),
    StoryDetail(state.reading && state.stories[state.reading]),
    AutoUpdate(state),
  ]),
```

Visually, everything is _still_ the same. If you'd like to see a working example of the code so far, have a look [here](https://codesandbox.io/s/hyperapp-tutorial-step-1-gq662).

Actions
---------------------

Now that we know all about rendering views, it's finally time for some _action_!

### Reacting to events in the DOM

The first bit of dynamic behavior we will add is so that when you click
the pencil-button, a text input with the filter word appears.

Add an `onClick` property to the button in the filter view:

```js
const Filter = props => h("div", {class: "filter"}, [
  "Filter:",
  h("span", {class: "filter-word"}, props.filter),
  h("button", { onClick: StartEditingFilter }, "\u270E") // <---
])
```

This makes Hyperapp bind a click-event handler on the button element, so
that when the button is clicked, an action named `StartEditingFilter` is
_dispatched_. Create the action in the "ACTIONS" section:

```js
const StartEditingFilter = state => ({...state, editingFilter: true})
```

Actions are just functions describing transformations of the state.
This action keeps everything in the state the same except for `editingFilter`
which it sets to `true`.

When Hyperapp dispatches an action, it replaces the old state with the new
one calculated using the action. Then the DOM is modified to match what the
view returns for this new state.

When `editingFilter` is true, we want to have a text input instead of a
span with the filter word. We can express this in the `Filter` view using a
ternary operator (`a ? b : c`).

```js
const Filter = props => h("div", {class: "filter"}, [
  "Filter:",

  props.editingFilter                               // <---
  ? h("input", {type: "text", value: props.filter}) // <---
  : h("span", {class: "filter-word"}, props.filter),

  h("button", { onClick: StartEditingFilter }, "\u270E")
])
```

Now, when you click the pencil button the text input appears.  But we still need to add
a way to go back. We need an action to `StopEditingFilter`, and a button to dispatch it.

Add the action:

```js
const StopEditingFilter = state => ({...state, editingFilter: false})
```

and update the `Filter` view again:

```js
const Filter = props => h("div", {class: "filter"}, [
  "Filter:",

  props.editingFilter
  ? h("input", {type: "text", value: props.filter})
  : h("span", {class: "filter-word"}, props.filter),

  props.editingFilter                                      // <---
  ? h("button", {onClick: StopEditingFilter}, "\u2713")
  : h("button", {onClick: StartEditingFilter}, "\u270E"),  // <---
])
```

When you click the pencil button, it is replaced with a check-mark button that can take you back to the first state.

![Filter in edit mode](https://user-images.githubusercontent.com/6243887/73389562-1a059300-42dd-11ea-80ea-631c999d5f62.png)


### Capturing event-data in actions

The next step is to use the input for editing the filter word. Whatever we
type in the box should be emphasized in the story-list.

Update the `Filter` view yet again:

```js
const Filter = props => h("div", {class: "filter"}, [
  "Filter:",

  props.editingFilter
  ? h("input", {
    type: "text",
    value: props.filter,
    onInput: SetFilter,   // <----
  })
  : h("span", {class: "filter-word"}, props.filter),

  props.editingFilter
  ? h("button", {onClick: StopEditingFilter}, "\u2713")
  : h("button", {onClick: StartEditingFilter}, "\u270E"),
])
```

This will dispatch the `SetFilter` action everytime someone types in the input. Implement the action like this:

```js
const SetFilter = (state, event) => ({...state, filter: event.target.value})
```

The second argument to an action is known as the _payload_. Actions
dispatched in response to an events on DOM elements receive the [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event) for a payload. `event.target` refers to the input element in the DOM, and
`event.target.value` refers to the current value entered into it.

Now see what happens when you erase "ocean" and type "friendly" instead:

![filtering other words](https://user-images.githubusercontent.com/6243887/73389567-1d991a00-42dd-11ea-9bf1-b1fc6b85b635.png)


### Actions with custom payloads

Next up: selecting stories by clicking them in the list.

The following action sets the `reading` property in the state to a story-id, which amounts to "selecting" the story:

```js
const SelectStory = (state, id) => ({...state, reading: id})
```

It has a payload, but it's not an event object. It's a custom value telling us which
story was clicked. How are actions dispatched with custom payloads? – Like this:

```js

const StoryThumbnail = props => h(
  "li",
  {
    onClick: [SelectStory, props.id], // <----
    class: {
      unread: props.unread,
      reading: props.reading,
    }
  },
  [
    h("p", {class: "title"}, emphasize(props.filter, props.title)),
    h("p", {class: "author"}, props.author)
  ]
)
```

Instead of just specifying the action, we give a length-2 array with the action first and the custom payload second.

Selecting stories works now, but the feature is not quite done. When a story is selected,
we need to set its `seen` property to `true`, so we can highlight which stories the user has yet to read. Update the `SelectStory` action:

```js
const SelectStory = (state, id) => ({
  ...state, // keep all state the same, except for the following:
  reading: id,
  stories: {
    ...state.stories, //keep stories the same, except for:
    [id]: {
      ...state.stories[id],  //keep this story the same, except for:
      seen: true,
    }
  }
})
```

Now, when you select a blue-edged story it turns yellow because it is selected, and when you select something else,
the edge turns gray to indicate you've read the story.

![all stories read](https://user-images.githubusercontent.com/6243887/73389573-20940a80-42dd-11ea-9b26-ebdad474b169.png)


### Payload filters

There's one little thing we should fix about `SetFilter`. See how it's dependent on the complex `event` object?
It would be easier to test and reuse if it were simply:

```js
const SetFilter = (state, word) => ({...state, filter: word})
```

But we don't know the word beforehand, so how can we set it as a custom payload? Change the `Filter` view
again (last time - I promise!):

```js
const Filter = props => h("div", {class: "filter"}, [
  "Filter:",

  props.editingFilter
  ? h("input", {
    type: "text",
    value: props.filter,
    onInput: [SetFilter, event => event.target.value],   // <----
  })
  : h("span", {class: "filter-word"}, props.filter),

  props.editingFilter
  ? h("button", {onClick: StopEditingFilter}, "\u2713")
  : h("button", {onClick: StartEditingFilter}, "\u270E"),
])
```

When we give a _function_ as the custom payload, Hyperapp considers it a _payload filter_ and passes the default
payload through it, providing the returned value as payload to the action.

> Payload filters are also useful when you need a payload that is a combination of custom data and event data

If you'd like to see a working example of the code so far, have a look [here](https://codesandbox.io/s/hyperapp-tutorial-step-2-5yv34).

Effects
----------------------------

Until now, the list of stories has been defined in the state and doesn't change. What we really want is
for stories matching the filter to be dynamically loaded. When we click the check-mark button
(indicating we are done editing the filter), we want to query an API and display the stories it responds with.

### Actions can return effects

Add this import (to the "IMPORTS" section):

```js
import {Http} from "https://unpkg.com/hyperapp-fx@next?module"
```

Use the imported `Http` in the `StopEditingFilter` action like this:

```js
const StopEditingFilter = state => [
  {
    ...state,
    editingFilter: false,
  },
  Http({                                                                            // <---
    url: `https://zaceno.github.io/hatut/data/${state.filter.toLowerCase()}.json`,  // <---
    response: "json",                                                               // <---
    action: GotStories,                                                             // <---
  })
]
```

The call to `Http(...)` does _not_ immediately execute the API request. `Http` is an _effect creator_. It returns
an _effect_ bound to the options we provided.

When Hyperapp sees an action return an array, it takes the first element of the array to be the new state, and the rest to
be _effects_. Effects are executed by Hyperapp as part of processing the action's return value.

> Hyperapp provides effect creators for many common situations. If you've got an unusual case or are working
> with less common APIs you may need to implement your own effects. Don't worry - it's easy! See the
> [API reference](./ref.md) for more information.

### Effects can dispatch actions

One of the options we passed to `Http` was `action: GotStories`. The way this effect works is that when the response comes
back from the api, an action named `GotStories` (yet to be implemented) will be dispatched, with the response body as the payload.

The response body is in json, but the payload will be a javascript object, thanks to the parsing hint `response: "json"`.  It will look like this (although the details depend on your filter of course):

```js
{
  "112": {
    title: "The Ocean is Sinking",
    author: "Kat Stropher",
  },
  "113": {
    title: "Ocean life is brutal",
    author: "Surphy McBrah",
  },
  "114": {
    title: "Family friendly fun at the ocean exhibit",
    author: "Guy Prosales",
  }
}
```

The job of `GotStories` is to load this data into the state, in place of the stories we already have there. As it
does, it should take care to remember which story was selected, and which stories we have seen, if they were already
in the previous state. This will be our most complex action yet, and it could look like this:

```js
const GotStories = (state, response) => {
  const stories = {}
  Object.keys(response).forEach(id => {
    stories[id] = {...response[id], seen: false}
    if (state.stories[id] && state.stories[id].seen) {
      stories[id].seen = true
    }
  })
  const reading = stories[state.reading] ? state.reading :  null
  return {
    ...state,
    stories,
    reading,
  }
}
```

Try it out! Enter "life" in the filter input. When you click the check-mark button some new
stories are loaded – all with blue edges except for "Ocean life is brutal" because it is
still selected.

![loaded other stories](https://user-images.githubusercontent.com/6243887/73389577-24279180-42dd-11ea-8b4a-b231f1c811c8.png)




### Running effects on initialization

The next obvious step is to load the _initial_ stories from the API as well. Change init to this:


```js
  init: [
    {
      editingFilter: false,
      autoUpdate: false,
      filter: "ocean",
      reading: null,
      stories: {},                                            // <---
    },
    Http({                                                    // <---
      url: `https://zaceno.github.io/hatut/data/ocean.json`,  // <---
      response: 'json',                                       // <---
      action: GotStories,                                     // <---
    })
  ],
```

Hyperapp treats the init-value the same way as it treats return values from actions. By adding the `Http` effect
in `init`, the app will fire the API request immediately, so we don't need the stories in the state from the start.

![stories loaded from start](https://user-images.githubusercontent.com/6243887/73389586-2a1d7280-42dd-11ea-8642-f994c028a74f.png)


### Tracking state for asynchronous effects

If we could display a spinner while we wait for stories to load, it would make for a smoother user experience. To
do that, we will need a new state property to tell us if we're waiting for a repsonse - and
consequently wether or not to render the spinner.

Create this action:

```js
const FetchStories = state => [
  {...state, fetching: true},
  Http({
    url: `https://zaceno.github.io/hatut/data/${state.filter.toLowerCase()}.json`,
    response: 'json',
    action: GotStories,
  })
]
```

Instead of dispatching this action, we will use it to simplify `StopEditingFilter`:

```js
const StopEditingFilter = state => FetchStories({...state, editingFilter: false})
```

... and `init` as well:

```js
  init: FetchStories({
    editingFilter: false,
    autoUpdate: false,
    filter: "ocean",
    reading: null,
    stories: {},
  }),
```

Now, when `StopEditingFilter` is dispatched, _and_ at initialization, the API call goes out and the
`fetching` prop is set to `true`. Also, notice how we refactored out the repetitive use of `Http`.

We also need to set `fetching: false`  in `GotStories`:

```js
const GotStories = (state, response) => {
  const stories = {}
  Object.keys(response).forEach(id => {
    stories[id] = {...response[id], seen: false}
    if (state.stories[id] && state.stories[id].seen) {
      stories[id].seen = true
    }
  })
  const reading = stories[state.reading] ? state.reading :  null
  return {
    ...state,
    stories,
    reading,
    fetching: false,          // <---
  }
}
```

With this, we know that when `fetching` is `true` we are waiting for a response, and should display
the spinner in the `StoryList` view:

```js
const StoryList = props => h("div", {class: "stories"}, [

  props.fetching && h("div", {class: "loadscreen"}, [  // <---
    h("div", {class: "spinner"})                       // <---
  ]),                                                  // <---

  h("ul", {}, Object.keys(props.stories).map(id =>
    StoryThumbnail({
      id,
      title: props.stories[id].title,
      author: props.stories[id].author,
      unread: !props.stories[id].seen,
      reading: props.reading === id,
      filter: props.filter
    })
  ))
])
```

When the app loads, and when you change the filter, you should see the spinner appear until the stories are loaded.

![loading spinner](https://user-images.githubusercontent.com/6243887/73389594-2db0f980-42dd-11ea-8bf8-95b96e7337b1.png)

> If you aren't seeing the spinner, it might just be happening too fast. Try choking your network speed. In the Chrome
> browser you can set your network speed to "slow 3g" under the network tab in the developer tools.

If you'd like to see a working example of the code so far, have a look [here](https://codesandbox.io/s/hyperapp-tutorial-step-3-2mmug).

Subscriptions
-------------------------------------------------------------------

The last feature we'll add is to make our app periodically check for new stories matching the filter. There won't actually
be any because it's not a real service, but you'll know it's happening when you see the spinner pop up every five
seconds.

However, we want to make it opt-in. That's what the auto update checkbox at the bottom is for. We need a
property in the state to track wether the box is checked or not.

Change the `AutoUpdate` view:

```js
const AutoUpdate = props => h("div", {class: "autoupdate"}, [
  "Auto update: ",
  h("input", {
    type: "checkbox",
    checked: props.autoUpdate, // <---
    onInput: ToggleAutoUpdate, // <---
  })
])
```

and implement the `ToggleAutoUpdate` action:

```js
const ToggleAutoUpdate = state => ({...state, autoUpdate: !state.autoUpdate})
```

Now we've got `autoUpdate` in the state tracking the checkbox. All we need now, is to set up `FetchStories`
to be dispatched every five seconds when `autoUpdate` is `true`.

Import the `interval` _subscription creator_:

```js
import {interval} from "https://unpkg.com/@hyperapp/time?module"
```

Add a `subscriptions` property to your app, with a conditional declaration of `interval` like this:

```js
  subscriptions: state => [
    state.autoUpdate && interval(FetchStories, {delay: 5000})
  ]
```

Hyperapp will call `subscriptions` every time the state changes. If it notices a
new subscription, it will be started, or if one has been removed it will be stopped.

The options we passed to the `interval` subscription state that `FetchStories` should be dispatched every five seconds. It
will start when we check the auto update box, and stop when it is unchecked.

![auto updating](https://user-images.githubusercontent.com/6243887/73389603-3275ad80-42dd-11ea-9270-bc8be471db8b.png)

> As with effects, Hyperapp offers subscriptions for the most common cases, but you
> may need to implement your own. Refer to the [API reference](./ref.md). Again,
> it is no big deal - just not in scope for this tutorial.

If you'd like to see a working example of the final code, have a look [here](https://codesandbox.io/s/hyperapp-tutorial-step-4-8u9q8).

Conclusion
------------------

Congratulations on completing this Hyperapp tutorial!

Along the way you've familiarized yourself with
the core concepts: _view_, _state_, _actions_, _effects_ & _subscriptions_. And that's really all you need to
build any web application.

So now, go build your dream app, or browse our [Examples](./examples.md) for more
inspiration.
