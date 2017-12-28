# Actions

Actions are _the_ way to change the state. Actions have this signature: `payload => (state, actions) => newState`. Actions are passed to the `app` as the second parameter ([app](tbd)).

- [Actions](#actions)
  - [Usage](#usage)
    - [Actions Example](#actions-example)
  - [Substate](#substate)
    - [Substate Example](#substate-example)

## Usage

Actions get the payload passed as parameter of the first function. This can return an `object` (the new state) or a function. When returning an `object` it'll be (shallow) merged with the state. Otherwise it'll be called and passed the `state` and `actions` which in turn returns a new state object that will be (shallow) merged.

- `() => newState`
- `payload => newState`
- `payload => (state, actions) => newState`

### Actions Example

Here are a few examples of the aforementioned signatures:

```js
const actions = {
  setLoadingTrue: () => ({ loading: true }),
  setLoading: (loading) => ({ loading }),
  switchLoading: () => (state) => ({ loading: !state.loading }),
  setLoadingAfter1second: () => (_, actions) => {
    setTimeout(() => actions.setLoading(true), 1000);
  },
  setLoadingWithPromise: () => (_, actions) => {
    actions.setLoading(true);
    return fetch('http://xyz.abc/resource').then(() => actions.setLoading(false));
  }
}
```

## Substate

The `state` parameter that's passed to an `action` can also be a `substate`. A `substate` is a part of the state defined by the `path` on which the action is defined on the actions object. This allows us to have actions and components being reused in different places.

### Substate Example 
In the following example you see that the `inputActions` can be 'reused' across parts of the actions tree because it get's the part that is relevant for that particular `substate`.

The property `state.view` is not touched because the result of `inputActions.setValue` which is 'mounted' on `actions.loginForm.username` and `actions.loginForm.password` is being (shallow) merged with the paths `state.loginForm.username` and respectively `state.loginForm.password`.

```js
const state = {
  loginForm: {
    username: {
      value: ''
    }, 
    password: {
      value: ''
    }
  },
  view: 'login'
}

const inputActions = {
  setValue: payload => (subState, actions) => ({ value: payload.value })
}

const actions = {
  loginForm: {
    username: inputActions,
    password: inputActions
  }
}
```
