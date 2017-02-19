# [hyperapp](https://hyperapp.gomix.me)
[![circleci](https://circleci.com/gh/hyperapp/hyperapp/tree/master.svg?style=shield)](https://circleci.com/gh/hyperapp/hyperapp/tree/master)
[![travis](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![CDNJS version](https://img.shields.io/cdnjs/v/hyperapp.svg)](https://cdnjs.com/libraries/hyperapp)
[![version](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com)

[Browserify]: https://github.com/substack/node-browserify
[Webpack]: https://github.com/webpack/webpack
[Rollup]: https://github.com/rollup/rollup
[Hyperx]: https://github.com/substack/hyperx
[JSX]: https://facebook.github.io/react/docs/introducing-jsx.html
[Babel]: http://babeljs.io/
[DOM]: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction
[Elm Architecture]: https://guide.elm-lang.org/architecture/
[CDN]: https://cdnjs.com/libraries/hyperapp

HyperApp is a JavaScript library for building frontend applications.

* **Declarative**: HyperApp's design is based on the [Elm Architecture]. Create scalable browser-based applications using a functional paradigm. The twist is you don't have to learn a new language.
* **Stateless components**: Build complex user interfaces from micro-components. Stateless components are framework agnostic, reusable, predictable and easier to debug.
* **Batteries-included**: Out of the box, HyperApp has Elm-like state management, a virtual DOM engine and a router; it still weighs `1kb` and has no dependencies. We're not opinionated about your stack either; use Browserify with [Hyperx]; Webpack or Rollup with Babel/[JSX], etc.

[Get started with HyperApp](https://www.gitbook.com/book/hyperapp/hyperapp).

## Installation
<pre>
npm i -S <a href=https://npmjs.com/package/hyperapp>hyperapp</a>
</pre>

## Usage
In Node.js.
```jsx
import { h, app } from "hyperapp"
```

In the browser via the [CDN].
```jsx
const { h, app } = hyperapp
```

## Examples
<details><summary>Hello World</summary>

```jsx
app({
    model: "Hi.",
    view: model => <h1>{model}</h1>
})
```

[View online](http://codepen.io/jbucaran/pen/Qdwpxy?editors=0010)
</details>

<details><summary>Counter</summary>

```jsx
app({
    model: 0,
    reducers: {
        add: model => model + 1,
        sub: model => model - 1
    },
    view: (model, actions) =>
        <div>
            <button onClick={actions.add}>+</button>
            <h1>{model}</h1>
            <button onClick={actions.sub} disabled={model <= 0}>-</button>
        </div>
})
```

[View online](http://codepen.io/jbucaran/pen/zNxZLP?editors=0010)
</details>

<details><summary>Input</summary>

```jsx
app({
    model: "",
    reducers: {
        text: (_, value) => value
    },
    view: (model, actions) =>
        <div>
            <h1>Hi{model ? " " + model : ""}.</h1>
            <input onInput={e => actions.text(e.target.value)} />
        </div>
})
```

[View online](http://codepen.io/jbucaran/pen/qRMEGX?editors=0010)
</details>

<details><summary>Drag & Drop</summary>

```jsx
const model = {
    dragging: false,
    position: {
        x: 0, y: 0, offsetX: 0, offsetY: 0
    }
}

const view = (model, actions) =>
    <div
        onMouseDown={e => actions.drag({
            position: {
                x: e.pageX, y: e.pageY, offsetX: e.offsetX, offsetY: e.offsetY
            }
        })}
        style={{
            position: "absolute",
            left: model.position.x - model.position.offsetX + "px",
            top: model.position.y - model.position.offsetY + "px",
            backgroundColor: model.dragging ? "gold" : "deepskyblue"
        }}
    >DRAG ME
    </div>

const reducers = {
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

app({ model, view, reducers, subscriptions })
```

[View online](http://codepen.io/jbucaran/pen/apzYvo?editors=0010)
</details>

<details><summary>Todo</summary>

```jsx
const FilterInfo = { All: 0, Todo: 1, Done: 2 }

app({
    model: {
        todos: [],
        filter: FilterInfo.All,
        input: "",
        placeholder: "Add new todo!"
    },
    view: (model, actions) =>
        <div>
            <h1>Todo</h1>
            <p>
                Show: {Object.keys(FilterInfo)
                    .filter(key => FilterInfo[key] !== model.filter)
                    .map(key =>
                        <span><a data-no-routing href="#" onClick={_ => actions.filter({
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
                            onClick={e => actions.toggle({
                                value: t.done,
                                id: t.id
                            })}>{t.value}
                        </li>)}
            </ul></p>

            <p>
                <input
                    type="text"
                    onKeyUp={e => e.keyCode === 13 ? actions.add() : ""}
                    onInput={e => actions.input({ value: e.target.value })}
                    value={model.input}
                    placeholder={model.placeholder}
                />{" "}
                <button onClick={actions.add}>add</button>
            </p>
        </div>,
    reducers: {
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
})
```

[View online](http://codepen.io/jbucaran/pen/zNxRLy?editors=0010)
</details>

[See more examples](https://hyperapp.gomix.me).

## Documentation
* [h(tag, data, children)](#htag-data-children)
* [app(options)](#appoptions)
    * [model](#model)
    * [reducers](#reducers)
    * [view](#view)
        * [Lifecycle Methods](#lifecycle-methods)
    * [effects](#effects)
    * [subscriptions](#subscriptions)
    * [hooks](#hooks)
        * [onAction](#onaction)
        * [onUpdate](#onupdate)
        * [onError](#onerror)
    * [root](#root)
    * [router](#router)
        * [setLocation](#actionssetlocation)
        * [href](#href)

## h(tag, data, children)
Creates a virtual DOM node.

* `tag` is a tag name, e.g. `div` or a function that returns a tree of virtual nodes.
* `data` is an object with attributes, styles, events, properties, [lifecycle methods](#lifecycle-methods), etc.
* `children` is an array of children virtual nodes. (Optional)

<details><summary><i>Example</i></summary>

```jsx
app({
    model: "Hi.",
    view: model => h("h1", {}, model)
})
```

[View online](http://codepen.io/jbucaran/pen/VPqoYR?editors=0010)
</details>

[HyperApp User Guide]: https://hyperapp.gitbooks.io/hyperapp/content/quickstart/setup.html

See the [HyperApp User Guide] for JSX/Hyperx setup instructions.

## app(options)
Starts the application.

<pre>
app({
    <a href="#model">model</a>,
    <a href="#reducers">reducers</a>,
    <a href="#view">view</a>,
    <a href="#effects">effects</a>,
    <a href="#subscriptions">subscriptions</a>,
    <a href="#root">root</a>,
    <a href="#router">router</a>
})
</pre>

### model
The model is a primitive type, array or object that represents the state of your application. HyperApp applications use a single model architecture.

```jsx
const model = {
    count: 0
}
```

### reducers
Reducers are actions that describe how to derive a new model from the current model.

```jsx
const reducers = {
    add: model => model + 1,
    sub: model => model - 1
}
```

A reducer can return a new model or part of a model. If it returns part of a model, that part will be merged with the current model.

A reducer can be triggered inside a [view](#view), [effect](#effects) or [subscription](#subscriptions).

A reducer has the following signature: `(model, data, params)`.

* `model` is the current model.
* `data` os the data sent to the reducer.

When using the [router](#router), reducers receives an additional argument:

<a name="params"></a>

* `params` is an object with the matched route parameters.

### view
A view is a function that returns a virtual element tree. See [`h`](#h).

A view has the following signature: `(model, actions)`.

* `model` is the current model.
* `actions` is an object used to trigger [reducers](#reducers) and [effects](#effects).

To send actions:

```jsx
actions.action(data)
```

* `data` is the data you want to send to `action`.
* `action` is the name of a [reducer](#reducers) or [effect](#effects).

<details>
<summary><i>Example</i></summary>

```jsx
app({
    model: true,
    view: (model, actions) => <button onClick={actions.toggle}>{model+""}</button>,
    reducers: {
        toggle: model => !model
    }
})
```
[View online](http://codepen.io/jbucaran/pen/ZLGGzy?editors=0010)
</details>

### Lifecycle Methods
Lifecycle methods are functions that can be attached to virtual nodes in order to access actual DOM elements when they are created, updated or before they are removed.

* onCreate(e : `HTMLElement`)
* onUpdate(e : `HTMLElement`)
* onRemove(e : `HTMLElement`)

```jsx
app({
    view: _ => <div onCreate={e => console.log(e)}></div>
})
```

<details>
<summary><i>Example</i></summary>

```jsx
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
    view: model =>
        <canvas
            width="600"
            height="300"
            onUpdate={e => repaint(e, model)}
        />,
    reducers: {
        move: model => ({ x: model.x + 1, y: model.y + 1 })
    },
    subscriptions: [
      (_, actions) => setInterval(_ => actions.move(), 10)
    ]
})
```
[View online](http://codepen.io/jbucaran/pen/MJXMQZ?editors=0010)
</details>

### effects
Effects are actions that cause side effects and are often asynchronous, like writing to a database, or sending requests to servers.

Effects have the following signature: `(model, actions, data, error)`.

* `model` is the current model.
* `actions` is an object used to trigger [reducers](#reducers) and [effects](#effects).
* `data` is the data sent to the effect.
* `error` is a function you can call to throw an error.

<details>
<summary><i>Example</i></summary>

```jsx
const wait = time => new Promise(resolve => setTimeout(_ => resolve(), time))

const model = {
    counter: 0,
    waiting: false
}

const view = (model, actions) =>
    <button
        onClick={actions.waitThenAdd}
        disabled={model.waiting}>{model.counter}
    </button>


const reducers = {
    add: model => ({ counter: model.counter + 1 }),
    toggle: model => ({ waiting: !model.waiting})
}

const effects = {
    waitThenAdd: (model, actions) => {
        actions.toggle()
        wait(1000).then(actions.add).then(actions.toggle)
    }
}

app({ model, view, reducers, effects })
```
[View online](http://codepen.io/jbucaran/pen/jyEKmw?editors=0010)
</details>

### subscriptions
Subscriptions are functions scheduled to run only once when the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, open a socket connection, attach mouse or keyboard event listeners, etc.

A subscription has the following signature: `(model, actions, error)`.

<details>
<summary><i>Example</i></summary>

```jsx
app({
    model: { x: 0, y: 0 },
    reducers: {
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

### hooks
Hooks are function handlers that can be used to inspect your application, implement middleware, loggers, etc. There are three: `onUpdate`, `onAction`, and `onError`.

##### onUpdate
Called when the model changes. Signature: `(oldModel, newModel, data)`.

##### onAction
Called when an action (reducer or effect) is triggered. Signature: `(name, data)`.

##### onError
Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature: `(err)`.

<details>
<summary><i>Example</i></summary>

```jsx
app({
    model: true,
    view: (model, actions) =>
        <div>
            <button onClick={actions.doSomething}>Log</button>
            <button onClick={actions.boom}>Error</button>
        </div>,
    reducers: {
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

### root
The root is the container of your application. If none is given, a `div` element is appended to document.body and used as the container.

### router
The router is any function with the following signature: `(render, options)`.

* `render` is a function capable to render a [view](#view).
* `options` is the options object passed to [`app`](#appoptions).

You can define your own router or use the one provided with HyperApp.
```jsx
import { h, app, router } from "hyperapp"
```

To use the router, pass it to `app`.
```jsx
app({
    router,
    view: {
        "/": (model, actions) => {},
        "/about": (model, actions) => {},
        "/:key": (model, actions, params) => {}
    }
})
```

The `view` property is used as a dictionary of routes/views.

The key is the route and the value is the [view](#view) function.

<details>
<summary><i>Example</i></summary>

```jsx
const Anchor = ({ href }) => <h1><a href={"/" + href}>{href}</a></h1>

app({
    view: {
        "/": _ => <Anchor href={Math.floor(Math.random() * 999)}></Anchor>,
        "/:key": (model, actions, { key }) =>
            <div>
                <h1>{key}</h1>
                <a href="/">Back</a>
            </div>
    },
    router
})
```

[View online](https://hyperapp-routing.gomix.me)
</details>

* `/` match the index route or use as a wildcard to select the view when no route matches.

* `/:key` match a route using the regular expression `[A-Za-z0-9]+`. The matched key is passed to the view function via [`params`](#params).

#### actions.setLocation
Call `actions.setLocation(path)` to update the [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location). If the path matches an existing route, the corresponding view will be rendered. Requires the default [Router](#router).

<details>
<summary><i>Example</i></summary>

```jsx
const Page = ({ title, target, onClick }) =>
    <div>
        <h1>{title}</h1>
        <button onClick={onClick}>{target}</button>
    </div>

app({
    view: {
        "/": (model, actions) =>
            <Page
                title="Home"
                target="About"
                onClick={_ => actions.setLocation("/about")}>
            </Page>
        ,
        "/about": (model, actions) =>
            <Page
                title="About"
                target="Home"
                onClick={_ => actions.setLocation("/")}>
            </Page>
    },
    router
})
```

[View online](https://hyperapp-set-location.gomix.me)
</details>

#### href
HyperApp intercepts all `<a href="/path">...</a>` clicks and calls `action.setLocation("/path")`. External links and links that begin with a `#` character are not intercepted.

<details>
<summary><i>Example</i></summary>

```jsx
app({
    view: {
        "/": (model, actions) =>
            <div>
                <h1>Home</h1>
                <a href="/about">About</a>
            </div>
        ,
        "/about": (model, actions) =>
            <div>
                <h1>About</h1>
                <a href="/">Home</a>
            </div>
    },
    router
})
```

[View online](https://hyperapp-href.gomix.me)
</details>

Add a custom `data-no-routing` attribute to anchor elements that should be handled differently.

```html
<a data-no-routing>Not a route</a>
```
