# flea

Flea is a <4kb JavaScript front-end library based in [Snabbdom] and ES6 tagged template literals with [Hyperx].

The API and state management is inspired by the [Elm Architecture] and [choo].

## Install

```
npm i flea
```

## Usage

This is a basic counter app.

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
            <button onclick=${msg.sub} disabled=${model === 0}>–</button>
        </div>`
})
```

[See more examples](https://flea.gomix.me/) and a [fiddle](https://jsfiddle.net/jbucaran/epo7fexz/1/).

## API

### html

You use `html` to compose HTML elements.

```js
const hello = html`<h1>Hello World!</h1>`
```

`html` is a [tagged template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). If you are familiar with React, this is like JSX, but [without breaking JavaScript](https://github.com/substack/hyperx/issues/2).

> Flea's `html` function translates [Hyperx] into a [Snabbdom/h](https://github.com/snabbdom/snabbdom/blob/master/src/h.ts) function call.

### app

The `app` function receives an object with any of the following properties.

#### model

The model is an object with the state of your app. You don't modify the model directly, instead, you call reducers (update functions) that describe how the model will change. This causes the view to be rendered again.

#### update

The update object exposes reducers that describe how the model will change. A reducer returns a new model. If you find you are doing something different here, you probably want an [effect](#effects) instead.

Reducers have a signature `(model, data)`, where `model` is the current model, and `data` is the data the reducer was passed to.

You call reducers inside a view, effect or subscription.

#### view

The view is a function that returns HTML via the `html` function.

The view has a signature `(model, msg)`, where `model` is the current model, and `msg` is a function you use to call reducers / cause effects.

```js
msg.name(data)
```

or if you prefer

```js
msg("name", data)
```

#### effects

Effects are often asynchronous and cause side effects, like writing to a database, or sending requests to servers. When they are done, they often call a reducer.

Effects have a signature `(model, msg, error)`, where `model` is the current model, `msg` is a function you use to call reducers / cause effects (see [view](#view)), and `error` is a function you may call with an error if something goes wrong.

#### subscriptions

Subscriptions are functions that run only once when the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, like mouse or keyboard listeners.

While reducers and effects are actions _you_ cause, you can't call subscriptions directly.

A subscription has a signature `(model, msg, error)`.

#### hooks

Hooks are functions Flea calls when certain events happen across the app. You can use hooks to implement middleware, loggers, etc.

##### onUpdate

Called when the model changes. Signature `(lastModel, newModel, data)`.

##### onAction

Called when an action (reducer or effect) is dispatched. Signature `(name, data)`.

##### onError

Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature `(err)`.

#### root

The root is the HTML element that will serve as a container for your app. If none is given, Flea will create a `div` element in document.body and append your view in it.

## FAQ

### What about choo or yo-yo?

I like both, but I enjoyed yo-yo the best. I even wrote a tiny [module](https://www.npmjs.com/package/yo-yo-app) to help me structure apps with it. I found using only yo-yo too limiting, and choo too frameworky.

In particular, I didn't like some of choo choices like namespaces, including a router, models as containers for state and [morphdom](https://github.com/patrick-steele-idem/morphdom).

See also [virtual dom benchmarks](http://vdom-benchmark.github.io/vdom-benchmark/).


[Snabbdom]: https://github.com/snabbdom/snabbdom
[Hyperx]: https://github.com/substack/hyperx
[Elm Architecture]: https://guide.elm-lang.org/architecture
[choo]: https://github.com/yoshuawuyts/choo