# flea

Flea is a tiny JavaScript UI library based in [Snabbdom] and ES6 tagged template literals with [Hyperx].

The API and state management is inspired by the [Elm Architecture], [yo-yo] and [choo].

## Install

```
npm i flea
```

## Example

A basic counter app. See [fiddle](https://jsfiddle.net/jbucaran/epo7fexz/10/).

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

[See more examples](https://flea.gomix.me/).

## API

### html

Use `html` to compose HTML elements.

```js
const hello = html`<h1>Hello World!</h1>`
```

`html` is a [tagged template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). If you are familiar with React, this is like JSX, but [without breaking JavaScript](https://github.com/substack/hyperx/issues/2).

> Flea's `html` function translates [Hyperx] into a [Snabbdom/h](https://github.com/snabbdom/snabbdom/blob/master/src/h.ts) function call.

### app

The `app` function takes an object with any of the following properties.

#### model

An value or object that represents the state of your app. You don't modify the model directly, instead, dispatch actions that describe how the model will change. See [view](#view).

#### update

The update object exposes reducer functions. A reducer describes how the model will change for a given action and can return a new model or part of a model. If a reducer returns part of a model, it will be merged back into the current model.

Reducers have a signature `(model, data)`, where `model` is the current model, and `data` is any data passed into the function.

You call reducers inside a view, effect or subscription.

#### view

The view is a function that returns HTML via the `html` function.

The view has a signature `(model, msg, params)`, where `model` is the current model, and `msg` is an object you use to call reducers / cause effects.

```js
msg.name(data)
```

or if you prefer

```js
msg("name", data)
```

##### routing

...

#### effects

Effects are often asynchronous and cause side effects, like writing to a database, or sending requests to servers. When they are done, they often dispatch an action.

Effects have a signature `(model, msg, error)`, where `model` is the current model, `msg` is an object you use to call reducers / cause effects (see [view](#view)), and `error` is a function you may call with an error if something goes wrong.

#### subs

Subscriptions are functions that run only once when the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, like mouse or keyboard listeners.

While reducers and effects are actions _you_ cause, you can't call subscriptions directly.

A subscription has a signature `(model, msg, error)`.

#### hooks

Hooks are functions called when certain events happen across the app. You can use hooks to implement middleware, loggers, etc.

##### onUpdate

Called when the model changes. Signature `(lastModel, newModel, data)`.

##### onAction

Called when an action (reducer or effect) is dispatched. Signature `(name, data)`.

##### onError

Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature `(err)`.

#### root

The root is the HTML element that will serve as a container for your app. If none is given, a `div` element is appended to the document.body.

## FAQ

### What about choo or yo-yo?

I like both :heart:. I wrote a tiny [module](https://www.npmjs.com/package/yo-yo-app) to help me structure apps with yo-yo too, but I found using only yo-yo not quite enough, and choo a bit too frameworky.

I also didn't like some of choo choices like namespaces, plugins, [morphdom](https://github.com/patrick-steele-idem/morphdom) and models as containers for state. Everything else is gold!


[Snabbdom]: https://github.com/snabbdom/snabbdom
[Hyperx]: https://github.com/substack/hyperx
[Elm Architecture]: https://guide.elm-lang.org/architecture
[yo-yo]: https://github.com/maxogden/yo-yo
[choo]: https://github.com/yoshuawuyts/choo