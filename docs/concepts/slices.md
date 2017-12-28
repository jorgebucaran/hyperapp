# Slices

Hyperapp uses a single state tree object that contains all your application level state and serves as the single source of truth. This also means, if you are coming from Redux/Flux, that you have only one store for each app. A single state tree makes it straightforward to locate a specific piece of state, and allows for incredibly easy debugging.

A single state tree is not free from struggle. It can be daunting to update a part of the state deeply nested in the state tree immutably without resorting to functional lenses / setters or advanced martial arts.

State slices address this issue with actions that access a slice of the state tree that corresponds to the namespace where both state and action are declared.

```js
const actions = {
  hello: data => state => {
    // The state is the global `state`.
  },
  foo: {
    bar: {
      howdy: data => state => {
        // The state is: `state[foo][bar]`
      }
    }
  }
}
```

State slices allow you to update deeply nested state easily and immutably.

For example, before when you had something like this:

```js
const state = {
  foo: {
    bar: {
      value: 0,
      anotherValue: 1
    }
  }
}
```

Then when you wanted to update `value`, you had to update an entire record (**including siblings**), since there is no way to single out `value` from a nested state.

In other words, you had to write something like the following in order to update the tree immutably.

```js
const actions = {
  updateValue: data => state => {
    return {
      foo: {
        bar: {
          value: state.foo.bar.value + 1,
          anotherValue: state.foo.bar.anotherValue
        }
      }
    }
  }
}
```

With state slices, it's possible to update `value` more simply. In order to do this, your state must look like this.

```js
const state = {
  foo: {
    bar: {
      value: 0,
      anotherValue: 1
    }
  }
}
```

You will have a corresponding action inside a namespace that matches the state you want to update.

```js
const actions = {
  foo: {
    bar: {
      updateValue: data => state => {
        // State is `state[foo][bar]`
        return { value: state.value + data }
      }
    }
  }
}
```
