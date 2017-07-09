# Dev Environment

## redux-devtools

[hyperapp-redux-devtools](https://github.com/andyrj/hyperapp-redux-devtools)

First install the redux-devtools browser extension for your browser of choice [firefox](https://addons.mozilla.org/en-US/firefox/addon/remotedev/) or [chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

```
$ npm install hyperapp-redux-devtools
```

Then within your application you can apply the redux-devtools mixin to take advantage of time-travel debugging.

```js
/* src/index.js */
import { h, app } from 'hyperapp'
import devtools from 'hyperapp-redux-devtools'

app({
  state: { count: 0 },
  view: (state, actions) => {
    return (<div>
      {state.count}
      <br />
      <button onclick={actions.inc}>+</button>
      <button onclick={actions.dec}>-</button>
    </div>)
  },
  actions: {
    inc: () => ({ count: state.count + 1 }),
    dec: () => ({ count: state.count - 1 })
  },
  mixins: [devtools()]
})
```

[![redux-devtools demo video](https://img.youtube.com/vi/EE5lV-1kFNM/0.jpg)](https://www.youtube.com/watch?v=EE5lV-1kFNM)