# State

Use the [state](/docs/api.md#state) to model your application's data.

```jsx
app({
  state: {
    name: "Optimus",
    age: 5000000
  },
  view: state =>
    <main>
      <div>Name: {state.name}</div>
      <div>Age: {state.age}</div>
    </main>
})
```

The state property is usually an object, but it can also be a string, number or a boolean.

```jsx
app({
  state: "Bang!",
  view: state => <h1>{state}</h1>
})
```
