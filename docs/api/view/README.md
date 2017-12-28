# View

The view is a function that's being passed to `app(...)` as second parameter. This function accepts `state` and `actions` as parameters. 

- [View](#view)
  - [Type: `(state: Object, actions: Object) => VNode`](#type-state-object-actions-object-vnode)
  - [Creating VNodes](#creating-vnodes)
    - [h function](#h-function)
    - [JSX](#jsx)

## Type: `(state: Object, actions: Object) => VNode`

The view function returns a [VNode](../../concepts/vnodes.md) based on the `state` it gets.

## Creating VNodes

This VNode can be formed in different ways:

- using the `h` function from Hyperapp.
- using JSX which is being compiled down to `h` functions.
- calling a function that returns a VNode: [components](components.md)

> Have a look at [**Components**](components.md), their [**Lifecycle Events**](lifecycle-events.md)

### h function

`h`'s type is: 
```typescript
(tagname: string, attributes: object, children: string | string[] | VNode | VNode[]) => VNode
```
As you can see the `children` parameter can be one of:
- String
- Array of Strings
- VNode (by calling another `h(...)`)
- Array VNodes

An example of the view function: 

```javascript
import {h} from 'hyperapp'

const view = (state, actions) => h("div", { id: "app" }, [
  h("h1", {}, "Hi."),
  state.counter 
    ? h('div', {}, 
        h('button', { onclick: actions.startCounting }, 'Start'),
      )
    : h('div', {}, state.count)
])
```

### JSX

JSX is the syntax where you write html but actually create `h()`-calls. Read more about [VNodes](../../concepts/vnodes.md).

```jsx
// you need to import 'h' even in JSX because it's being 
// compiled into `h(...)` calls
import {h} from 'hyperapp'

const view = (state, actions) => <div>
  <h1>Hi.</h1>
  {state.counter 
    ? <div><button onclick={actions.startCounting}>Start</button></div>
    : <div>{state.count}</div>}
</div>
```

> Keep in mind that when using `tsx` you cannot do casting with `<number> myNumber` but you have to use the [`as`-syntax](http://www.typescriptlang.org/docs/handbook/jsx.html#the-as-operator)