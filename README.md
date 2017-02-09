# [hyperapp](https://hyperapp.gomix.me/)
[![Version](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![TravisCI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com)

HyperApp is a `1kb` JavaScript library for building modern UI applications.

## Install
With npm or yarn.
<pre>
npm i <a href=https://npmjs.com/package/hyperapp>hyperapp</a>
</pre>

## Usage
CommonJS

```js
const { app, html } = require("hyperapp")
```

ES6
```js
import { app, html } from "hyperapp"
```

## Bundle
With [Browserify](https://github.com/substack/node-browserify).
<pre>
browserify -t <a href=https://github.com/substack/hyperxify>hyperxify</a> -g <a href=https://github.com/hughsk/uglifyify>uglifyify</a> index.js | <a href=https://www.npmjs.com/package/uglifyjs>uglifyjs</a> > bundle.js
</pre>

Or [Webpack](https://webpack.js.org/)/[Rollup](http://rollupjs.org/).

## CDN
HyperApp is also distributed as a minified file, hosted on a CDN.

For [JSX](https://babeljs.io/docs/plugins/transform-react-jsx/).
```html
<script src="https://unpkg.com/hyperapp/dist/hyperapp.js"></script>
```

For [Hyperx](https://github.com/substack/hyperx).
```html
<script src="https://unpkg.com/hyperapp/dist/hyperapp.hx.js"></script>
```

For a more thorough introduction and advanced usage see the [HyperApp User Guide](https://www.gitbook.com/book/hyperapp/hyperapp).

## Examples
<details>
<summary>Hello World</summary>

```js
app({
    model: "Hi.",
    view: model => html`<h1>${model}</h1>`
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
    view: (model, msg) => html`
        <div>
            <button onclick=${msg.add}>+</button>
            <h1>${model}</h1>
            <button onclick=${msg.sub} disabled=${model <= 0}>-</button>
        </div>`
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
    view: (model, msg) => html`
        <div>
            <h1>Hi${model ? " " + model : ""}.</h1>
            <input oninput=${e => msg.text(e.target.value)} />
        </div>`
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

const view = (model, msg) => html`
    <div
        onmousedown=${e => msg.drag({
            position: {
                x: e.pageX, y: e.pageY, offsetX: e.offsetX, offsetY: e.offsetY
            }
        })}
        style=${{
            userSelect: "none",
            cursor: "move",
            position: "absolute",
            padding: "10px",
            left: `${model.position.x - model.position.offsetX}px`,
            top: `${model.position.y - model.position.offsetY}px`,
            backgroundColor: model.dragging ? "gold" : "deepskyblue"
        }}
    >Drag Me!
    </div>`

const update = {
    drop: model => ({ dragging: false }),
    drag: (model, { position }) => ({ dragging: true, position }),
    move: (model, { x, y }) => model.dragging
        ? ({ position: { ...model.position, x, y } })
        : model
}

const subscriptions = [
    (_, msg) => addEventListener("mouseup", msg.drop),
    (_, msg) => addEventListener("mousemove", e =>
        msg.move({ x: e.pageX, y: e.pageY }))
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

const view = (model, msg) => {
    return html`
        <div>
            <h1>Todo</h1>
            <p>
                Show: ${
                Object.keys(FilterInfo)
                    .filter(key => FilterInfo[key] !== model.filter)
                    .map(key => html`
                        <span><a href="#" onclick=${_ => msg.filter({
                            value: FilterInfo[key]
                        })}>${key}</a> </span>
                    `)}
            </p>

            <p><ul>
                ${model.todos
                    .filter(t =>
                        model.filter === FilterInfo.Done
                            ? t.done :
                        model.filter === FilterInfo.Todo
                            ? !t.done :
                        model.filter === FilterInfo.All)
                    .map(t => html`
                        <li style=${{
                                color: t.done ? "gray" : "black",
                                textDecoration: t.done ? "line-through" : "none"
                            }}
                            onclick=${e => msg.toggle({
                                value: t.done,
                                id: t.id
                            })}>${t.value}
                        </li>`)}
            </ul></p>

            <p>
                <input
                    type="text"
                    onkeyup=${e => e.keyCode === 13 ? msg.add() : ""}
                    oninput=${e => msg.input({ value: e.target.value })}
                    value=${model.input}
                    placeholder=${model.placeholder}
                />
                <button onclick=${msg.add}>add</button>
            </p>
        </div>`
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
* [html](#html)
* [jsx](#jsx)
* [app](#app)
    * [model](#model)
    * [update](#update)
    * [view](#view)
        * [Lifecycle Methods](#lifecycle-methods)
    * [effects](#effects)
    * [subscriptions](#subscriptions)
    * [hooks](#hooks)
        * [onAction](#onaction)
        * [onUpdate](#onupdate)
        * [onError](#onerror)
    * [root](#root)
* [Routing](#routing)
    * [setLocation](#setlocation)
    * [href](#href)

## html
Use to compose HTML elements.

```js
const hello = html`<h1>Hello.</h1>`
```

> `html` is a [Hyperx](https://github.com/substack/hyperx)-based [template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) function.

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

## app
Use `app` to bootstrap your app.

```js
app({
    model, update, view, subscriptions, effects, hooks, root
})
```

All properties are optional.

### model
A value or object that represents the entire state of your app.

To update the model, you send actions describing how the model should change. See [view](#view).

### update
An object composed of functions known as reducers. These are a kind of action you send to update the model.

A reducer describes how the model should change by returning a new model or part of a model.

```js
const update = {
    increment: model => model + 1,
    decrement: model => model - 1
}
```

If a reducer returns part of a model, that part will be merged with the current model.

You call reducers inside a [view](#view), [effect](#effect) or [subscription](#subscriptions).

Reducers have a signature `(model, data)`, where

* `model` is the current model, and
* `data` is the data sent along with the action.

### view
The view is a function that returns HTML using the `html` function.

The view has a signature `(model, msg, params)`, where

* `model` is the current model,
* `msg` is an object you use to send actions (call reducers or cause effects) and
* `params` are the [route](#routing) parameters.

Use `msg` to send actions.

```js
msg.action(data)
```

* `data` is the data that's passed to the `action`, and
* `action` the name of the reducer / effect.

<details>
<summary><i>Example</i></summary>

```js
app({
    model: true,
    view: (model, msg) => html`<button onclick=${msg.toggle}>${model+""}</button>`,
    update: {
        toggle: model => !model
    }
})
```

[View online](http://codepen.io/jbucaran/pen/ZLGGzy?editors=0010)
</details>

The view object may accommodate multiple views too. See [routing](#routing).

<details>
<summary><i>Example</i></summary>

```js
app({
    view: {
        "/": _ => html`<h1>Home</h1>`,
        "/about": _ => html`<h1>About</h1>`
    }
})
```

[View online](https://hyperapp-simple-routing.gomix.me/)
</details>

#### Lifecycle Methods
Function handlers you can attach to virtual nodes to access DOM elements. The available methods are:

* oncreate(e : `HTMLElement`)
* onupdate(e : `HTMLElement`)
* onremove(e : `HTMLElement`)

```js
app({
  view: _ => html`<div oncreate=${e => console.log(e)}>Hi.</div>`
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
    view: model => html`<canvas
        width="600"
        height="300"
        onupdate=${e => repaint(e, model)} />`,
    update: {
        move: (model) => ({ x: model.x + 1, y: model.y + 1 })
    },
    subscriptions: [
      (_, msg) => setInterval(_ => msg.move(), 10)
    ]
})
```

[View online](http://codepen.io/jbucaran/pen/MJXMQZ?editors=0010)
</details>

### effects
Effects cause side effects and are often asynchronous, like writing to a database, or sending requests to servers. They can dispatch other actions too.

Effects have a signature `(model, msg, data, error)`, where

* `model` is the current model,
* `msg` is an object you use to call reducers / cause effects (see [view](#view)),
* `data` is the data passed into the effect, and
* `error` is a function you can optionally call to throw an error

<details>
<summary><i>Example</i></summary>

```js
const wait = time => new Promise(resolve => setTimeout(_ => resolve(), time))

const model = {
    counter: 0,
    waiting: false
}

const view = (model, msg) =>
    html`
        <button
            onclick=${msg.waitThenAdd}
            disabled=${model.waiting}>${model.counter}
        </button>`


const update = {
    add: model => ({ counter: model.counter + 1 }),
    toggle: model => ({ waiting: !model.waiting})
}

const effects = {
    waitThenAdd: (model, msg) => {
        msg.toggle()
        wait(1000).then(msg.add).then(msg.toggle)
    }
}

app({ model, view, update, effects })
```

[View online](http://codepen.io/jbucaran/pen/jyEKmw?editors=0010)
</details>

### subscriptions
Subscriptions are functions that run once when the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, like mouse or keyboard listeners.

While reducers and effects are actions _you_ cause, you can't call subscriptions directly.

A subscription has a signature `(model, msg, error)`.

<details>
<summary><i>Example</i></summary>

```js
app({
    model: { x: 0, y: 0 },
    update: {
        move: (_, { x, y }) => ({ x, y })
    },
    view: model => html`<h1>${model.x}, ${model.y}</h1>`,
    subscriptions: [
        (_, msg) => addEventListener("mousemove", e => msg.move({ x: e.clientX, y: e.clientY }))
    ]
})
```

[View online](http://codepen.io/jbucaran/pen/Bpyraw?editors=0010)
</details>


### hooks
Function handlers that can be used to inspect your application, implement middleware, loggers, etc.

#### onUpdate
Called when the model changes. Signature `(lastModel, newModel, data)`.

#### onAction
Called when an action (reducer or effect) is dispatched. Signature `(name, data)`.

#### onError
Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature `(err)`.

<details>
<summary><i>Example</i></summary>

```js
app({
    model: true,
    view: (model, msg) => html`
        <div>
            <button onclick=${msg.doSomething}>Log</button>
            <button onclick=${msg.boom}>Error</button>
        </div>`,
    update: {
        doSomething: model => !model,
    },
    effects: {
        boom: (model, msg, data, err) => setTimeout(_ => err(Error("BOOM")), 1000)
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

### root
The root is the HTML element that will serve as a container for your app. If none is given, a `div` element is appended to the document.body.

## Routing
Instead of a view as a single function, declare an object with multiple views and use the route path as the key.

```js
app({
    view: {
        "*": (model, msg) => {},
        "/": (model, msg) => {},
        "/:slug": (model, msg, params) => {}
    }
})
```

* `/` index route, also used when no other route matches

* `/:a/:b/:c` matches a route with three components using the regular expression `[A-Za-z0-9]+` and stores each captured group in the params object, which is passed into the view function.

The route path syntax is based in the same syntax found in [Express](https://expressjs.com/en/guide/routing.html).


<details>
<summary><i>Example</i></summary>

```js
const { app, html } = require("hyperapp")
const anchor = n => html`<h1><a href=${"/" + n}>${n}</a></h1>`

app({
    view: {
        "/": _ => anchor(Math.floor(Math.random() * 999)),
        "/:key": (model, msg, { key }) => html`
            <div>
                <h1>${key}</h1>
                <a href="/">Back</a>
            </div>`
    }
})
```

[View online](https://hyperapp-routing.gomix.me/)
</details>

### setLocation
To update the address bar relative location and render a different view, use `msg.setLocation(path)`.

<details>
<summary><i>Example</i></summary>

```js
app({
    view: {
      "/": (model, msg) => html`
        <div>
          <h1>Home</h1>
          <button onclick=${_ => msg.setLocation("/about")}>About</button>
        </div>`,
      "/about": (model, msg) => html`
        <div>
          <h1>About</h1>
          <button onclick=${_ => msg.setLocation("/")}>Home</button>
        </div>`
    }
})
```

[View online](https://hyperapp-set-location.gomix.me/)
</details>

### href
HyperApp intercepts all `<a href="/path">...</a>` clicks and calls `msg.setLocation("/path")` for you. If you want to opt out of this, add a custom `data-no-routing` attribute to anchor elements that should be handled differently.

```html
<a data-no-routing>...</a>
```

<details>
<summary><i>Example</i></summary>

```js
app({
    view: {
      "/": (model, msg) => html`
        <div>
          <h1>Home</h1>
          <a href="/about">About</a>
        </div>`,
      "/about": (model, msg) => html`
        <div>
          <h1>About</h1>
          <a href="/">Home</a>
        </div>`
    }
})
```

[View online](https://hyperapp-href.gomix.me/)
</details>
