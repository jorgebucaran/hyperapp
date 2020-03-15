Welcome! If you're new to Hyperapp, you've found the perfect place to start learning.

Table of contents

- [The Set-up](#setup)
- [Hello World](#helloworld)
- [View](#view)
  - [Virtual Nodes](#virtualnodes)
  - [Rendering to the DOM](#rendertodom)
  - [Composing the view with reusable functions](#composingview)
- [State](#state)
- [Actions](#actions)
  - [Reacting to events in the DOM](#reacting)
  - [Capturing event-data in actions](#eventdata)
  - [Actions with custom payloads](#custompayloads)
  - [Payload filters](#payloadfilters)
- [Effects](#effects)
  - [Declaring effects in actions](#declaringeffects)
  - [Effect functions and `dispatch`](#effectfunctions)
  - [Running effects on initialization](#effectsoninit)
  - [Effect creators](#effectcreators)
  - [Tracking state for ansynchronous effects](#trackingasync)
- [Subscriptions](#subscriptions)
  - [Subscription functions](#subscriptionfunctions)
  - [Subscribing](#subscribing)
- [Conclusion](#conclusion)

## The Set-up <a name="setup"></a>

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
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
    <p class="signature">Surphy McBrah</p>
  </div>
  <div class="autoupdate">
    Auto update:
    <input type="checkbox" />
  </div>
</div>
```

...and some CSS [here](https://hyperapp.dev/tutorial-assets/style.css).

It looks like this:

![what it looks like](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut1.png)

We'll start by making Hyperapp render the HTML for us. Then we will
add dynamic behavior to all the widgets, including text input and
dynamically fetching stories.

First, let's begin with the traditional "Hello World!"

## Hello World <a name="helloworld"></a>

Create this html file:

```html
<!DOCTYPE html>
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://hyperapp.dev/tutorial-assets/style.css"
    />
    <script type="module">
      import { h, app } from "https://unpkg.com/hyperapp"

      // -- EFFECTS & SUBSCRIPTIONS --

      // -- ACTIONS --

      // -- VIEWS ---

      // -- RUN --
      app({
        node: document.getElementById("app"),
        view: () => h("h1", {}, ["Hello ", h("i", {}, "World!")]),
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

## View <a name="view"></a>

Let's step through what just happened.

### Virtual Nodes <a name="virtualnodes"></a>

Hyperapp exports the `app` and `h` functions.
`h` is for creating _virtual nodes_, which is to say: plain javascript objects
which _represent_ DOM nodes.

The result of

```js
h("h1", {}, ["Hello ", h("i", {}, "World!")])
```

is a virtual node, representing

```html
<h1>
  Hello
  <i>World!</i>
</h1>
```

### Rendering to the DOM <a name="rendertodom"></a>

`app` is the function that runs our app. It is called with a single argument - an object
which can take several properties. For now we're just concerned with `view` and `node.`

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

### Composing the view with reusable functions <a name="composingview"></a>

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
const storyThumbnail = props =>
  h(
    "li",
    {
      class: {
        unread: props.unread,
        reading: props.reading,
      },
    },
    [
      h("p", { class: "title" }, emphasize(props.filter, props.title)),
      h("p", { class: "author" }, props.author),
    ]
  )
```

> The last example demonstrates a helpful feature of the `class` property. When
> you set it to an object rather than a string, each key with a truthy value
> will become a class in the class list.

Continue by creating functions for each section of the view:

```js
const storyList = props =>
  h("div", { class: "stories" }, [
    h(
      "ul",
      {},
      Object.keys(props.stories).map(id =>
        storyThumbnail({
          id,
          title: props.stories[id].title,
          author: props.stories[id].author,
          unread: !props.stories[id].seen,
          reading: props.reading === id,
          filter: props.filter,
        })
      )
    ),
  ])

const filterView = props =>
  h("div", { class: "filter" }, [
    "Filter:",
    h("span", { class: "filter-word" }, props.filter),
    h("button", {}, "\u270E"),
  ])

const storyDetail = props =>
  h("div", { class: "story" }, [
    props && h("h1", {}, props.title),
    props &&
      h(
        "p",
        {},
        `
    Lorem ipsum dolor sit amet, consectetur adipiscing
    elit, sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam, qui
    nostrud exercitation ullamco laboris nisi ut aliquip
    ex ea commodo consequat.
  `
      ),
    props && h("p", { class: "signature" }, props.author),
  ])

const autoUpdateView = props =>
  h("div", { class: "autoupdate" }, [
    "Auto update: ",
    h("input", { type: "checkbox" }),
  ])

const container = content => h("div", { class: "container" }, content)
```

With those the view can be written as:

```js
view: () =>
  container([
    filterView({
      filter: "ocean",
    }),
    storyList({
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
        },
      },
      reading: "113",
      filter: "ocean",
    }),
    storyDetail({
      title: "Ocean life is brutal",
      author: "Surphy McBrah",
    }),
    autoUpdateView(),
  ])
```

What you see on the page should be exactly the same as before, because we haven't
changed what `view` returns. Using basic functional composition, we were able to make
the code a bit more manageable, and that's the only difference.

## State <a name="state"></a>

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
  view: state => container([
    filterView(state),
    storyList(state),
    storyDetail(state.reading && state.stories[state.reading]),
    autoUpdateView(state),
  ]),
```

Visually, everything is _still_ the same. If you'd like to see a working example of the code so far, have a look [here](https://codesandbox.io/s/hyperapp-tutorial-step-1-gq662)

## Actions <a name="actions"></a>

Now that we know all about rendering views, it's finally time for some _action_!

### Reacting to events in the DOM <a name="reacting"></a>

The first bit of dynamic behavior we will add is so that when you click
the pencil-button, a text input with the filter word appears.

Add an `onclick` property to the button in `filterView`:

```js
const filterView = props =>
  h("div", { class: "filter" }, [
    "Filter:",
    h("span", { class: "filter-word" }, props.filter),
    h("button", { onclick: StartEditingFilter }, "\u270E"), // <---
  ])
```

This makes Hyperapp bind a click-event handler on the button element, so
that when the button is clicked, an action named `StartEditingFilter` is
_dispatched_. Create the action in the "ACTIONS" section:

```js
const StartEditingFilter = state => ({ ...state, editingFilter: true })
```

Actions are just functions describing transformations of the state.
This action keeps everything in the state the same except for `editingFilter`
which it sets to `true`.

When Hyperapp dispatches an action, it replaces the old state with the new
one calculated using the action. Then the DOM is modified to match what the
view returns for this new state.

When `editingFilter` is true, we want to have a text input instead of a
span with the filter word. We can express this in `filterView` using a
ternary operator (`a ? b : c`).

```js
const filterView = props =>
  h("div", { class: "filter" }, [
    "Filter:",

    props.editingFilter // <---
      ? h("input", { type: "text", value: props.filter }) // <---
      : h("span", { class: "filter-word" }, props.filter),

    h("button", { onclick: StartEditingFilter }, "\u270E"),
  ])
```

Now, when you click the pencil button the text input appears. But we still need to add
a way to go back. We need an action to `StopEditingFilter`, and a button to dispatch it.

Add the action:

```js
const StopEditingFilter = state => ({ ...state, editingFilter: false })
```

and update `filterView` again:

```js
const filterView = props =>
  h("div", { class: "filter" }, [
    "Filter:",

    props.editingFilter
      ? h("input", { type: "text", value: props.filter })
      : h("span", { class: "filter-word" }, props.filter),

    props.editingFilter // <---
      ? h("button", { onclick: StopEditingFilter }, "\u2713")
      : h("button", { onclick: StartEditingFilter }, "\u270E"), // <---
  ])
```

When you click the pencil button, it is replaced with a check-mark button that can take you back to the first state.

![editing filter word](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut2.png)

### Capturing event-data in actions <a name="eventdata"></a>

The next step is to use the input for editing the filter word. Whatever we
type in the box should be emphasized in the story-list.

Update `filterView` yet again:

```js
const filterView = props =>
  h("div", { class: "filter" }, [
    "Filter:",

    props.editingFilter
      ? h("input", {
          type: "text",
          value: props.filter,
          oninput: SetFilter, // <----
        })
      : h("span", { class: "filter-word" }, props.filter),

    props.editingFilter
      ? h("button", { onclick: StopEditingFilter }, "\u2713")
      : h("button", { onclick: StartEditingFilter }, "\u270E"),
  ])
```

This will dispatch the `SetFilter` action everytime someone types in the input. Implement the action like this:

```js
const SetFilter = (state, event) => ({ ...state, filter: event.target.value })
```

The second argument to an action is known as the _payload_. Actions
dispatched in response to an events on DOM elements receive the [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event) for a payload. `event.target` refers to the input element in the DOM, and
`event.target.value` refers to the current value entered into it.

Now see what happens when you erase "ocean" and type "friendly" instead:

![typed friendly in filter](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut3.png)

### Actions with custom payloads <a name="custompayloads"></a>

Next up: selecting stories by clicking them in the list.

The following action sets the `reading` property in the state to a story-id, which amounts to "selecting" the story:

```js
const SelectStory = (state, id) => ({ ...state, reading: id })
```

It has a payload, but it's not an event object. It's a custom value telling us which
story was clicked. How are actions dispatched with custom payloads? – Like this:

```js
const storyThumbnail = props =>
  h(
    "li",
    {
      onclick: [SelectStory, props.id], // <----
      class: {
        unread: props.unread,
        reading: props.reading,
      },
    },
    [
      h("p", { class: "title" }, emphasize(props.filter, props.title)),
      h("p", { class: "author" }, props.author),
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
      ...state.stories[id], //keep this story the same, except for:
      seen: true,
    },
  },
})
```

Now, when you select a blue-edged story it turns yellow because it is selected, and when you select something else,
the edge turns gray to indicate you've read the story.

![read stories are gray](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut4.png)

### Payload filters <a name="payloadfilters"></a>

There's one little thing we should fix about `SetFilter`. See how it's dependent on the complex `event` object?
It would be easier to test and reuse if it were simply:

```js
const SetFilter = (state, word) => ({ ...state, filter: word })
```

But we don't know the word beforehand, so how can we set it as a custom payload? Change the `Filter` view
again (last time - I promise!):

```js
const filterView = props =>
  h("div", { class: "filter" }, [
    "Filter:",

    props.editingFilter
      ? h("input", {
          type: "text",
          value: props.filter,
          oninput: [SetFilter, event => event.target.value], // <----
        })
      : h("span", { class: "filter-word" }, props.filter),

    props.editingFilter
      ? h("button", { onclick: StopEditingFilter }, "\u2713")
      : h("button", { onclick: StartEditingFilter }, "\u270E"),
  ])
```

When we give a _function_ as the custom payload, Hyperapp considers it a _payload filter_ and passes the default
payload through it, providing the returned value as payload to the action.

> Payload filters are also useful when you need a payload that is a combination of custom data and event data

If you'd like to see a working example of the code so far, have a look [here](https://codesandbox.io/s/hyperapp-tutorial-step-2-5yv34)

## Effects <a name="effects"></a>

So far, the list of stories has been defined in the state and doesn't change. What we really want is
when we're done changing the filter-word, stories matching it should be loaded.

Before looking at how we make the request for new stories, one thing is for sure: when new stories
come back they need to go into the state, and the only way to modify the state is through an action.
So we're definitely going to need the following action:

```js
const GotStories = (state, stories) => ({
  ...state,

  // replace old stories with new,
  // but keep the 'seen' value if it exists
  stories: Object.keys(stories)
    .map(id => [
      id,
      {
        ...stories[id],
        seen: state.stories[id] && state.stories[id].seen,
      },
    ])
    .reduce((o, [id, story]) => ((o[id] = story), o), {}),

  // in case the current story is in the new list as well,
  // keep it selected, Otherwise select nothing
  reading: stories[state.reading] ? state.reading : null,
})
```

### Declaring effects in actions <a name="declaringeffects"></a>

Our request for new stories should go out once we're done editing the filter, which is to say: when we click
the check-mark button and `StopEditingFilter` is dispatched. When an action needs to do something
besides transforming the state, that "something" is called an _effect_. To associate an effect
with `StopEditingFilter`, make it return an array like this:

```js
const StopEditingFilter = state => [
  {
    ...state,
    editingFilter: false,
  },

  // effect declarations go here: //
]
```

When an action returns an array, Hyperapp understands that the first item is the new state we want, and
the rest are _effect declarations_. Hyperapp takes care of running all declared effects once the state
has been updated.

Add this effect declaration:

```js
const StopEditingFilter = state => [
  {
    ...state,
    editingFilter: false,
  },

  // effect declarations go here: //
  [
    fetchJSONData,
    {
      url: `https://hyperapp.dev/tutorial-assets/stories/${state.filter.toLowerCase()}.json`,
      onresponse: GotStories,
    },
  ],
]
```

The first item in an effect declaration – here `fetchJSONData` – is the
_effect function_ that we want Hyperapp to call. The second item contains
the options we want passed to effect function when it's called. Here, we are
telling `fetchJSONData` where the stories for the current filter are, and
to dispatch them as payload to `GotStories`, on response.

### Effect functions and `dispatch` <a name="effectfunctions"></a>

Now we just need to implement `fetchJSONData`. Type this in the "EFFECTS & SUBSCRIPTIONS" section:

```js
const fetchJSONData = (dispatch, options) =>
  fetch(options.url)
    .then(response => response.json())
    .then(data => dispatch(options.onresponse, data))
    .catch(() => dispatch(options.onresponse, {}))
```

> It's a good practice to write your effect functions generically like this, rather than
> hardcoding options. That way it can be used for multiple situations, even by others
> if you chose to publish it.
>
> ...speaking of which: make sure to check out the available effects published by members of the
> Hyperapp community, and perhaps save yourself some trouble implementing everything yourself.

When Hyperapp calls an effect function, it passes the `dispatch` function to it as the first
argument. `dispatch` is how effect functions are able to "report back" to the app, by dispatching
actions (first argument) with payloads (second argument)

Now, go ahead and try it out! Enter "life" in the filter input. When you click the check-mark button some new
stories are loaded – all with blue edges except for "Ocean life is brutal" because it is
still selected.

![fetched life stories](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut5.png)

### Running effects on initialization <a name="effectsoninit"></a>

The next obvious step is to load the _initial_ stories from the API as well. Change init to this:

```js
  init: [
    {
      editingFilter: false,
      autoUpdate: false,
      filter: "ocean",
      reading: null,
      stories: {},                                                       // <---
    },
    [                                                                    // <---
      fetchJSONData,                                                     // <---
      {                                                                  // <---
        url: `https://hyperapp.dev/tutorial-assets/stories/ocean.json`,  // <---
        onresponse: GotStories                                           // <---
      }                                                                  // <---
    ]                                                                    // <---
  ],
```

The point here is that init works just like the return value of an action, including
calling effects when it is given as an array. If you reload the page you'll see
(after a moment) that all the same stories appear, despite them not existing in
the state initially.

![fresh stories on init](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut6.png)

### Effect creators <a name="effectcreators"></a>

However, repeating the effect declaration in all its gory detail like this
is not ideal, so lets add this _effect creator_

```js
const storyLoader = searchWord => [
  fetchJSONData,
  {
    url: `https://hyperapp.dev/tutorial-assets/stories/${searchWord.toLowerCase()}.json`,
    onresponse: GotStories,
  },
]
```

Now we can simplify `StopEditingFilter` like this:

```js
const StopEditingFilter = state => [
  {
    ...state,
    editingFilter: false,
  },
  storyLoader(state.filter),
]
```

... and `init:` like this:

```js
  init: [
    {
      editingFilter: false,
      autoUpdate: false,
      filter: "ocean",
      reading: null,
      stories: {},
    },
    storyLoader("ocean")
  ],
```

### Tracking state for asynchronous effects <a name="trackingasync"></a>

If we could display a spinner while we wait for stories to load, it would make for a smoother user experience. We'll need a state property to tell us wether or not we're currently `fetching`, and we'll use this action to keep track of it:

```js
const SetFetching = (state, fetching) => ({ ...state, fetching })
```

Update `storyLoader` to tell `fetchJSONData` about `SetFetching`

```js
const storyLoader = searchWord => [
  fetchJSONData,
  {
    url: `https://hyperapp.dev/tutorial-assets/stories/${searchWord.toLowerCase()}.json`,
    onresponse: GotStories,
    onstart: [SetFetching, true], // <----
    onfinish: [SetFetching, false], // <----
  },
]
```

Finally update `fetchJSONData` to use the new `onstart` and `onfinish` options to notify when fetches start and end:

```js
const fetchJSONData = (dispatch, options) => {
  dispatch(options.onstart) // <---
  fetch(options.url)
    .then(response => response.json())
    .then(data => dispatch(options.onresponse, data))
    .catch(() => dispatch(options.onresponse, {}))
    .finally(() => dispatch(options.onfinish)) // <---
}
```

With that, our state prop `fetching` will always tell us wether or not we are fetching.
Use that to show a spinner when we are fetching, in `storyList`:

```js
const storyList = props =>
  h("div", { class: "stories" }, [
    // show spinner overlay if fetching
    props.fetching &&
      h("div", { class: "loadscreen" }, [h("div", { class: "spinner" })]),

    h(
      "ul",
      {},
      Object.keys(props.stories).map(id =>
        storyThumbnail({
          id,
          title: props.stories[id].title,
          author: props.stories[id].author,
          unread: !props.stories[id].seen,
          reading: props.reading === id,
          filter: props.filter,
        })
      )
    ),
  ])
```

When the app loads, and when you change the filter, you should see the spinner appear until the stories are loaded.

![spinner](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut7.png)

> If you aren't seeing the spinner, it might just be happening too fast. Try choking your network speed. In the Chrome
> browser you can set your network speed to "slow 3g" under the network tab in the developer tools.

If you'd like to see a working example of the code so far, have a look [here](https://codesandbox.io/s/hyperapp-tutorial-step-3-2mmug)

## Subscriptions <a name="subscriptions"></a>

The last feature we'll add is one where the user can opt in to have the app check every five seconds for new
stories matching the current filter. (There won't actually be any new stories, because it's not a real service,
but you'll know it's happening when you see the spinner pop up every five seconds.)

First let's keep track of wether or not the user wants this auto-update feature on. Create a new action:

```js
const ToggleAutoUpdate = state => ({ ...state, autoUpdate: !state.autoUpdate })
```

Dispatch it in response to checking the checkbox in `autoUpdateView`:

```js
const autoUpdateView = props =>
  h("div", { class: "autoupdate" }, [
    "Auto update: ",
    h("input", {
      type: "checkbox",
      checked: props.autoUpdate, // <---
      oninput: ToggleAutoUpdate, // <---
    }),
  ])
```

With that, the state property `autoUpdate` will tell us wether or not the Auto-update checkbox is checked.

### Subscription functions <a name="subscriptionfunctions"></a>

We need a _subscription function_ capable of dispatching actions at a given interval. Implement
`intervalSubscription` in the "EFFECTS & SUBSCRIPTIONS" section:

```js
const intervalSubscription = (dispatch, options) => {
  const interval = setInterval(() => dispatch(options.action), options.time)
  return () => clearInterval(interval)
}
```

Just like an effect function, this function will be called by Hyperapp with `dispatch` and given options. It
will start an interval listener, and every `options.time` milliseconds, it will dispatch the given action. The
main difference to an effect function is that a subscription function returns a function so hyperapp knows
how to stop the subscription.

> As with effects, you may find a suitable subscription already published
> in the Hyperapp community.

### Subscribing <a name="subscribing"></a>

We could create a new action for updating stories, but since `StopEditingFilter` already does what we want, we'll
use it here too. Add a `subscription` property to the app:

```js
subscriptions: state => [
  state.autoUpdate &&
    !state.editingFilter && [
      intervalSubscription,
      {
        time: 5000, //milliseconds,
        action: StopEditingFilter,
      },
    ],
]
```

Just like for `view`, hyperapp will run `subscriptions` with the new state every time it changes, to get
a list of subscription-declarations that should be active. In our case, whenever the Auto Update checkbox is
checked and we are _not_ busy editing the filter, our interval subscription will be active.

![auto update](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut8.png)

Hyperapp will only stop or start subscriptions when the declaration changes
from one state to the next. Subscriptions are _not_ stopped and started _every_ time the state changes.

If you'd like to see a working example of the final code, have a look [here](https://codesandbox.io/s/hyperapp-tutorial-step-4-8u9q8)

## Conclusion <a name="conclusion"></a>

Congratulations on completing this Hyperapp tutorial!

Along the way you've familiarized yourself with
the core concepts: _view_, _state_, _actions_, _effects_ & _subscriptions_. And that's really all you need to
build any web application.
