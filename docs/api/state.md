# State

State is both a parameter that is passed to [app](README.md) but also a concept. 

> The first parameter of `app(...)` called `state` is essentially the initial state of the application. This could also be achieved by calling an init function from the appActions that `app(...)` returns:

```js
const actions = { init: () => ({ counter: 0 }) }
const appActions = app({}, actions, document.body)
appActions.init() // this will initialize the state to `counter: 0`
```

- [State](#state)
- [Concept of state](#concept-of-state)


# Concept of state

The `state` in Hyperapp forms the central part of the application. Each time the state is being changed by an [action](actions.md) the [view](view/README.md) is re-rendered based on the `state`.

The `state` is also passed to each [action](actions.md) whenever they're called. This `state` is potentially a part of the `state` called: [substate](actions.md#substate-example).