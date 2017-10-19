# Modules

Modules allow you encapsulate your application behavior into reusable parts, to share or just to organize your code. Modules are scoped to a state / action slice and there is no way to use a module without supplying the slice key.

```js
const foo = {
  state: { value: 1 }
}

app({
  init(state) {
    console.log(state) // => { foo: { value: 1 } }
  },
  modules: { foo }
})
```

Modules make it easy to share and modularize your app, but without losing transparency or any of the benefits of single state tree architecture.

As you would expect, modules are allowed to have modules too.

```jsx
const bar  = {
  state: { value: 1 }
}

const foo = {
  modules: { bar }
}

app({
  init(state) {
    console.log(state) // => { foo: { bar: { value: 1 } } }
  },
  modules: { foo }
})
```

Inside your module's actions, you can only call actions your actions or those exposed in modules under you. This is similar to how a parent component can pass props down to a child component or how a top level action can access the entire state.