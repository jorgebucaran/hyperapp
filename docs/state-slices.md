# State Slices

Hyperapp uses a single state tree — that is, this single object contains all your application level state and serves as the single source of truth. This also means, if you are coming from Redux/Flux, that you have only one store for each app. A single state tree makes it straightforward to locate a specific piece of state, and allows for incredibly easy debugging.

A single state tree is not free from struggle. It can be daunting to update a part of the state deeply nested in the state tree immutably _and_ without resorting to functional lenses / setters or advanced martial arts.

State slices attempt to address this issue by giving you via actions, a slice of the state tree that corresponds to the namespace where both state and action are declared.

```js
actions: {
  hello(state) {
  // The state is the global `state`.
  },
  foo: {
    bar: { 
      howdy(state) {
      // The state is: `state[foo][bar]`
      }
    }
  }
}
```

State slices allow you to update deeply nested state easily and immutably.

For example, before when you had something like this:

```js
state: {
  foo: {
    bar: {
      value: 0,
      anotherValue: 1
    }
  }
}
```

...and wanted to update `value`, you had to update an entire record (**including siblings**), since there is no way to single out `value` from a nested state.

In other words, you had to write something like the following in order to update the tree immutably.

```js
actions: {
  updateValue(state) {
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
state: {
  foo: {
    bar: {
      value: 0,
      anotherValue: 1
    }
  }
}
```

And have a corresponding action inside a namespace that matches the state you want to update.

```js
actions: {
  foo: {
    bar: {
      updateValue(state) {
        // State is `state[foo][bar]`
        return { value: state.value + 1 }
      }
    }
  }
}
```