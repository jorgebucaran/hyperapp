# flea

Flea is a tiny JavaScript UI library based in [Snabbdom] and ES6 tagged template literals.

[See live examples](https://flea.gomix.me/).

## Install

```
npm i flea
```

## Examples

### [Hello world](http://codepen.io/jbucaran/pen/Qdwpxy?editors=0010)

```js
app({
    model: "Hi.",
    view: model => html`<h1>${model}</h1>`
})
```

### [Counter](http://codepen.io/jbucaran/pen/zNxZLP?editors=0010)

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
            <button onclick=${msg.sub} disabled=${model <= 0}>–</button>
        </div>`
})
```

### [Heading bound to input](http://codepen.io/jbucaran/pen/ggbmdN?editors=0010#)

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

## Usage

CDN

```html
<script src="https://cdn.rawgit.com/fleajs/flea/master/dist/flea.min.js"></script>
<script src="https://cdn.rawgit.com/fleajs/flea/master/dist/html.min.js"></script>
```

Browserify

```
browserify index.js > bundle.js
```

```html
<!doctype html>
<html>
<body>
    <script src="bundle.js"></script>
</body>
</html>
```

## API

## html

Use `html` to compose HTML elements.

```js
const hello = html`<h1>Hello World!</h1>`
```

`html` is a [tagged template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). If you are familiar with React, this is like JSX, but [without breaking JavaScript](https://github.com/substack/hyperx/issues/2).

> Flea's `html` function translates [Hyperx] into a [Snabbdom/h](https://github.com/snabbdom/snabbdom/blob/master/src/h.ts) function call.

## app

Use `app` to create your app. The `app` function receives an object with any of the following properties.

### model

A value or object that represents the state of your app.

You never modify the model directly, instead, send actions describing how the model should change. See [view](#view).

### update

Object composed of functions known as reducers. These are a kind of action you can send.

A reducer describes how the model should change and returns a new model or part of a model.

```js
const update = {
    increment: model + 1,
    decrement: model - 1
}
```

If a reducer returns part of a model, that part will be merged with the current model.

You call reducers inside a [view](#view), [effect](#effect) or [subscription](#subs).

Reducers have a signature `(model, data)`, where

* `model` is the current model, and
* `data` is the data sent along with the action.

### view

The view is a function that returns HTML using the `html` function.

The view has a signature `(model, msg, params)`, where

* `model` is the current model,
* `msg` is the object you use to send actions (call reducers or cause effects) and
* `params` are the route parameters if the view belongs to a [route](#routing).

```js
msg.action(data)
```

#### Routing

Instead of a view as a single function, declare an object with multiple views and use the route path as the key.

```js
app({
    view: {
        "*": (model, msg) => {}
        "/": (model, msg) => {}
        "/:slug": (model, msg, params) => {}
    }
})
```

* `*` default route used when no other route matches, e.g, 404 page, etc.

* `/` index route

* `/:a/:b/:c` matches a route with three components using the regular expression `[A-Za-z0-9]+` and stores each captured group in the params object, which is passed into the view function.

The route path syntax is based in the same syntax found in [Express](https://expressjs.com/en/guide/routing.html).

##### setLocation

To update the address bar relative location and render a different view, use `msg.setLocation(path)`.

##### Anchors

As a bonus, we intercept all `<a href="/path">...</a>` clicks and call `msg.setLocation("/path")` for you. If you want to opt out of this, add the custom attribute `data-no-routing` to any anchor element that should be handled differently.

```html
<a data-no-routing>...</a>
```

### effects

Effects cause side effects and are often asynchronous, like writing to a database, or sending requests to servers. They can dispatch other actions too.

Effects have a signature `(model, msg, error)`, where

* `model` is the current model,
* `msg` is an object you use to call reducers / cause effects (see [view](#view)), and
* `error` is a function you may call with an error if something goes wrong.


```js
const update = {
    add: model => model + 1
}

const effects = {
    waitThenAdd: (_, msg) => setTimeout(msg.add, 1000)
}
```

### subs

Subscriptions are functions that run once when the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, like mouse or keyboard listeners.

While reducers and effects are actions _you_ cause, you can't call subscriptions directly.

A subscription has a signature `(model, msg, error)`.

```js
const update = {
    move: (model, { x, y }) => ({ x, y })
}

const subs = [
    (_, msg) => addEventListener("mousemove", e => msg.move({ x: e.clientX, y: e.clientY }))
]
```

### hooks

Hooks are functions called for certain events during the lifetime of the app. You can use hooks to implement middleware, loggers, etc.

#### onUpdate

Called when the model changes. Signature `(lastModel, newModel, data)`.

#### onAction

Called when an action (reducer or effect) is dispatched. Signature `(name, data)`.

#### onError

Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature `(err)`.

### root

The root is the HTML element that will serve as a container for your app. If none is given, a `div` element is appended to the document.body.


[Snabbdom]: https://github.com/snabbdom/snabbdom
[Hyperx]: https://github.com/substack/hyperx
[Elm Architecture]: https://guide.elm-lang.org/architecture
[yo-yo]: https://github.com/maxogden/yo-yo
[choo]: https://github.com/yoshuawuyts/choo