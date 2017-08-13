# Implementation Notes

## Application Architecture

### Setup

Declare all our variables. Set `appRoot` to document.body if no root is supplied.

Set `element` to the root's first child element. If you are hydrating, this is how we can target server side rendered DOM nodes instead of appending to the container as usual.

Iterate `appMixins` using `props` as the first mixin. Mixins we find we append to `appMixins` changing the length of the list and extending the life of the loop.

Inside the loop we also build the array of event handlers and initialize the state and actions.

### The Initial Render

Before the initial render, fire the [`load`](/docs/events.md#load) event, pass it the `element` and save the result in `oldNode`.

This allows you to iterate the root child nodes inside `load` to return a virtual node we can use to [rehydrate](/docs/hydration.md) statically rendered DOM nodes.

If you don't return anything from `load`, [`emit`](#emit) will return the same data we passed to it so we can invalidate both `oldNode` and `element`. Otherwise, [`patch`](#patch) will overwrite the first child node inside `appRoot`.

Note that calling actions inside `load` will trigger state updates, but will not cause the view to be rendered since we still haven't called `requestRender` at this point.

We can now call [`requestRender`](#requestRender) that will cause the view to render on the next repaint.

Finally, return `emit` to the caller, allowing you to communicate with your application from the outside via [events](/docs/events.md#interoperability).

### `initialize`

Iterate `withActions` and save each wrapped action in `actions`. If `action` is not a function, recurse into the object.

Before calling an action, emit the [`action`](/docs/events.md#action) event with the action information and ignore its return value.

Call the action with the global `appState`, `appActions` and data payload you passed into the unwrapped function. Then fire the [`reduce`](/docs/events.md#reduce) event with the  result allowing you to manipulate it before triggering a state update.

If the result of an action is a function, we call it immediately with [`update`](#update), otherwise run `update` ourselves with the result.

### `render`

Call the [`view`](/docs/view.md) function to produce a new [virtual node](/docs/virtual-node.md) and run [`patch`](#patch) with it and the `oldNode`. Save the new node in `oldNode` and the updated element in `element` for the next time we call patch.

Flush `globalInvokeLaterStack` and call each `oncreate` and `onupdate` lifecycle event handler stored during patch.

### `requestRender`

Request [`render`](#render) to be called on the next repaint using [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

An application may receive a request to render while another render is running or may not even have a view. Skip over those cases.

If `render` is correctly scheduled, toggle our lock `willRender` so that future requests are disregarded until we're done with the current one.

### `update`

Skip over null and undefined states, e.g., when an action returns null or undefined. Then, use oour shallow [`merge`](#merge) on the global state and new state or partial state and use the result to fire the [`update`](/docs/events.md#update) event.

You can validate or modify the state inside `update` to overwrite the global state. If you return `false`, we won't update the state or request a new render.

Return `appState`.

### `emit`

Call each subscribed handler of the specified event with the supplied data. The result of the event handler will be used to overwrite the data, except for null and undefined returns.

After we've called all the subscribers return the new data.

### `merge`

Shallow, non-destructive merge prioritizing on the second argument.

## Virtual DOM

The function of the Virtual DOM is to find the differences between `oldNode` and the new `node` and update the DOM with this information as efficiently as possible.

### `getKey`

Retrieve a key from the supplied node. Keys help `patch` identify which nodes refer to the same element between patches. Keys need not be unique across the entire tree, but only between siblings.

### `setData`

Set or remove an element's property and attribute. Some properties are read-only, so we wrap the property set in a try-block to ignore invalid cases.

### `createElement`

Create a new DOM element with [`createTextNode`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode) for nodes that are a string or [`createElement`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) otherwise. If the element is an SVG element or we are currently patching an SVG element, we'll use [`createElementNS`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS) instead.

Push any `oncreate` handlers to `globalInvokeLaterStack` to call them after patch is done.

### `updateElement`

Iterate the old and new data attributes and properties of the element we are currently patching and determine whether they have changed or not. If they have changed, call [`setData`](#setdata) to update the DOM.

Push any `onupdate` handlers to `globalInvokeLaterStack` to call them after patch is done.

### `removeElement`

If the element has no `onremove` handler, remove the element using [`removeChild`](https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild), otherwise call the event. You are responsible for removing the element inside the event handler.

### `patch`

Patch `element` and its children recursively using the `oldNode` and new `node`.

If `oldNode` is undefined, create a new element using [`createElement`](#createelement) and update the `element`.

If `oldNode` exists and has the same tag name as `node`, update the element data and patch its children. This process consists of 4 steps:

- Create a map with the old keyed nodes.
- Update the element's children.
- Remove any remaining unkeyed old nodes.
- Remove any unused keyed old nodes.

If all the above are false, we know that `oldNode` and `node` are either text nodes or their element types don't match.

Make sure `element` is not undefined and replace it with a new element we obtain using [`createElement`](#createelement).

If the new `node` matches the element's `nodeValue`, that means we are comparing two text nodes that have the same value, so we can skip over.

Return the element.

