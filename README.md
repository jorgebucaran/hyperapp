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
    view: (model, actions) => html`
        <div>
            <button onclick=${actions.add}>+</button>
            <h1>${model}</h1>
            <button onclick=${actions.sub} disabled=${model <= 0}>-</button>
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
    view: (model, actions) => html`
        <div>
            <h1>Hi${model ? " " + model : ""}.</h1>
            <input oninput=${e => actions.text(e.target.value)} />
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

const view = (model, actions) => html`
    <div
        onmousedown=${e => actions.drag({
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

const view = (model, actions) => {
    return html`
        <div>
            <h1>Todo</h1>
            <p>
                Show: ${
                Object.keys(FilterInfo)
                    .filter(key => FilterInfo[key] !== model.filter)
                    .map(key => html`
                        <span><a href="#" onclick=${_ => actions.filter({
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
                            onclick=${e => actions.toggle({
                                value: t.done,
                                id: t.id
                            })}>${t.value}
                        </li>`)}
            </ul></p>

            <p>
                <input
                    type="text"
                    onkeyup=${e => e.keyCode === 13 ? actions.add() : ""}
                    oninput=${e => actions.input({ value: e.target.value })}
                    value=${model.input}
                    placeholder=${model.placeholder}
                />
                <button onclick=${actions.add}>add</button>
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
    * [render](#render)
* [Routing](#routing)

## html
Use `html` to compose HTML elements.

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
Use `app` to start your app.

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

Reducers can return an entire new model or part of a model. If a reducer returns part of a model, it will merged with the current model.

Reducers can be triggered inside a [view](#optionview), [effect](#optioneffects) or [subscription](#optionssubscriptions).

Reducers have the signature `(model, data)`, where

* `model` is the current model, and
* `data` is the data sent to the reducer. See [view](#optionsview).

### options.view
A function that returns an HTML element using [jsx](#jsx) or [`html`](#html) function.

The view has the signature `(model, actions)`, where

* `model` is the current model, and
* `actions` is an object used to trigger [reducers](optionsupdate) and/or [effects](optionseffects).

```js
actions.action(data)
```

* `data` is any data you want to send to `action`, and
* `action` the name of the reducer or effect.

<details>
<summary><i>Example</i></summary>

```js
app({
    model: true,
    view: (model, actions) => html`<button onclick=${actions.toggle}>${model+""}</button>`,
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
      (_, actions) => setInterval(_ => actions.move(), 10)
    ]
})
```

[View online](http://codepen.io/jbucaran/pen/MJXMQZ?editors=0010)
</details>

### options.effects
Actions that cause side effects and are often asynchronous, like writing to a database, or sending requests to servers.

Effects have a signature `(model, actions, data, error)`, where

* `model` is the current model,
* `actions` is an object used to trigger [reducers](optionsupdate) and/or [effects](optionseffects),
* `data` is the data send to the effect, and
* `error` is a function you may call to throw an error

<details>
<summary><i>Example</i></summary>

```js
const wait = time => new Promise(resolve => setTimeout(_ => resolve(), time))

const model = {
    counter: 0,
    waiting: false
}

const view = (model, actions) =>
    html`
        <button
            onclick=${actions.waitThenAdd}
            disabled=${model.waiting}>${model.counter}
        </button>`


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
    view: model => html`<h1>${model.x}, ${model.y}</h1>`,
    subscriptions: [
        (_, actions) => addEventListener("mousemove", e => actions.move({ x: e.clientX, y: e.clientY }))
    ]
})
```

[View online](http://codepen.io/jbucaran/pen/Bpyraw?editors=0010)
</details>


### options.hooks
Function handlers that can be used to inspect your application, implement middleware, loggers, etc.

#### onUpdate
Called when the model changes. Signature `(lastModel, newModel, data)`.

#### onAction
Called when an action (reducer or effect) is triggered. Signature `(name, data)`.

#### onError
Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature `(err)`.

<details>
<summary><i>Example</i></summary>

```js
app({
    model: true,
    view: (model, actions) => html`
        <div>
            <button onclick=${actions.doSomething}>Log</button>
            <button onclick=${actions.boom}>Error</button>
        </div>`,
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
The HTML element container of your application. If none is given, a `div` element is appended to document.body and used as the root node of your application.

### render
[app](#app) returns an object that consists of
* the same input options passed to `app`, and
* a `render(view)` function that can be used to render and alternate between views.

The `render` function can be used to implement routing in your application.

## Routing
HyperApp does not provide a router out of the box. If your application needs a router use [HyperApp Router](https://github.com/hyperapp/hyperapp-router).