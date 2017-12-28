# Actions

Actions are _the_ way to change the state. Actions have this signature: `payload => state => actions => newState`. Actions are passed to the `app` as the second parameter ([app](tbd)).

## Usage

Actions can return a state or a function. When returning an `object` it'll be merged with the state. Otherwise it'll be called and passed the `state` or `actions` respectively to the 1st or 2nd function returning theat function.

- `() => newState`
- `payload => newState`
- `payload => state => newState`
- `payload => state => actions => newState`

### Example

Here are 4 examples of the forementioned signatures:

```js
const actions = {
  setLoadingTrue: () => ({ loading: true }),
  setLoading: ({ loading }) => ({ loading }),
  switchLoading: () => state => ({ loading: !state.loading }),
  setLoadingAfter1second: () => state => actions => {
    setTimeout(() => actions.setLoading(true), 1000);
  }
}
```

## Substate

The `state` parameter that's passed to an `action` can also be a `substate`. A `substate` is a part of the state defined by the `path` on which the action is defined on the actions object. This allows us to have actions and components being reused in different places.

### Example 
In the following example you see that the `inputActions` can be 'reused' across parts of the actions tree because it get's the part that is relevant for that particular `substate`.

The `view`-property on the state is not touched because the result of `inputActions.setValue` which is 'mounted' on `actions.loginForm.username` and `actions.loginForm.password` is being merged with the path `state.loginForm.username` and respectively `state.loginForm.password`.

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
  setValue: payload => subState => actions => ({ value: payload.value })
}

const actions = {
  loginForm: {
    username: inputActions,
    password: inputActions
  }
}
```
