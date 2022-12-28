# State

**_Definition:_**

> The **state** of your Hyperapp application is the unified set of data that your [views](views.md), [actions](actions.md), and [subscriptions](subscriptions.md) all have access to.

Hyperapp by design offers no strong opinion about how your state should be structured aside from it being unified. This means [components](views.md#components) don't technically possess their own local state but that also means they have direct access to any part of the entire state they need. The user is entrusted with shaping things beyond that.

---

## Assignment

When you initially create your app instance with [`app()`](../api/app.md) you get to setup your state with the [`init:`](../api/app.md#init) property. Since it's possible to have several different app instances [active simultaneously](../api/app.md#multiple-apps) it's important to know that each app retains its own separate state.

### State Transitions

Aside from the aforementioned [`init:`](../api/app.md#init) property the only way to affect state is by changing it through the use of [actions](actions.md).

## State With Effects

If you use an array to set the state Hyperapp will interpret this as a special array where the first entry is the state and if there are more entries they will be [effects](effects.md) that need to be run.

So, Hyperapp will apply the state first and then will run the effects in the order they appear.

```js
[state, log(state), log("MOAR")]
```

### Array State

If you actually do want to use an array as your state you'll have to wrap it within an effectful state array to make it work.

```js
[["a", "b", "c"]]
```

The actions page also [talks about it](actions.md#transitioning-array-state).

---

## Visualization

The primary [view](views.md) of your app, as set by the [`view:`](../api/app.md#view) property of [`app()`](../api/app.md), will receive the current state for it to use to determine what gets rendered. Any changes to the state are automatically reflected there as well.

---

## Other Considerations

### Serializability

While you can put anything you want in the state we recommend avoiding things that are unserializable such as symbols, functions, and recursive references. This helps to ensure compatibility with things like saving to persistent local storage, or using other tools especially ones that are potentially Hyperapp-specific.

### State Type

You can of course choose to make your state some basic type such as a string or number. However, it's recommended to use an object because of the expressivity it gives you in defining your state shape.

### Direct Mutation

Since we are ultimately using JavaScript you can technically edit parts of the state mutably. However, state changes should be thought of in terms of snapshots: New versions of the state get created to reflect the changes made at a certain moment in time. This perspective naturally calls for immutability.

Fresh new state should be returned from an [action](actions.md). If an action returns nothing your app will [stop](actions.md#stopping-your-app). If you mutate the current state and return it you are returning the same object reference as the state was earlier. Hyperapp cannot tell from this that any changes have occurred. Hence the action will do nothing.
