# @hyperapp/decoders

## Installation

`npm install @hyperapp/decoders`

## Usage

Import decoders and use it with actions, as you usually do

```javascript
import { app, h } from 'hyperapp'
import { preventDefault } from '@hyperapp/decoders'

const action = (state, event) => {
  // event is prevented
  // event.defaultPrevented => true
  return state
}

app({
  view: state => <input
    onclick={[action, preventDefault()]}
    type='button'
    value='Click!'
  />,
  node: document.body
})

```
Also decoders composition is possible

```jsx
<form onsubmit={[submit, formData(preventDefault())]} />
```

## Decoders list

#### preventDefault

#### stopPropagation

#### formData

## License

[MIT](../../LICENSE.md)
