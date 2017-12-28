This section is meant as a reference of Hyperapp. Therefore this document will start with `app`.

- [App](#app)
  - [Type: Function](#type-function)
  - [Arguments: state, actions, root](#arguments-state-actions-root)
  - [Returns: AppActions](#returns-appactions)
- [Usage](#usage)

# App

## Type: (state, actions, rootElement) => appActions
`app` is a function exported by the `hyperapp` library. 

## Arguments: state, actions, root
 - [state](state.md): an object that represents the initial state of the app
 - [actions](actions.md): an object that contains all actions that can be called in an app
 - [rootElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement): the element where the view will be put into the DOM

## Returns: AppActions
`app` returns an object with references to the `actions` as initially passed to the `app`. These actions can be called the same way they're passed through to the [view](view/README.md)

# Usage

```js
import { app } from 'hyperapp'

// Param initialization omitted for brevity. 
const appActions = app(state, actions, document.body)

// Assuming actions has an `increment` action.
appActions.increment()
```
