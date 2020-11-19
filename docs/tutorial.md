# Tutorial

Welcome! If you're new to Hyperapp, you've found the perfect place to start learning. This tutorial will guide you through your first steps with Hyperapp as we build a simple app.

-   [The Set-up](#setup)
-   [Hello World](#helloworld)
-   [View](#view)
    -   [Virtual Nodes](#virtualnodes)
    -   [Rendering to the DOM](#rendertodom)
    -   [Composing the view with reusable functions](#composingview)
-   [State](#state)
-   [Actions](#actions)
    -   [Reacting to events in the DOM](#reacting)
    -   [Capturing event-data in actions](#eventdata)
    -   [Actions with custom payloads](#custompayloads)
-   [Effects](#effects)
    -   [Running effects with actions](#effectswithactions)
    -   [Running effects on init](#effectsoninit)
-   [Subscriptions](#subscriptions)
-   [Conclusion](#conclusion)

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
            import { app, h, text } from "https://unpkg.com/hyperapp"
            // -- ACTIONS --

            // -- VIEWS ---

            // -- RUN --
            app({
                init: {},
                node: document.getElementById("app"),
                view: () =>
                    h("h1", {}, [text("Hello "), h("i", {}, text("World!"))]),
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

Hyperapp exports the `app` `h`, and `text` functions.
`h` and `text` are for creating _virtual nodes_, which is to say:
plain javascript objects which _represent_ DOM nodes.

The result of

```js
h("h1", {}, [text("Hello "), h("i", {}, text("World!"))])
```

is a virtual node, representing

```html
<h1>
    Hello
    <i>World!</i>
</h1>
```

`h` is for describing
element-nodes such as `<h1>` or `<i>` – anything you would use a tag to
describe in regular html.

Such nodes can have content, which is given as virtual nodes in the third
argument of `h`.

`text` is specifically for describing text nodes.

### Rendering to the DOM <a name="rendertodom"></a>

`app` is the function that runs our app. It is called with a single argument - an object
which can take several properties. For now we're just concerned with `view` and `node.`

Hyperapp calls the `view` function which tells it the DOM structure we want, in the form
of virtual nodes. Hyperapp proceeds to create it for us, replacing the node specified in `node`.

To render the HTML we want, change the `view` to:

```js
view: () => h("div", { id: "app", class: "container" }, [
  h("div", { class: "filter" }, [
    text(" Filter: "),
    h("span", { class: "filter-word" }, text("ocean")),
    h("button", {}, text("\u270E")),
  ]),
  h("div", { class: "stories" }, [
    h("ul", {}, [
      h("li", { class: "unread" }, [
        h("p", { class: "title" }, [
          text("The "),
          h("em", {}, text("Ocean")),
          text(" is Sinking!"),
        ]),
        h("p", { class: "author" }, text("Kat Stropher")),
      ]),
      h("li", { class: "reading" }, [
        h("p", { class: "title" }, [
          h("em", {}, text("Ocean")),
          text(" life is brutal"),
        ]),
        h("p", { class: "author" }, text("Surphy McBrah")),
      ]),
      h("li", {}, [
        h("p", { class: "title" }, [
          text("Family friendly fun at the "),
          h("em", {}, text("ocean")),
          text(" exhibit"),
        ]),
        h("p", { class: "author" }, text("Guy Prosales")),
      ]),
    ]),
  ]),
  h("div", { class: "story" }, [
    h("h1", {}, text("Ocean life is brutal")),
    h("p", {}, text(`
      Lorem ipsum dolor sit amet, consectetur adipiscing
      elit, sed do eiusmod tempor incididunt ut labore et
      dolore magna aliqua. Ut enim ad minim veniam, quis
      nostrud exercitation ullamco laboris nisi ut aliquip
      ex ea commodo consequat.
    `)),
    h("p", { class: "signature" }, text("Surphy McBrah")),
  ]),
  h("div", { class: "autoupdate" }, [
    text("Auto update: "),
    h("input", { type: "checkbox" }),
  ]),
]),
```

Try it out to confirm that the result matches the screenshot above.

> In many frameworks it is common to write your views/templates
> using syntax that looks like HTML. This is possible with Hyperapp as well.
> [Hyperlit](https://github.com/zaceno/hyperlit) allows writing html-like views
> that work in the browser without any compilation/build-step. Using JSX for
> Hyperapp is also possible, with a bit of configuration In this tutorial
> we'll stick with `h` & `text` to keep it simple and close to the metal.

### Composing the view with reusable functions <a name="composingview"></a>

The great thing about using plain functions to build up our virtual DOM
is that we can break out repetitive or complicated parts into their own functions.

Add this function (in the "VIEWS" section):

```js
const emphasize = (word, string) =>
  string
    .split(" ")
    .map((x) =>
      x.toLowerCase() === word.toLowerCase()
      ? h("em", {}, text(x + " "))
      : text(x + " "),
    )
```

It lets you change this:

```js
  ...
  h("p", {class: "title"}, [
    text("The "),
    h("em", {}, text("Ocean")),
    text(" is Sinking!")
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
const storyThumbnail = props => h("li", {
  class: {
      unread: props.unread,
      reading: props.reading,
  },
}, [
  h("p", { class: "title" }, emphasize(props.filter, props.title)),
  h("p", { class: "author" }, text(props.author)),
]),
```

> The last example demonstrates a helpful feature of the `class` property. When
> you set it to an object rather than a string, each key with a truthy value
> will become a class in the class list.

Continue by creating functions for each section of the view:

```js
const storyList = props => h("div", { class: "stories" }, [
  h("ul", {}, Object.keys(props.stories).map(id => storyThumbnail({
    id,
    title: props.stories[id].title,
    author: props.stories[id].author,
    unread: !props.stories[id].seen,
    reading: props.reading === id,
    filter: props.filter,
  }))),
])

const filterView = props => h("div", { class: "filter" }, [
  text("Filter:"),
  h("span", { class: "filter-word" }, text(props.filter)),
  h("button", {}, text("\u270E")),
])

const storyDetail = props => h("div", { class: "story" }, [
  props && h("h1", {}, text(props.title)),
  props && h( "p", {}, text(`
    Lorem ipsum dolor sit amet, consectetur adipiscing
    elit, sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam, qui
    nostrud exercitation ullamco laboris nisi ut aliquip
    ex ea commodo consequat.
  `)),
  props && h("p", { class: "signature" }, text(props.author)),
])

const autoUpdateView = props => h("div", { class: "autoupdate" }, [
  text("Auto update: "),
  h("input", { type: "checkbox" }),
])

const container = (content) => h("div", { class: "container" }, text(content))
```

With those the view can be written as:

```js
view: () => container([
  filterView({
      filter: "ocean",
  }),
  storyList({
    stories: {
      112: {
        title: "The Ocean is Sinking",
        author: "Kat Stropher",
        seen: false,
      },
      113: {
        title: "Ocean life is brutal",
        author: "Surphy McBrah",
        seen: true,
      },
      114: {
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
plain _data_. The next step is to fully separate data from the view. It's time to use
the `init` property. Set it to this plain data object:

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

Visually, everything is _still_ the same. If you'd like to see a working example of the code so far, have a look [here][Live Example 1]

## Actions <a name="actions"></a>

Now that we know all about rendering views, it's finally time for some _action_!

### Reacting to events in the DOM <a name="reacting"></a>

The first bit of dynamic behavior we will add is so that when you click
the pencil-button, a text input with the filter word appears.

Add an `onclick` property to the button in `filterView`:

```js
const filterView = props => h("div", { class: "filter" }, [
  text("Filter:"),
  h("span", { class: "filter-word" }, text(props.filter)),
  h("button", {onclick: StartEditingFilter}, text("\u270E")), // <---
])
```

This makes Hyperapp bind a click-event handler on the button element, so
that when the button is clicked, an action named `StartEditingFilter` is
_dispatched_. Create the action in the "ACTIONS" section:

```js
const StartEditingFilter = (state) => ({ ...state, editingFilter: true })
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
const filterView = props => h("div", { class: "filter" }, [
  text("Filter:"),

  props.editingFilter                                    // <---
  ? h("input",  {type: "text", value: props.filter})     // <---
  : h("span", { class: "filter-word" }, text(props.filter)),

  h("button", {onclick: StartEditingFilter}, text("\u270E")),
])
```

Now, when you click the pencil button the text input appears. But we still need to add
a way to go back. We need an action to `StopEditingFilter`, and a button to dispatch it.

Add the action:

```js
const StopEditingFilter = (state) => ({ ...state, editingFilter: false })
```

and update `filterView` again:

```js
const filterView = props => h("div", { class: "filter" }, [
  text("Filter:"),
  
  props.editingFilter                                   
  ? h("input",  {type: "text", value: props.filter})    
  : h("span", { class: "filter-word" }, text(props.filter)),
  
  props.editingFilter                                           // <---
  ? h("button", { onclick: StopEditingFilter }, text("\u2713")) // <---
  : h("button", {onclick: StartEditingFilter}, text("\u270E")),
])
```

When you click the pencil button, it is replaced with a check-mark button that can take you back to the first state.

![editing filter word](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut2.png)

### Capturing event-data in actions <a name="eventdata"></a>

The next step is to use the input for editing the filter word. Whatever we
type in the box should be emphasized in the story-list.

Update `filterView` yet again:

```js
const filterView = props => h("div", { class: "filter" }, [
  text("Filter:"),
  
  props.editingFilter                                   
  ? h("input",  {
    type: "text",
    value: props.filter,
    oninput: SetFilter,  // <---
  })    
  : h("span", { class: "filter-word" }, text(props.filter)),
  
  props.editingFilter                                           
  ? h("button", { onclick: StopEditingFilter }, text("\u2713"))
  : h("button", {onclick: StartEditingFilter}, text("\u270E")),
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
story was clicked. How are actions dispatched with custom payloads? – Like this:

```js
const storyThumbnail = props => h("li", {
  onclick: [SelectStory, props.id], // <---
  class: {
      unread: props.unread,
      reading: props.reading,
  },
}, [
  h("p", { class: "title" }, emphasize(props.filter, props.title)),
  h("p", { class: "author" }, text(props.author)),
])
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

If you'd like to see a working example of the code so far, have a look [here][Live Example 2]

## Effects <a name="effects"></a>

So far, the list of stories is defined statically when the app starts up and doesn't change. What we really want is when the filter-word is changed, stories matching it should be loaded from a server.

Hyperapp takes a page from the book of functional programming in that it requires you to separate the imperative, procedural code from the pure mathematical calculations that define your actions. Such bundles of imperative code are called _effects_ (often also "side-effects")

Wrapping procedural code in effects is easy if you should need to. You rarely do though, as many commonly needed effects are already available via npm/unpkg – notably `@hyperapp/http` which we will use for fetching the stories. Import it at the top of your script:

```js
import { app, h, text } from "https://unpkg.com/hyperapp"
import {request} from "https://unpkg.com/@hyperapp/http" // <---
```

### Running effects with actions <a name="effectswithactions"></a>

When the user is done changing the filter word, we want to fetch all the stories that match. So let's update the `StopEditingFilter` action with that effect:

```js
const StopEditingFilter = (state) => [  // <---
  {
    ...state,
    editingFilter: false,
    fetching: true,                     // <----
  },
  request({                            // <----
    url: `https://zaceno.github.io/hatut/data/${state.filter.toLowerCase()}.json`,
    expect: "json",
    action: GotStories,
  }),
]
```

A few things going on here so let's break it down.

-   `StopEditingFilter` no longer returns _just_ the state, but an _array_ where the first item is the new state and the following are effects. Hyperapp understands this format of return values and will update the state same as for "normal" actions

-   The call to `request(...)` is _*not* executing the request_. It just returns an object (actually an array of `[function, options]`) which _represents_ the effect. After the state has been updated, Hyperapp will execute the effect.

-   `request({...})` is given a few options, notably the `url` where the data we want is. `action` says we want `GotStories` dispatched with the response payload. `expect: "json"` the data should be parsed as JSON, and the payload should be a plain javascript object. We haven't implemented `GotStories` yet, but we will shortly.

-   We introduced a new property in the state: `fetching: true`. This is how we will keep track that we are waiting for new data.

When we get new data, we want to replace the `stories` property of the state with the new stories we get in the payload. It's not quite as simple as just replacing the `stories` property in the state though. We also need to make sure to "unselect" the currently selected story if it isn't in the new list. Also, any stories in the new list that we have already `seen` need to maintain that status. Here's how it could be implemented:

```js
const GotStories = (state, stories) => ({
  ...state,

  //not waiting for data:
  fetching: false,

  // replace old stories with new,
  // but keep the 'seen' value if it exists
  stories: Object.keys(stories)
      .map((id) => [
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

Notice we are also setting `fetching: false` to remember that we aren't waiting for new stories any more.

Now go ahead and try it out. Enter "Life" as the filter-word and see how new stories are loaded in to the list.

![fetched life stories](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut5.png)

### Running effects on initialization <a name="effectsoninit"></a>

The next obvious step is to load the _initial_ stories from the API as well.

Whatever you set the app's `init` prop to is handled just like the return value of an action. To run an effect on initialization, you change `init` in the same way we changed `StopEditingFilter` above:

```js
  init: [
    {
      editingFilter: false,
      autoUpdate: false,
      filter: "ocean",
      reading: null,
      stories: {},
      fetching: true  // <---
    },
    request({
      url: `https://zaceno.github.io/hatut/data/ocean.json`,
      expect: "json",
      action: GotStories,
    })
  ],
```

Also, notice that now we are starting with an empty set of `stories`, and setting `fetching: true`. Now try this out and notice you are getting the same list as before, after brief moment of the list being empty.

![fresh stories on init](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut6.png)

Since we have been careful to keep track of wether or not we are `fetching`, we could improve the user experience with a spinner to indicate we are fetching data. Update the `storyList`:

```js
const storyList = props => h("div", { class: "stories" }, [
  
  props.fetching && h("div", {class: "loadscreen"}, [  // <---
    h("div", {class: "spinner"})                       // <---
  ]),                                                  // <---
  
  h("ul", {}, Object.keys(props.stories).map(id => storyThumbnail({
    id,
    title: props.stories[id].title,
    author: props.stories[id].author,
    unread: !props.stories[id].seen,
    reading: props.reading === id,
    filter: props.filter,
  }))),
])
```

When the app loads, and when you change the filter, you should see the spinner appear until the stories are loaded.

![spinner](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut7.png)

> If you aren't seeing the spinner, it might just be happening too fast. Try choking your network speed. In the Chrome
> browser you can set your network speed to "slow 3g" under the network tab in the developer tools.

If you'd like to see a working example of the code so far, have a look [here][Live Example 3]

## Subscriptions <a name="subscriptions"></a>

The last feature we'll add is one where the user can opt in to have the app check every five seconds for new
stories matching the current filter. (There won't actually be any new stories, because it's not a real service,
but you'll know it's happening when you see the spinner pop up every five seconds.)

Whenever your app needs to react to external events (like callbacks to an interval), what you need is a _subscription_. As with effects, you can easily define your own effects but it's better to reuse the ones already available. In this case we want to import the subscription `every` from `@hyperapp/time`:

```js
import { app, h, text } from "https://unpkg.com/hyperapp"
import { request } from "https://unpkg.com/@hyperapp/http"
import { every } from "https://unpkg.com/@hyperapp/time" // <---
```

Now add the `subscriptions` property to your `app({...})`:

```js
app ({
  ...
  subscriptions: state => [
    every(5000, UpdateStories)
  ]
})
```

Similar to `request()` earlier, `every(...)` is not actually starting the subscription. It returns an object that tells Hyperapp how to start and stop the subscription. The arguments to `every` are the interval time in milliseconds, and the action to dispatch each time – a new action we'll call `UpdateStories`.


```js
const UpdateStories = (state) => [
  {
    ...state,
    fetching: true,                     
  },
  request({                            
    url: `https://zaceno.github.io/hatut/data/${state.filter.toLowerCase()}.json`,
    expect: "json",
    action: GotStories,
  }),
]
```

The action `UpdateStories` is going to be nearly the same as `StopEditingFilter`, with the one exception that we don't set `editingFilter: false`. If we kept that in, users would be "tossed out" from editing the filter after five seconds, which would be quite bothersome. We leave it as an exercise to the reader, to reduce the duplication of code that results.

But we want to allow the user to turn updating on and off, using the auto-update checkbox. Let's keep track of their preference using a new state property `autoUpdate`, with an action we'll call `TooggleAutoUpdate`:

```js
const ToggleAutoUpdate = (state) => ({
    ...state,
    autoUpdate: !state.autoUpdate,
})
```

Now connect that action & state property to the checkbox by changing `autoUpdateView`:

```js
const autoUpdateView = props => h("div", { class: "autoupdate" }, [
  text("Auto update: "),
  h("input", {
    type: "checkbox",
    checked: props.autoUpdate,  // <---
    oninput: ToggleAutoUpdate,  // <---
  }),
])
```

When the checkbox is checked, `autoUpdate` will be `true`, and _only then_ do we want the subscription to `every` to be active. It's as easy as:

```js
app ({
  ...
  subscriptions: state => [
    state.autoUpdate && every(5000, UpdateStories)  // <----
  ]
})
```

![auto update](https://raw.githubusercontent.com/jorgebucaran/hyperapp/1fd42319051e686adb9819b7e154f764fa3b0d29/docs/src/pages/Tutorial/tut8.png)

How did that work?! Think of how Hyperapp spares you the effort of manually adding and removing DOM nodes. All you have to do is describe how you want the DOM to look, and Hyperapp takes care of that for you. It's the same with subscriptions. Each time the state updates, Hyperapp calls the `subscriptions` function to check which subscriptions you want active, and with which properties. Then Hyperapp takes care of starting and stopping them for you.

That was the final step! If you'd like to see a working example have a look [here][Live Example 4]


## Conclusion <a name="conclusion"></a>

Congratulations on completing this Hyperapp tutorial! Next, try building something of your own. Perhaps a game, or a twist on the classic todo-list? Refer to the [API Reference](./reference.md) as needed, and feel free to bring all your questions to the [Hyperapp Slack workspace](https://join.slack.com/t/hyperapp/shared_invite/zt-frxjw3hc-TB4MgH4t74iPrY05KF9Jcg)







[Live Example 1]: https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvAHgBMIA3AAgjYF4AOiAwAHUcIB8LAPQdOkyiDgxY1YhHoJEIAAyIAjABYQAXwrpsuHfgBWCKnQZNieCFlG0ATsW7BuYqIU3ITBjAAevqbcYF60WNzCJMSicIgyMgCuaKIA1gDm+HRYMoQAnqIwXoHCgmh1GdwAtE3cAIIAwgAqAJIA8gByAMrNTXUNMqPcAGo9AKIA6iMtY-VoTnC+MB6EGHAQAF4w3PzcABQA7t5swZteEGj5AJQnknXc3HcP+e8f3PhwURQCDEM7CRIgJ6-D74LBiM5ncIvfhvNB-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-hwdvUT8MnnSdsei-Efjwbmk-Jw7AZlRdOOA5o1107SLrVou4KCsA-Ppu-Z9P9h4KhfAao1Up3nx8ZdsapCFaoHA2vcGWzVv4tADtgH2hcJoVLPjUDiALKVGuqha-xE0cIMpzGaaYND0HwJs1DdYZNj6BgVsYuoHLpjLWleuis17kKJPQolZlNlDrtGhdzYW4KSX7vMVMgRzB+G1PHMSrt2BCWwIBmRiktOj4x3utc7exd7YV3zH8-oAH5jQfi-cG8L5OJ6fxlZqzxxD6ee73y+rzp7nrC6BeDQGbgkXhDQ2vxya1D9uICIH203DvBfOfaN7yXgG6xy+3ZQzDrNohSIlmOB3xPdbVWqsNeB4JW+JbbHPS8gkFOZTwx8-+8zjPi4s3fXLTboOd-O3hxgKDDxo9NURV9VGtatL1NgyhYAZQQQ5YIBPc3N-M1FdE8lQsAVN9Qd8B9ofQ4ADchI0QO8sdt1yNEsxx8dH5CdBNhNss9479qCmsU9acmQDgmgHhwlLdNUydOsTtEUl9a8oNYUzgdVtVgghCRDtVhC0t8BsongeMZwmhYDMYZRt5nAvA7d7o0ASls1yVWU9cHgQ0YAWN9p4UpVZN5NwVVcpVwdb1zDMc4tsdiC8ceNUsBUSUE8-9EdtMqCmhj5Moz901AQHgSlEAMB4M59HRe4XBrwIRSVtDKV78jDchSVTDSsVd-cMxKtb0jA0jJRD8U01cncfdfpXRdVXDJQncRMRUXded+c0Cyjmta9QUPc+QX0fIvQ25GiMVmivlUc2jiBSVfJ3BG0iCAiNCm4DB8BMpM9G4-9eBB9l5x8SoAABf8MoWIKwCWEYzQ6dYlXMOzV9bwRzOIPpM4XQcJZ4f5IeX4SHIlXYlohzP1WgY44+cFU4mAc4y4tACfecFONOApDvJ9BQutZQpsJvHcR3DnHg30aogXDTBNETUA9XTXbXXXPJA3PaKAY3JE83dg63cJNAQXP7ebWYsXNLRbEVKXUFIwKk0ErhQacE7gs7ZFWvYEHAGlPAqVBomoqVXI5oAVEVJoPkwUQU3khEyaNHA+bgUTQUKUgtSXRrL4iqc0bNAE4ERQ7gWwP6DQMAMoJ-S9ALZAz4VAunUNKw-FfAIwbYGk80AECNTAK6NGf4uQwEv1CnXUwDCAqA3gWqYEeAvzcA+rcVfAAwS01MTZVQC6WtbQEAAwAATmykMDMBXFMCAA

[Live Example 2]: https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvAHgBMIA3AAgjYF4AOiAwAHUcIB8LAPQdOkyiDgxY1YhHoJEIAAyIAjABYQAXwrpsuHfgBWCKnQZNieCFlG0ATsW7BuYqIU3ITBjAAevqbcYF60WNzCJMSicIgyMgCuaKIA1gDm+HRYMoQAnqIwXoHCgmh1GdwAtE3cAIIAwgAqAJIA8gByAMrNTXV1TnC+Q8QYPgCiHBpo+QBi0Ixe3PzcABRTGIwAlNuSe-74lweMwTBLECvrUJuI3MRemTDcpkcTWtPEWiiRYQZZrDZVbZ7a4wE78M67C5XWY3bh3UEPcHPKqvMAYKAqb6-NCTaYwYhPTZQ-YomC3TguOEIpH4GHBSDYryvGAMhj4WZefLk-CcfGfIl-NBTbhDVQwdQzbxlals3hsJnnOrcbiXVm04KNXIwGCiAJQKDcGFvQhfOBWW7hagm3xgbzWr6u820ADumMQWu4XhgGA4K1efAoAam3gg8FewAD2t1ML1MfgBpkRpNlsBXljcHdlvtaMdzpi3n9aG12uQfAAuvHE9Xk7TU3n4LW2HWM1nTcRCBAC9GvMr+7bizBS6IXRWm9qVExXu9PpGq9XzAGN2gfuM0I0WtwAGo9eYAdRGLTG9RJ-zRHkIGDgEAAXl8drtvd42MEpnmVkyo3eTEm1ZUQoFBXZhESEBiWrHUsDEXZdnCAC1zg8J+VoAAZH0qg6R8YF2OF+B2T8vDYTCcO9PCCKIuduAAfhCSCQBgLBhGCYBzDeSdiGQ7gAGpoOgo5YLg7gl14-ihKg4QjlXODiUlaVhzKLpCEyLAACNMGgKFRDiVJTmY4RwI4vwA3oahwOoXJXmQWU1GIRUR2CAygTgfB6wzbgWEvANrMfNILLQ6tsiDENXnc1J8HC4Nv3oiLQ3yKLDM8pLMQU75V245AA0IFiJEoPxuECuBguEDRiFgKDuLY0QHyfV9dmizyOU2Ny0v5UFYFErKCuEIrONKqAgteYQMEyftvFqsIpNa-BJumrw+rqOslJvKVfFUrDB18HZWuMgaQHkcz-DKirlFzfNZu4PK12OzIoDO7i+i02x5WIfAjTKOAWq64d8yOfAENEXY+GM1T1M0nSMGgREmwjJsqtgVKPLbfNOzrbrqrpJslsICtuAWwGO3rRapsJrwsu1OLIu4ABCEnrrJrtWWNNAacDeK-WJrqMpWbYSLVLn2pxPn0bF6nN1E+S1o20kYghLxD1jb19LSo6WNO4rztG8rxvAZXbvu7UIj44RKRxOSsoDBb0TBK2tnEl3Xbdt2AyY46HlEKbzJCuDiAqGBDfNjim1FKBPjRmKpa5+gfam15ZQpZXgm4Ro-JaGW4IDV5jrgUQMHqXWRrG6CpaaMi2Fu83-sl5XVrXO2uodzEnfdzuu+7xI1y9litKmwES+GqybLsmVAWBe5HmV7KeMiFjBEETIACYAHYDAAZjksT84Hof6DOseIFs5OBWIEFHeV7i69qFeN90eZd9Xdbd2U7bczKAARck4YtA6mt4QmROlwM6ZcDbQVUibFuHluAADJ4EgMIAYF6c1F4LRRrCOWa5DqIOYtBIafhb5SQAAZNhwkGBIEBUiaW4GwWgUA3RPl8FYYgwRJifXJJkLYIYaGDmoMBUKqhQQ-juPQ2gaIICZDgFgWgbAeIeDdA8QRHA2DZF8FNbgo0tLeC+OSJsDCmFBm4AhfImAzQQAAI6ZAwPgbgABVXwTB3ABAUVgB4rjeQQGwMEGxEAmxoFoL+TICjJxVEESiTQVYnqjSwHQbRGBdF5gLGgQcEBuBaPxNYzINCmyTjRBgUq8Q5EMOKVKGANjDj4ADKQpu2o8FIOOkQvW5dhBPnMYcHhMBa7zS6gTbwTc37XkVktWgDjRBsEODAVWMB1aALgcA46OthoXUNmMzIkzpkwLXHfEAbQpqSM2VMxghscHam9jkP2pcg6VENtQG0tldHhFqjg4ZH9ymzAeJCHYThGAMC1sIFZJU1nQT+XDNAVRbp-MZLufcrQABKDiBijDqIEBGa5PHEEbKFKWhtaBOmLuHUKAsUrQQMNvYlcFSbBQTKFbUwgKWr2EDit2WDDbqS+H0QlVZBwygeLkYClB6LagGVyaCABpQ4k9DI2i8FS12C40C4nxCoLm2otwu0ZZSpAAdXbsugty4MVZwJgC+HyrSHxZjPWFfS6sYrDZDB4Q1ZUABZagAAhaohAFUuyVUuD4eM7WavEtqowLK9UuwNZbbA0BlSxFjGgNgUB43ZACL4Mc3ACXGpLAOLSoJfXiQddBAA4pkZUAAFOIdpYBwELdSjmAaVz0VME2Vta4Q1BLYCHCR1BNIuHwEKS+sAcAMA9WUHobAWI1BgllTgatXhWmAeC75Xhdim2rFLWZ3oaTTPOdWHae1d3HC5qpX+XyoDHpgPgUlCCkEphpcgFMpL1pczGRMk5My1ZXv3a+uoO5rxKGKKIaAVQ8BaSSaoJQKgnLRO0CAAwiBdBmAsCATAOA8BFHKkB+g-zXA2BXZCrYdK4KugYE0PEHiU2LuLnAJoKg8xgAANxNjoMY14ABiAAbDxljoUIO2XyHEbIbAmhsaJhx6gUm+NwV9GwfsrwDC6F0AAUhk9WDghdRplFeEJvg6ntR6dE4wDwo1GBicYZpKUindCiHCNwLeRhbP2aU3ZgIhzuCufCAZ7gRmmgmbAtMpocRvTBS8w55znnIurwAKyRfC6veLzm+PtrqPgKWkbfN5lE2xqzrxV4Zwcz5vzIX8uFa3j5zwLDomvCDGZrgMAfPgUhU0G0EB8gkFeFvZLTYi5sGSv5oEim7Mpd3BjeAmW-O5awMq7gBWZBFabCVn0rwjCFZi5V4JGJ6C1dUIcBro3rwU0BMc6Zk3ssWajjN-LMgKtLYu6V7gXGZDr0O2l1S52+CXby9wNbC2Nv3a+49+b3BXu9a2xoHb3N6sMje2gdLc8Eecirl+TLZHiBVxgO1zr3BdFQDYD582-nqhSldF4LArxNmVC8NQAiPn0f0ZfD2gwXGRtNgQoKB4TRYBgGxZ5mLdn-1pYy4nYgyBbkwH4AAcnNlLusmWqvbdm0kuAlnGA+eeYz58vNkndq8E0Z5GuvziyCZCwnQ3uC6CazAXnrw4ts9Cm1jrfPusO9k3wBTc2jAC+871kMyVXhW79-1zE3Obd8595V-3oep75bd5u3DWvmes996FIn7xaNk4p5k8QES6dNgZ9RbHfO8cE4L4nyjcaaNSno1UCAzGhdHYy4PYgw8FcQ5qwELSquo7q+RhboPJLi+B6N+ELXOvjf68N02OTnvXep7gk7nH8-6eJ6aj2xL8ftS66qMFvhMjVtb9xxgQTwmk2cf62X-jk-hv2aExgZUPf9NNk13AB8DDvSB7c5FowbmOMAA5ADDskcqQW9h5EBCYGRiMX8T8Cgz82BXgR0rIBwwAyNgDm9D5lUT8NAGRMtxNxVuNeMX9aAx838QwVtuBTdGtG93sWYCwSNqwl8+clNVM4dxsCwnpMsOd8gHgR9g8A8osj9FdIdldu81dqC08B9rdbdLcfM8xnc+Dr9W94hFC4JwIph6Mg5YB-Ng5XgqCNdYChNaARNLsJNUCG9r9SD38KCHgVBfBItIsfduAOMt5XCjdyJd9qgOAD9fsj9aAoCwAmFvQmgdNLRqA4hzQfN-CqhAifQmhwh84+Bu00A2CaVtEMkGDt8b9LRGEIYDA-8pNqB3C9c99vDgoU9ijd8ecMdZ9CBXh14j9X9rDP9Ldv83MnDJNpN2c5geC0ADdaBlDs8vNUi6D0ib0eZBZMjj9T9jCk1TDxUkCSQUC0DiCPD9dqj5jXhvBi4hQRi0wCxwJYo0AkpMsd91jw9NjikvA0BYjqIvAtIo4JDUt4c0jwIIDojoD+NDD4DLjFiHl68VjtxaD9jiYcZYAuCejeDBCXMHC3NhjG92C7w0dE8i8FDcdGEr9SM18tCe0glyd8RgC0jRBjsqYITOdZsks4TosetcVsSyhUZeBrVT5V9yNK9qNLQ68LD21ET8AmEQw4BwiOZ29qsocVdxDzdRBVDqxqipTtR5CcdB84JdFBjZTuBnwmgHhu0EiotFTqwBM4DZictGEiZBQINdhYsYtggLSrSYtLTLd8B14jhCdeImhslzFXgnRnAvBUiQM0AiNMtNNAtQiHhmsYADcmFbIfNajXguNf8F9GCsc0TYyhCO9RSxDe8JDA4LcnM1NujySw8ZCmgt5V4HdnjQIHgiNEAMBedIQGCYUGBDZoJ1NAztNXgHiCVch1NozfsKj8pEyccjBey1xuCoT8j4yzjSjpFgo4tcy1wzi7c3Mn8FEONzD1MJz8DONCi3gSdC45gXBnCtyM8pQi4gwGB1Ni53B9sodC4KzIQDB8BV4Djvk5heAbisUnjdwAABH6WIKwIcX0-0hg1TEqI8uALPWrAY6ZXYXQbtfIJ074AMFglTECnc8CwMSCxgXYLeLjGCmAOCpjBCoEo7DZLZRgTLInN02bT0zYPYkcU474w0zjVc-g3me3eM7UD424kIxdcIxhKAKIgIoI+IxI-rJgUfejZo8MCpewto+zDoowBS2i5UFBeimYkwjc9InAITDmHzDSlc1AnzEc2bJoJzNzEyn-SLcyoQ6PMMbgNiuy6k9omkssj7U0KYii8Cd07gWwGRDQMAMoFkjHNk0IhjevJrb5Vrfs5g-AIwNiJS0EjpTAYgbpcil0yi2rYvQKzQ+kntUEbJIo8vcjdfRTfAAwOK-9aDOUdQODPAAwAATnXkMDMDrFMCAA

[Live Example 3]: https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvAHgBMIA3AAgjYF4AOiAwAHUcIB8LAPQdOkyiDgxY1YhHoJEIAAyIAjABYQAXwrpsuHfgBWCKnQZNieCFlG0ATsW7BuYqIU3ITBjAAevqbcYF60WNzCJMSicIgyMgCuaKIA1gDm+HRYMoQAnqIwXoHCgmjunj5+XjAAjpnwxNGx8YkgyanpWTkFRfEyAALlldXipcQptWh1GdwAtGvcAIIAwgAqAJIA8gByAMrra3V1TnC+Z8QYPgCiHBpo+QBi0Ixe3PzcAAUdwwjAAlP9JED-PhYSDGMEYG8IB9vlBfohuMQvB1uKYwdc0Ld7sRaKJXhB3l8flV-kD4TAIfwocg6tw-Gz2dxYfgGRROeykZSUdT0VVMWAMFAVPy0FyYjBiNRCCLMdiOsFOeZOS12p1Af4BdxMl4oJiAAYDNIZABeGGoTFo+HylMImQARvhNKVQZliHJQRgZAASYAM-CQMVefCkgAytAA7lUdhgVICwaY7HB6ObZfKYOFKupMcJ7PRhHmufaNPRMQBxWjEB7eCDwSv42UAXUJxO4Z0VaN+dOBjwR3BgnBcTKhBu5cNHMGCkYx48nDBjT3yivwnCluPxPa091UMHUza8ZWHfN4bGn0M5PL5OpgGA4H0xfErdxb8ExwCNj4LrypJeK2cCVuyyB8J2f5GuygGgjAwE-nAUFsJ2EFcioTBqjii5Gtqcp4rKB7LESR7cA2TYgWBV4LsE36gfAd4Gg+86IZWYCKsqqoxFKMqcoxYGYkc7q2KexD4LkMBlHAI4oWC+BYGIgJ8JC3CskR7Kfka-5aVygEoWhGFwdw2FoJi4ZCfAxncAAZHZZlAdZqHQbyMBMJhhHsp2iktGwmQOoCgK0MEaEMSBZS+epwW0LZAKMWUYLBLQyV+B2z6vrxLnIOGLRZR8nbcAA-E5iH4Plb75NwmJoJkUBQCRBJkSsMiXNwABqBzPAA6hcGxXGRvYwB4hCphANowMOCbeGwEWgR806CdiIoAXAohQJSgLCH0zXykpKmAuES36ey4QxrQ8ZJl4KZpky-AAjNXhsBdV3JqmMDpqZpWENtIAjRW6VhAWxBHdwADUfS7Xt8o1ViINg5DO3CMlRrNTcFGJXsbpYO6mDQHSohxKk6m-cIm2A3p7L0NQm3ULkmLIP2ajUd4ZTBETZJwF66HBKsLADZytOpmkHKncaaCVZinOpPg2SVZh7KVbxMvc8rHztiRYWcmTIASJQfjcMLcCi8IGjELAO3mOOo3jZNgKqxGNJeBzxPc+bsBgqjRG6-rwT+MbpsiH6hDeFbwORA7bv4BgIfeF7Xbo+RaB3E5bOxhAqcAqrpN-fIlNG1AIslsoNHwOHGlGpyjtcUqKofPZjm6-nBvAIHJdQLQr5wNQLRMMI1uafKzdcJT7d9OtKJoFUA8w75laEuyuv1ZT1uieJ6hSTJcmOy5inKaIqlsOpWM43jGDQKx+k6fpHswNL0c5W5d+YbHxCh14D9c8hTGuehMdxxdkaeWL42CYgAIS7zLn-Ts7lPJGnVvkL+stEH-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-v-oNuCYDh0QXgheMevpMfOTvucVyMge9rtiKQmf3quesJUiUmmbLgBdOogBgEPn6ULCVi4CXH0HtiBUdpiK6c+rkHtnBeoWCUyTrB-nRkYPxURA2VLhCSSUCeYaLMjvhURJJS-t9mSfcXkXtpJUGUKdQMBi1qAS0AwI4dSdpSnLpS4Hts4u4CbobpPIBbSAYPgCUjqhBU8HipALuu6YSBMNJGULEFYDqtZUBZyDtobNiAQd4EQXEAuICLoLxvkO+XiJyJtkFf4CFZXmFZiBFYhICJUoNtFTALFZ1vFRGb7pbr5vLmXl+STg6M4F4KaZFMSaeZkSpY8fKKAYgbxK-hCdTNCbCfCZZIiQ1Cid1RiUeSqIgUwDUXUbyW8SiB8fMaEQKREUYEtbVWzCEAYPVQGWeUGZtDgJNlOYDuqU1YDmJesO9t9msGdeapdada2VyK1aMdwB1Y9Yjt8cYR6QSXVaIGVZ+ZtN+dwLYGihoGAGUL2TnvQY1oOR1lzv2rzoJRtvgEYCNCtReNGb8n6oRi0N9ZEGsBVelZQaDfsR2SopSEajSbQTnhge3vgAYEjSFglieOoMlngAYAAJxlKGBmCdimBAA

[Live Example 4]: https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvAHgBMIA3AAgjYF4AOiAwAHUcIB8LAPQdOkyiDgxY1YhHoJEIAAyIAjABYQAXwrpsuHfgBWCKnQZNieCFlG0ATsW7BuYqIU3ITBjAAevqbcYF60WNzCJMSicIgyMgCuaKIA1gDm+HRYMoQAnqIwXoHCgmjunj5+XjAAjpnwxNGx8YkgyanpWTkFRfEyAALlldXipcQptfUe3r7+MJxVZdzdcQlJC4MZ2XmFxZPTVYEyGjjCiWh1GdwAtC-cABIAogAyAApfABKAGU6k8ZNw2DA6NViN4YvCMOpNGg4Nw4TEYMRqIRuHA4V4IPA6k58dwAO4QYiEABiWJx3H4eOIGEYjMk3GQdW4fm5PO4+EF+NZMAofJ5YHphAgaHyiHRXg6YrQPPMfJa7U6AAp-Py9fqDYaeeLuJkvFB5QADAZpDIALyRTFo+HyVMImQARvhNKVWZliHJWRgZAASYDCxj4SBQRhefBwn60clVADCGBUWoAlKY7HB6JblXqYOFKup5cJ7PRhIX+UiNPR5QBxWjEYEEolwGumTN1AC6YLQzze3AAgimACoASQA8gA5YGvF4D0m+NsYHxfDgaWU06CxxncLURmCZ9mH-yC-DH4IwLcy-K7mNVeXERUwHY9x5oFfcNu0USblS96PvuTJHiyjCnvwHKUtSdLYoQOqXte3C3kBO57s+MQYFAKjdsuWirliIFVAe4EijemwMFBHI6gKQoQaKMSYV48obC48brvkWL4JwOEdB+BGokRaitgS2xgShfA0eefLIYxNYtBgHCyvKfA1vi3gdvKwAmvJIpXu28A1jyyB8L2Okmjy+mRpphLwGZbC9iZ-IqEwL5vi5aoqjsyr4V+P7NmJWnwGRKF2R2Mk6nJDEUXykoIfe8pgDhKgaUZaTcNOHq2NCxD4LkMBlHA4EhXAmb4FgYhanwZ5cj5PLqSaukNfy8llY5zlWXiMDucyBkRQ55ncAAZCN-W2RlnVXr1aBeTWvYVS0bCZNQMBalqtDBI5wR2WUi1nhttCdQee2ZsEtDnX43aKTAylJcyHXHvgSkqfkvbcAA-BNMAvXdb3cPKaCZFAUB+Z+JKEdwACqohsCKf72WikmMTJsG0lK5GQUJZLjrQ+T5LAI7+rQsPw2yKMilFLV6jZoomhgJNkyK8oAITPYzcLM4w4MDkO7wAGqTl8ADqC5vEuAVQzAHiEOmEB2u+YHkt4bC7a+940Xy+KErKelwKIUBUlq9zCJ+tNVaIG3hFrrU8uE8a0ImyZeGmGZQfwTIq14bCO87qbput5v6t9iHCDL1bXWExbEFq4TcAA1H0fSZsHeovjHceJ8nZsuRD35Q3t47ulgHqYNAB6iHEqRnmHIBG5HNPcPQ1BG9QuTysgwKqHliNlMEVf-nA3pOcEzwsBLfKt+mmVN3q2SvfKg+pPgC--S5PKvQ9y-D1vspdn5218nXEiUH43DT3AmXCBoxCwPc5iobL8uK1qO9RixA-V8Pt+wKnNYn0bhfKAM9ywiH9IQbwD9o6RDft-fAnNIFeH-n2fOP49o-AgGSJkO9a4mxAPIIBl9r7KAytAzkJo+TvwSjie8o1xp10IWfYAxCwFQFoMpOA1AWhMGEI-eqepGFcEbqwvoBsZRoCqHw4Oi0awDh5HXEGjdH7ZVyuoAqRUSrv0GuVSq1VarQUel4MoxdMil3LlAaKrUmqtV-jAJe8CdHTTsS5RB3gHFD0Mh1cyCCIHeBcmvZSbNtFTR8W5OaJo95ym4O-KJjJPa8DViaaMsYPErxSVULsqdzqoJxr4DJXgBZEnJJXb+eDhBMOCP4URwgCnkIEeiTOwgSKsVznyKh8C0LbgfCxI0fT+lGj5KHfBMpRD+kjryWxFR7F9AiMQasJo+JQA6Gk4eBSXL0FGf6eU3diAtOCNwcek8fLdj1HyeUdcDYYEeMw4BoC+gFJeN7Ng5C5lwM8QUlBPkOmeK6cBXpAzAVAoNEMkI+CPT+jhDcqpzdvxtw7r+OEAE7wYSfF4XyjTYG1EEJkAATAAdgMAAZjNsHC54LIVVmYS3eFOyWQbhRT0tFj83nYrxfi3QXxSXKkWgOSGwkjFlAACJYgwBXHBZTDFCM4EQkBV8wF7XqT8muY0wVJAMMomBsd352K+TyXBqrEJ9FPlUllmdLQmkTC0BIEBUhmMhLQdh6K4BUgCDgYgwRSR5SxGaAIHBRBYOoPeE0qgqS7VvA61CEBMhwCwLQNgjSVjoplEGjgK0GCml8CAj03h3xYhNGwR1ubuBVXyJgAIRt2gYHwDDXwTB3B+pLTKBtVEIDYGCO0CAJo0C0B1pkBNxYqhBogiiU0oNsB0G4NmrSaJ6guszRWiAnaJCtWLKhDAF94hxsLZu1EbRMisnwHyS0eqYllMNfgk158anKAgGWv0LRXmZ3fm45BOS0C8qlgKzmpM4YiiKTAEpEqh7lIIcI25N6f2ZD-YwJVPlWUgGJhiaD5MZltJ8nXLZ8zmEmmINMsBOJoS5BzeEBZrVCPt1vKs3xXMYP01apsnI2zuB4wJkTJmdGsk8rQVDJwLIZSkSZHxlwoHKnXrlSQvjYrJFeHIcJ6ifMITDkBNDWci46iBCsY1eoxB5To3gjiLT-I-motSdhXC9G9Q-u5jMlKFmXIFLAbQNa1yyN6iiUDEGYMTQ6J0t5VU76eQ9qhPKQt1AzEcW4sQL4sAcAMAAEJlEnGwfBNQQCBe4JwYp8pjxnikwJrwWoGkShYgB8kWMTwuQwVg2Ox4Ms8j2iK-jljnpxNVc9JxrX-r3lkQzDjqGysVYy71nycBPRcMJKIesqIcuMTqj5xiNHf2ofoahTYxitQAFZdA7eCDZxGkU+T9jQP5OoShigBtgF4PAHoMAelUEoFQokUTaBAEYQwRKzAWBAJgHAeAihX3O-QRgzAbD5Zk5MvUYBgcvBSlgaAZQcvXLgC8FQhIwAAG4TR0CdfKAAxAANiJ1j1qt3275DiNkNgLwcfuO4Hj6gjOSd6kpGwak8oDA7YAKTM-5BwA2IDEfcAp3wXnPIRfU8YB4EBjAaeOrMTN7gnPRDxyJUYXQKulca-jj+rXKuxfC8JJLmWhsRQvDiOSTKyvVfa71-HXF23NfW+4Li231uSemAHB-NFkP+QS7l8srAaB5S4sOdwIlBv-cW5D2HiPJpPAuum-KFoMuuAwAN0bSRLxCAwDvSQeURLtcG9EMpN6LwkUc-13UT3X4vFI19+Lo3AeFcx4hHH1qUekzyiMGHzbxfe1AQbNwFPrI08e691BujDfDd8Gb0HkPMh296k7+SeUBOZD4vH7Xva0--c45b9wHvEI+8mhX637gm-48D6T8P1Qo-Nhb7qN7-cz+qhPNVtP6HDAnm5-yPn7gOaUAbABucy5e1QqI0OXgWA8o0GMw1AgcBuX+xAqOCsMyBgBOVerUVUXgroaALwsAYAumSum2Ku1eT+BSvATGxAyAeGlQ-AAA5HMvQR9HPDEtfiiPKHdnmMsowAbiRigXaA9Dmj7G-iRnwarFhD2pIiAf+PKLoBnjAIQfKI7uEAbjnnnkQYXpgSznwOzi7kYCQaofHqXg9PIcYWwGXgQUQYYcXiYbKOXrIS7tofyEgQIWgRgUYbYjHGAcjpAdAaaOIEOggckjDsmBofKIAcASEd-nDgjkjqiKjlUBAJjmQbXhQRCgsPQNPgnoPsHgEB6Nwf6Onrho4WYa1ISH-kQWUXqPwS6oIapAARIV4C8GISaKznoVoZ4YIr-v-p0YgTDnUTMq7s4TyMIVCM0dUBwDGt3iMQAUiAUJTmgGwPjhYVEaTk0ZXvHBThgNsNwaLiaLUXLIWqvtwLbrbkYJrnjgABw3Fb6v7ooZFQqICQLrbT5k4LG0BU7yixYtzShgBf53HpGUrB51hp7T606sT05E4E7iHhCo5HFd7cBSHFEnZe46LT7qGVEc7c6P5oB14dhjrT7YG4FyG2EWEPTu5X6J4cH5GFG8ElGiCkkmhWFMnlHhGnHiGZH+HVH8hGz4io54awDl74ZIn0Aok1HzEU6fFLEB50547-EpHrFwlwAIknEygqC+BnGa6GH05Ep6niEiETH3TTGH6zG0DrZgDsLkgvBC4TaOpQAG7mlVCWlJgvDhAXJ8BQhoC4n4mhRGxvEbF4iOq1QGCXGM7UAGnjHm7GmZQeGRlv5WFPK6GEDyj4qzGHHKSIlanxw6kM5M4mjEkygtEthwj+GUmonb4ZRToQB-T3SyhvGSmLHU4QnfEyy-HJEAkHFNH4GKHIEtnNzgHcQ+nolGyrxoCvQBmGk9mEGymQkwhoAukuwejLIok15P4jkQDPFOnoqsHvFSlU6zmtlxrfh-GdkVm+loiiDxhUiwBElcQyjYlO7Zl253Hokyyf6hE9FEGRH9Hf74hlCwBAzeBVQOmpEXkxI0ZIJ3k4EPmnFPnwX25F7RHIH-mAW8Ashty-nIGxFQC2lJGKk17gX4DsKcLcKzTZHsFD5cHy70m2KlEKFKEcmRLsk8mjElnxCsl6h2gvAyhQjula6sVzHk5NmHnD75C3ZagO6bbBBSUyWbbSWnH4D4qZggHeE4R3p5FrTOBeDDkBpoAQ6sH86m5C4yiZ4wAtHsLtwG7tEpncAE4XFdH8iYn-72WzE5E37UU8Hin8gV6H66A84Fn3l4EsmvBEq4qYFrl4niL6XPgYCEGkRNzyZEGmwgC85GWC4RGWW5C842Xd5xnHxfl5XOGFl5GhmOVjFv6THRqZTbYBU+QVWQk6l7EJryn-G84NWiV5nUAKjI4l4tAZpdU9Woh9UuC87XLuCj5D7RUQ4GD4C4pohmXriUGQA6arkDgTCFRlCxBWBojTUJV8j+Xnyvi+HAXJ4tgihai6BQj5AqU7B8ic6HX+DHUQGnXD7nWMBahEoE5XUwA3UY53UVlP6T4rasGgHqVlryhaWxjDniQNnCXSnLH04KlklvTKFIUMYWlWk2k5bcL2mOmY2un8XSgWFMCwnwmZlql7qama6265lGD00w3eDbCEAGBw0fEHn9lGw4AU6zQG79mtWKl6glXygvDq6a6i3nG24S1uV2HRIqHcDy3DE5no2RV17bCiDT5g1GwQ3cC2AxoaBgBlBYWw7YBxE9To4Z4CbZ6FVK74BGAyyM3GIQUur3rEBmjvig1qXa15EVEkDG2oUzJUjqURnIVuEc74AGAO3V6PY9zIhaB4AGAACc+KhgZgvYpgQAA

