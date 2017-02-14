# [hyperapp](https://hyperapp.gomix.me/)
[![cdnjs](https://img.shields.io/cdnjs/v/hyperapp.svg)](https://cdnjs.com/libraries/hyperapp)
[![version](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![travis](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com)

[Browserify]: https://github.com/substack/node-browserify
[Webpack]: https://github.com/webpack/webpack
[Rollup]: https://github.com/rollup/rollup
[hyperx]: https://github.com/substack/hyperx
[jsx]: https://facebook.github.io/react/docs/introducing-jsx.html

HyperApp is a `1kb` JavaScript library for building modern UI applications.

## Install
<pre>
npm i <a href=https://npmjs.com/package/hyperapp>hyperapp</a>
</pre>

## Usage
ES6
```jsx
import { h, app } from "hyperapp"
```

CommonJS
```jsx
const { h, app } = require("hyperapp")
```

For a complete introduction to HyperApp see the [User Guide](https://www.gitbook.com/book/hyperapp/hyperapp).

## Examples
<details>
<summary>Hello World</summary>

```jsx
app({
    model: "Hi.",
    view: model => <h1>{model}</h1>
})
```

[View online](http://codepen.io/jbucaran/pen/ggjBPE?editors=0010)
</details>

<details>
<summary>Counter</summary>

```jsx
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

```jsx
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

[View online](http://codepen.io/jbucaran/pen/qRMEGX?editors=0010)
</details>

<details>
<summary>Drag & Drop</summary>

```jsx
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
            left: model.position.x - model.position.offsetX + "px",
            top: model.position.y - model.position.offsetY + "px",
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
                        <span><a data-no-routing href="#" onclick={_ => actions.filter({
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
                />{" "}
                <button onclick={actions.add}>add</button>
            </p>
        </div>,
    update: {
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

[See more examples](https://hyperapp.gomix.me/)

## Documentation
* [h](#h)
* [jsx](#jsx)
* [hyperx](#hyperx)
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
    * [Router](#router)
        * [setLocation](#actionssetlocation)
        * [href](#href)

## h
`h` is a virtual node factory function.

```jsx
app({
    view: _ => h("a", { href: "#" }, "Hi")
})
```

[View online](http://codepen.io/jbucaran/pen/vgvoKq?editors=0010)

Virtual nodes are JavaScript objects that represent [DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Element).

A virtual node has the following properties:

| Property   | Type               | Description
|:----------:|:------------------:|----------------------
| tag        | String or Function  | The tag name, e.g. `div`. A function that returns a tree of virtual nodes is known as a child component.|
| data       | Object | An object of DOM attributes, events, properties and lifecycle methods.
| children   | ...Any?    | An array of children virtual nodes. If a node is a JavaScript [primitive value], it will be rendered as a [text node].

[primitive value]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values
[text node]: https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode

## jsx
[jsx] enables you to mix HTML and JavaScript.
```jsx
const link = <a href="#">Hi</a>
```

is equivalent to:
```jsx
 const link = h("a", { href: "#" }, ["Hi"])
```

To use jsx with HyperApp follow the steps for your chosen module bundler.

<details>
<summary><a href="https://github.com/substack/node-browserify">Browserify</a></summary>

Create a `.babelrc` file:
```js
{
    "presets": ["es2015"],
    "plugins": [
        [
            "transform-react-jsx",
            {
                "pragma": "h"
            }
        ]
    ]
}
```

Install development dependencies:
<pre>
npm i -S \
    <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a> \
    <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a> \
    <a href="https://www.npmjs.com/package/babelify">babelify</a> \
    <a href="https://www.npmjs.com/package/browserify">browserify</a> \
    <a href="https://www.npmjs.com/package/bundle-collapser">bundle-collapser</a> \
    <a href="https://www.npmjs.com/package/uglifyify">uglifyify</a> \
    <a href="https://www.npmjs.com/package/uglifyjs">uglifyjs</a>
</pre>

Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/browserify \
    -t babelify \
    -g uglifyify \
    -p bundle-collapser/plugin index.js | uglifyjs > bundle.js
</pre>

[See boilerplate](https://gist.github.com/jbucaran/21bbf0bbb0fe97345505664883100706)
</details>


<details>
<summary><a href="https://github.com/rollup/rollup">Rollup</a></summary>

Create a `.babelrc` file:
```js
{
    "presets": ["es2015-rollup"],
    "plugins": [
        [
            "transform-react-jsx",
            {
                "pragma": "h"
            }
        ]
    ]
}
```

Create a `rollup.config.js` file:
```jsx
import babel from "rollup-plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import uglify from "rollup-plugin-uglify"

export default {
    plugins: [
        babel(),
        resolve({
            jsnext: true
        }),
        uglify()
    ]
}
```

Install development dependencies:
<pre>
npm i -S \
    <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a> \
    <a href="https://www.npmjs.com/package/babel-preset-es2015-rollup">babel-preset-es2015-rollup</a> \
    <a href="https://www.npmjs.com/package/rollup">rollup</a> \
    <a href="https://www.npmjs.com/package/rollup-plugin-babel">rollup-plugin-babel</a> \
    <a href="https://www.npmjs.com/package/rollup-plugin-node-resolve">rollup-plugin-node-resolve</a>
    <a href="https://www.npmjs.com/package/rollup-plugin-uglify">rollup-plugin-uglify</a>
</pre>

Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/rollup -cf iife -i index.js -o bundle.js
</pre>

[See boilerplate](https://gist.github.com/jbucaran/0c0da8f1256a0a66090151cfda777c2c)
</details>


<details>
<summary><a href="https://github.com/webpack/webpack">Webpack</a></summary>

Create a `.babelrc` file:
```js
{
    "presets": ["es2015"],
    "plugins": [
        [
            "transform-react-jsx",
            {
                "pragma": "h"
            }
        ]
    ]
}
```

Create a `webpack.config.js` file:
```js
module.exports = {
    entry: "./index.js",
    output: {
        filename: "bundle.js",
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }]
    }
}
```

Install development dependencies:
<pre>
npm i -S \
    <a href="https://www.npmjs.com/package/webpack">webpack</a> \
    <a href="https://www.npmjs.com/package/babel-core">babel-core</a> \
    <a href="https://www.npmjs.com/package/babel-loader">babel-loader</a> \
    <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a> \
    <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a>
</pre>

Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/webpack -p
</pre>

[See boilerplate](https://gist.github.com/jbucaran/6010a83891043a6e0c37a3cec684c08e)
</details>

## hyperx
hyperx is a [template function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) factory, or ES6 alternative to [jsx].

```jsx
const { h, app } = require("hyperapp")
const hyperx = require("hyperx")
const html = hyperx(h)

app({
    model: "Hi.",
    view: model => html`<h1>${model}</h1>`
})
```
[View online](https://gomix.com/#!/project/hyperapp-hyperx-example)

<details>
<summary>Setup Instructions</summary>

Install hyperx dependency:
<pre>
npm i -D <a href=https://npmjs.com/package/hyperx>hyperx</a>
</pre>

Install development dependencies:
<pre>
npm i -S \
    <a href="https://www.npmjs.com/package/browserify">browserify</a> \
    <a href="https://www.npmjs.com/package/hyperxify">hyperxify</a> \
    <a href="https://www.npmjs.com/package/babelify">babelify</a> \
    <a href="https://www.npmjs.com/package/uglifyify">uglifyify</a> \
    <a href="https://www.npmjs.com/package/bundle-collapser">bundle-collapser</a>
    <a href="https://www.npmjs.com/package/uglify-js">uglifyjs</a>
</pre>


Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/<a href="https://www.npmjs.com/package/browserify">browserify</a> \
    -t <a href="https://www.npmjs.com/package/hyperxify">hyperxify</a> \
    -t <a href="https://www.npmjs.com/package/babelify">babelify</a> \
    -g <a href="https://www.npmjs.com/package/uglifyify">uglifyify</a> \
    -p <a href="https://www.npmjs.com/package/bundle-collapser">bundle-collapser/plugin</a> index.js | <a href="https://www.npmjs.com/package/uglify-js">uglifyjs</a> > bundle.js
</pre>

[See boilerplate](https://gist.github.com/jbucaran/48c1edb4fb0ea1aa5415b6686cc7fb45)
</details>

## app
Use `app` to start your app.

<pre>
app({
    <a href="#model">model</a>,
    <a href="#update">update</a>,
    <a href="#view">view</a>,
    <a href="#effects">effects</a>,
    <a href="#subscriptions">subscriptions</a>,
    <a href="#root">root</a>,
    <a href="#router">router</a>
})
</pre>

### model
A primitive type, array or object that represents the state of your application. HyperApp applications use a single model architecture.

### update
An object composed of functions often called _reducers_. A reducer describes how to derive the next model from the current model.

```jsx
const update = {
    increment: model => model + 1,
    decrement: model => model - 1
}
```

Reducers can return an entirely new model or part of a model. If a reducer returns part of a model, it will be merged with the current model.

Reducers can be triggered inside a [view](#view), [effect](#effects) or [subscription](#subscriptions).

Reducers have the signature `(model, data, params)`:

* `model` is the current model.
* `data` is the data sent to the reducer.

When using the [Router](#router), the view receives an additional argument:

<a name="params"></a>

* `params` an object with the matched route parameters.

### view
A function that returns an HTML element using [jsx](#jsx) or the [`html`](#html) function.

A view has the signature `(model, actions)`:

* `model` is the current model.
* `actions` is an object used to trigger [reducers](update) and [effects](effects).

To use actions:

```jsx
actions.action(data)
```

* `data` is any data you want to send to `action`.
* `action` is the name of the reducer or effect.

<details>
<summary><i>Example</i></summary>

```jsx
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

```jsx
app({
    view: _ => <div oncreate={e => console.log(e)}>Hi.</div>
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

### effects
Actions that cause side effects and can be asynchronous, like writing to a database, or sending requests to servers.

Effects have the following signature: `(model, actions, data, error)`.

* `model` is the current model.
* `actions` is an object used to trigger [reducers](update) and [effects](effects).
* `data` is the data sent to the effect.
* `error` is a function you may call to throw an error.

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

### subscriptions
Functions scheduled to run only once when the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, open a socket connection, attached mouse or keyboard event listeners, etc.

A subscription has the signature `(model, actions, error)`.

<details>
<summary><i>Example</i></summary>

```jsx
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


### hooks
Function handlers that can be used to inspect your application, implement middleware, loggers, etc. There are three: `onUpdate`, `onAction`, and `onError`.

#### onUpdate
Called when the model changes. Signature: `(lastModel, newModel, data)`.

#### onAction
Called when an action (reducer or effect) is triggered. Signature: `(name, data)`.

#### onError
Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature: `(err)`.

<details>
<summary><i>Example</i></summary>

```jsx
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

### root
The HTML element container of your application. If none is given, a `div` element is appended to document.body and used as the container.

### router
HyperApp provides a router out of the box.

```jsx
import { h, app, router } from "hyperapp"

app({ view, router })
```

When using the router, `view` must be an object that consists of routes, each with a corresponding view function.

```jsx
view: {
    "/": (model, actions) => {},
    "/about": (model, actions) => {},
    "/:key": (model, actions, params) => {}
}
```

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

[View online](https://hyperapp-routing.gomix.me/)
</details>

* `/` matches the index route or when no other route matches.

* `/:key` matches a route using the regular expression `[A-Za-z0-9]+`. The matched key is passed to the route's view function via [`params`](#params).

### actions.setLocation
A special action available when using the [Router](#router). Use `actions.setLocation(path)` to update the [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location). If the path matches an existing route, the corresponding view will be rendered.

<details>
<summary><i>Example</i></summary>

```jsx
const Page = ({ title, target, onclick }) =>
    <div>
        <h1>{title}</h1>
        <button onclick={onclick}>{target}</button>
    </div>

app({
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
    },
    router
})
```

[View online](https://hyperapp-set-location.gomix.me/)
</details>


#### href
HyperApp intercepts all `<a href="/path">...</a>` clicks and calls `action.setLocation("/path")` for convenience. External links and links that begin with a `#` character are not intercepted.

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

[View online](https://hyperapp-href.gomix.me/)
</details>

Add a custom `data-no-routing` attribute to anchor elements that should be handled differently.

```html
<a data-no-routing>Not a route</a>
```
