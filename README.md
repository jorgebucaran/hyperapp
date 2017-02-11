# [hyperapp](https://hyperapp.gomix.me/)
[![Version](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![TravisCI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com)

HyperApp is a `1kb` JavaScript library for building modern UI applications.

## Install
<pre>
npm i <a href=https://npmjs.com/package/hyperapp>hyperapp</a>
</pre>

## Usage
CommonJS

```js
const { app, h } = require("hyperapp")
```

ES6
```js
import { app, h } from "hyperapp"
```

## Bundle
With [Browserify](https://github.com/substack/node-browserify).
<pre>
browserify -t <a href=https://github.com/substack/hyperxify>hyperxify</a> -g <a href=https://github.com/hughsk/uglifyify>uglifyify</a> index.js | <a href=https://www.npmjs.com/package/uglifyjs>uglifyjs</a> > bundle.js
</pre>

Or [Webpack](https://webpack.js.org/)/[Rollup](http://rollupjs.org/).

## CDN
HyperApp is also distributed as a minified file, hosted on a CDN.

```html
<script src="https://unpkg.com/hyperapp/dist/hyperapp.js"></script>
```

For a more thorough introduction and advanced usage see the [HyperApp User Guide](https://www.gitbook.com/book/hyperapp/hyperapp).

## Examples
<details>
<summary>Hello World</summary>

```js
app({
    model: "Hi.",
    view: model => <h1>{model}</h1>
})
```

[View online](http://codepen.io/jbucaran/pen/Qdwpxy?editors=0010)
</details>


<details>
<summary>Counter</summary>

```js
app({
    model: 0,
    update: {
        add: model => model + 1,
        sub: model => model - 1
    },
    view: (model, actions) =>
        <div>
            <button onclick={actions.add}>+</button>
            <h1>{model}</h1>
            <button onclick={actions.sub} disabled={model <= 0}>-</button>
        </div>
})
```

[View online](http://codepen.io/jbucaran/pen/zNxZLP?editors=0010)
</details>


<details>
<summary>Input</summary>

```js
app({
    model: "",
    update: {
        text: (_, value) => value
    },
    view: (model, actions) =>
        <div>
            <h1>Hi{model ? " " + model : ""}.</h1>
            <input oninput={e => actions.text(e.target.value)} />
        </div>
})
```

[View online](http://codepen.io/jbucaran/pen/ggbmdN?editors=0010#)
</details>


<details>
<summary>Drag & Drop</summary>

```js
const model = {
    dragging: false,
    position: {
        x: 0, y: 0, offsetX: 0, offsetY: 0
    }
}

const view = (model, actions) =>
    <div
        onmousedown={e => actions.drag({
            position: {
                x: e.pageX, y: e.pageY, offsetX: e.offsetX, offsetY: e.offsetY
            }
        })}
        style={{
            userSelect: "none",
            cursor: "move",
            position: "absolute",
            padding: "10px",
            left: `{model.position.x - model.position.offsetX}px`,
            top: `{model.position.y - model.position.offsetY}px`,
            backgroundColor: model.dragging ? "gold" : "deepskyblue"
        }}
    >Drag Me!
    </div>

const update = {
    drop: model => ({ dragging: false }),
    drag: (model, { position }) => ({ dragging: true, position }),
    move: (model, { x, y }) => model.dragging
        ? ({ position: { ...model.position, x, y } })
        : model
}

const subscriptions = [
    (_, actions) => addEventListener("mouseup", actions.drop),
    (_, actions) => addEventListener("mousemove", e =>
        actions.move({ x: e.pageX, y: e.pageY }))
]

app({ model, view, update, subscriptions })
```

[View online](http://codepen.io/jbucaran/pen/apzYvo?editors=0010)
</details>


<details>
<summary>Todo</summary>

```js
const FilterInfo = { All: 0, Todo: 1, Done: 2 }

const model = {
    todos: [],
    filter: FilterInfo.All,
    input: "",
    placeholder: "Add new todo!"
}

const view = (model, actions) =>
    <div>
        <h1>Todo</h1>
        <p>
            Show: {
                Object.keys(FilterInfo)
                    .filter(key => FilterInfo[key] !== model.filter)
                    .map(key =>
                        <span><a href="#" onclick={_ => actions.filter({
                            value: FilterInfo[key]
                        })}>{key}</a> </span>
                    )}
        </p>

        <p><ul>
            {model.todos
                .filter(t =>
                    model.filter === FilterInfo.Done
                        ? t.done :
                        model.filter === FilterInfo.Todo
                            ? !t.done :
                            model.filter === FilterInfo.All)
                .map(t =>
                    <li style={{
                        color: t.done ? "gray" : "black",
                        textDecoration: t.done ? "line-through" : "none"
                    }}
                        onclick={e => actions.toggle({
                            value: t.done,
                            id: t.id
                        })}>{t.value}
                    </li>)}
        </ul></p>

        <p>
            <input
                type="text"
                onkeyup={e => e.keyCode === 13 ? actions.add() : ""}
                oninput={e => actions.input({ value: e.target.value })}
                value={model.input}
                placeholder={model.placeholder}
            />
            <button onclick={actions.add}>add</button>
        </p>
    </div>
}

const update = {
    add: model => ({
        input: "",
        todos: model.todos.concat({
            done: false,
            value: model.input,
            id: model.todos.length + 1
        })
    }),
    toggle: (model, { id, value }) => ({
        todos: model.todos.map(t =>
            id === t.id
                ? Object.assign({}, t, { done: !value })
                : t)
    }),
    input: (model, { value }) => ({ input: value }),
    filter: (model, { value }) => ({ filter: value })
}

app({ model, view, update })
```

[View online](http://codepen.io/jbucaran/pen/zNxRLy?editors=0010)
</details>

[See more examples](https://hyperapp.gomix.me/)

## Documentation
* [jsx](#jsx)
* [html](#html)
* [app](#app)
    * [model](#optionsmodel)
    * [update](#optionsupdate)
    * [view](#optionsview)
        * [Lifecycle Methods](#lifecycle-methods)
    * [effects](#optionseffects)
    * [subscriptions](#optionssubscriptions)
    * [hooks](#optionshooks)
        * [onAction](#onaction)
        * [onUpdate](#onupdate)
        * [onError](#onerror)
    * [root](#optionsroot)
    * [Router](#optionsrouter)
        * [setLocation](#actionssetlocation)
        * [href](#href)

## jsx
Import the `h` function and include the [jsx pragma](https://babeljs.io/docs/plugins/transform-react-jsx/), in any order.

```js
import { h, app } from "hyperapp"
/** @jsx h */

app({
    model: "Hi.",
    view: model => <h1>{model}</h1>
})
```

[View online](http://codepen.io/jbucaran/pen/ggjBPE?editors=0010)

Or, add it to your [`.babelrc`](https://babeljs.io/docs/usage/babelrc/) configuration.

```
{
    "plugins": [
        ["transform-react-jsx", { "pragma": "h" }]
    ]
}
```

## html
To use HyperApp without jsx, import the `html` function instead.

```js
const { html, app } = require("hyperapp")

app({
    model: "Hi.",
    view: model => html`<h1>${model}</h1>`
})
```

`html` is a [Hyperx](https://github.com/substack/hyperx)-based [template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) function.

## app
Use `app` to start the app.

```js
app(options)
```

### options.model
A primitive type, array or object that represents the state of your application. HyperApp applications use a single model architecture.

### options.update
An object composed of functions often called _reducers_. A reducer describes how to derive the next model from the current model.

```js
const update = {
    increment: model => model + 1,
    decrement: model => model - 1
}
```

Reducers can return an entirely new model or part of a model. If a reducer returns part of a model, it will be merged with the current model.

Reducers can be triggered inside a [view](#optionview), [effect](#optioneffects) or [subscription](#optionssubscriptions).

Reducers have the signature `(model, data, params)`:

* `model` is the current model.
* `data` is the data sent to the reducer.

When using the [Router](#optionsrouter), the view receives additionally

<a name="params"></a>

* `params` an object with the matched route parameters.

### options.view
A function that returns an HTML element using [jsx](#jsx) or the [`html`](#html) function.

A view has the signature `(model, actions)`:

* `model` is the current model.
* `actions` is an object used to trigger [reducers](optionsupdate) and [effects](optionseffects).

To use actions:

```js
actions.action(data)
```

* `data` is any data you want to send to `action`.
* `action` is the name of the reducer or effect.

<details>
<summary><i>Example</i></summary>

```js
app({
    model: true,
    view: (model, actions) => <button onclick={actions.toggle}>{model+""}</button>,
    update: {
        toggle: model => !model
    }
})
```

[View online](http://codepen.io/jbucaran/pen/ZLGGzy?editors=0010)
</details>

#### Lifecycle Methods
Functions that can be attached to your virtual HTML nodes to access their real DOM elements.

* oncreate(e : `HTMLElement`)
* onupdate(e : `HTMLElement`)
* onremove(e : `HTMLElement`)

```js
app({
    view: _ => <div oncreate={e => console.log(e)}>Hi.</div>
})
```

<details>
<summary><i>Example</i></summary>

```js
const repaint = (canvas, model) => {
    const context = canvas.getContext("2d")
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.beginPath()
    context.arc(model.x, model.y, 50, 0, 2 * Math.PI)
    context.stroke()
}

app({
    model: { x: 0, y: 0 },
    view: model => <canvas
        width="600"
        height="300"
        onupdate={e => repaint(e, model)} />,
    update: {
        move: (model) => ({ x: model.x + 1, y: model.y + 1 })
    },
    subscriptions: [
      (_, actions) => setInterval(_ => actions.move(), 10)
    ]
})
```

[View online](http://codepen.io/jbucaran/pen/MJXMQZ?editors=0010)
</details>

### options.effects
Actions that cause side effects and can be asynchronous, like writing to a database, or sending requests to servers.

Effects have the following signature: `(model, actions, data, error)`.

* `model` is the current model.
* `actions` is an object used to trigger [reducers](optionsupdate) and [effects](optionseffects).
* `data` is the data sent to the effect.
* `error` is a function you may call to throw an error.

<details>
<summary><i>Example</i></summary>

```js
const wait = time => new Promise(resolve => setTimeout(_ => resolve(), time))

const model = {
    counter: 0,
    waiting: false
}

const view = (model, actions) =>
    <button
        onclick={actions.waitThenAdd}
        disabled={model.waiting}>{model.counter}
    </button>


const update = {
    add: model => ({ counter: model.counter + 1 }),
    toggle: model => ({ waiting: !model.waiting})
}

const effects = {
    waitThenAdd: (model, actions) => {
        actions.toggle()
        wait(1000).then(actions.add).then(actions.toggle)
    }
}

app({ model, view, update, effects })
```

[View online](http://codepen.io/jbucaran/pen/jyEKmw?editors=0010)
</details>

### options.subscriptions
Subscriptions are functions scheduled to run only once when the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, open a socket connection, attached mouse or keyboard event listeners, etc.

A subscription has the signature `(model, actions, error)`.

<details>
<summary><i>Example</i></summary>

```js
app({
    model: { x: 0, y: 0 },
    update: {
        move: (_, { x, y }) => ({ x, y })
    },
    view: model => <h1>{model.x}, {model.y}</h1>,
    subscriptions: [
        (_, actions) => addEventListener("mousemove", e => actions.move({
            x: e.clientX,
            y: e.clientY
        }))
    ]
})
```

[View online](http://codepen.io/jbucaran/pen/Bpyraw?editors=0010)
</details>


### options.hooks
Function handlers that can be used to inspect your application, implement middleware, loggers, etc. There are three: `onUpdate`, `onAction`, and `onError`.

#### onUpdate
Called when the model changes. Signature: `(lastModel, newModel, data)`.

#### onAction
Called when an action (reducer or effect) is triggered. Signature: `(name, data)`.

#### onError
Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature: `(err)`.

<details>
<summary><i>Example</i></summary>

```js
app({
    model: true,
    view: (model, actions) =>
        <div>
            <button onclick={actions.doSomething}>Log</button>
            <button onclick={actions.boom}>Error</button>
        </div>,
    update: {
        doSomething: model => !model,
    },
    effects: {
        boom: (model, actions, data, err) => setTimeout(_ => err(Error("BOOM")), 1000)
    },
    hooks: {
        onError: e =>
            console.log("[Error] %c%s", "color: red", e),
        onAction: name =>
            console.log("[Action] %c%s", "color: blue", name),
        onUpdate: (last, model) =>
            console.log("[Update] %c%s -> %c%s", "color: gray", last, "color: blue", model)
    }
})
```

[View online](http://codepen.io/jbucaran/pen/xgbzEy?editors=0010)
</details>

### options.root
The HTML element container of your application. If none is given, a `div` element is appended to document.body and used as the container.

### options.router
HyperApp provides a router out of the box.

```js
import { h, app, router } from "hyperapp"

app({ model, view, update, router })
```

When using the router, the `view` must be an object that consists of routes, each with a corresponding view function.

```js
app({
    view: {
        "/": (model, actions) => {},
        "/about": (model, actions) => {},
        "/:slug": (model, actions, params) => {}
    }
})
```

<details>
<summary><i>Example</i></summary>

```js
const { h, app } = require("hyperapp")
const Anchor = ({ href }) => <h1><a href={"/" + href}>{href}</a></h1>

app({
    view: {
        "/": _ => <Anchor href={Math.floor(Math.random() * 999)}></Anchor>,
        "/:key": (model, actions, { key }) =>
            <div>
                <h1>{key}</h1>
                <a href="/">Back</a>
            </div>
    }
})
```

[View online](https://hyperapp-routing.gomix.me/)
</details>

* `/` matches the index route or when no other route matches.

* `/:slug` matches a route using the regular expression `[A-Za-z0-9]+`. The matched key is passed to the route's view function via [`params`](#params).

> The router path syntax is loosely based in the same syntax used in [Express](https://expressjs.com/en/guide/routing.html).

### actions.setLocation
A special action available when using the [Router](#optionsrouter). Use `setLocation(path)` to update the [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location). If the path matches an existing route, the corresponding view will be rendered.

<details>
<summary><i>Example</i></summary>

```js
const Page = ({ title, target, onclick }) =>
    <div>
        <h1>{title}</h1>
        <button onclick={onclick}>{target}</button>
    </div>

app({
    router,
    view: {
        "/": (model, actions) =>
            <Page
                title="Home"
                target="About"
                onclick={_ => actions.setLocation("/about")}>
            </Page>
        ,
        "/about": (model, actions) =>
            <Page
                title="About"
                target="Home"
                onclick={_ => actions.setLocation("/")}>
            </Page>
    }
})
```

[View online](https://hyperapp-set-location.gomix.me/)
</details>


#### href
HyperApp intercepts all `<a href="/path">...</a>` clicks and calls `action.setLocation("/path")` for convenience. External links and links that begin with a `#` character are not intercepted.

<details>
<summary><i>Example</i></summary>

```js
app({
    view: {
        "/": (model, msg) =>
            <div>
                <h1>Home</h1>
                <a href="/about">About</a>
            </div>
        ,
        "/about": (model, msg) =>
            <div>
                <h1>About</h1>
                <a href="/">Home</a>
            </div>
    }
})
```

[View online](https://hyperapp-href.gomix.me/)
</details>

Add a custom `data-no-routing` attribute to anchor elements that should be handled differently.

```html
<a data-no-routing>Not a route</a>
```