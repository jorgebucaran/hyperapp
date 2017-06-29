# Implementation Notes

HyperApp's design is based on the [Elm Architecture](https://guide.elm-lang.org/architecture/) which enables you to create scalable browser-based applications using a functional paradigm.

The logic of every program using this architecture will break into three parts :

* **Model** - It represents the state of your application
* **Update** - A way to update your state (actions)
* **View** - View your state as HTML

This pattern enforces you to write the code which is declarative and pure (immutable).

## Virtual DOM
HyperApp uses virtual DOM which provides a declarative way of representing the UI of your app. A virtual DOM tree is basically a data structure that consists of nested `vnodes` which describes a DOM tree. Whenever the state of your application changes, a virtual DOM tree is created to update the view. Then it ***diffs*** a `vnode` tree against its previous version and only modifies the DOM where there are changes.

Read more about virtual DOM [here](https://github.com/Matt-Esch/virtual-dom).

## Overview

### Creating a `vnode` tree (hyperscript)

#### `h(tag, properties, children)`

`h()` takes a tag, an optional properties objects and an optional array of children or a single child that is a string. If you pass it an array of children, it will have child nodes.

You can pass deeply nested tags and also components like this

```javascript
const Component = (data, children) => h("div", data, children)

h(Component, { id: "foo" }, [h(Component, { id: "bar" })])
```

it will then create a `vnode` which consists of a `tag`, `props` and `children`.

If you pass a number as a child, `h()` will parse it to string.

### Creating an element

#### `createElementFrom(node, isSVG)`

It takes a `vnode` object and an optional `isSVG` option if the node is `svg`.

It the type of a node is string, it will create a text node. Example -
```javascript
$ createElementFrom('Hello World!')
'Hello World!'
```

If you provide a `vnode` object which includes a `tag` like this
```javascript
vnode = {
  tag: 'div',
  data: { id: 'foo' },
  children: ["Hello World"]
}
```

it would then create an element with that tag. Example -
```javascript
$ createElementFrom(h('div', { id: 'foo', style: { color: 'red'} }, ["bar"] ))
<div id="foo" style="color: red;">bar</div>
```

More Examples -

**Creating a `svg`**

```javascript
$ createElementFrom(h('svg', { width: "100", height: "100" }, h('circle', { cx: '50', cy: '50'})))

<svg width="100" height="100">
 <circle cx="50 cy="50"></circle>
</svg>
```

**Lifecycle hook**

In this example, style of an element is updated after it is created and added to DOM.

```javascript
$ createElementFrom(h('div', { oncreate: (element) => element.style = 'color: blue;' }, ["foo"]))

<div style="color: blue;"></div>
```

Notice how all the data attributes on an element are appended to it after it is created and added to DOM. Let's take a look at it.

### Setting data attributes on an element

Earlier we created an element provided a `vnode` object with children as an array. Now let's take a look at how to set the data attributes on it.

#### `setElementData(element, name, value, oldValue)`

It takes an element, property name, property value and an option previous value of the property.

If the property name is style, it adds all the corresponding style values.

It will set the attributes on an element provided that a value is not a function (lifecycle hook, event handlers). If there is any such value, it will remove that property name from the attribute.

### Updating the element data

#### `updateElementData(element, oldData, data)`

It takes an element, oldData and current data on that element to update a value.

Example -

Let's say we have a DOM tree and we diff against its previous version. If the resultant tag (element type) is same in both the trees, it means the values must have been updated (example - forms with controlled components). So we update the element data using the current value, old value and the element itself.

**Inner working (part of `App.js`)**

```javascript
for (var name in merge(oldData, data)) {
  var value = data[name];
  var oldValue = name === "value" || name === "checked" ? element[name] : oldData[name];

  // Lifecycle hook
  if (name === "onupdate" && value) {
    value(element); // call the hook
  } else if (value !== oldValue) {
    setElementData(element, name, value, oldValue); // There is a new value so update the new data on the element
  }
}
```

We are merging both the data attribute objects (`node.tag === oldNode.tag`) and are comparing the values. If there is any change in values (`value !== oldValue`), we update the new data on the element else if the property is a lifecycle hook, we pass an element and execute it.

### Removing an element from the tree

`removeElement(parent, element, node)`

Removing an element is simple, you pass a parent node, an element and a `vnode`. It then checks if there is a lifecycle hook `onremove` on the `vnode`. If there is a lifecycle hook, it fires it before the element is removed from the DOM.

### App initialisation

#### `init(namespace, children, lastName)`

To initialise the rendering the process of `App`, mixin are composed. Mixin serve as a basis for reusability among your UI logic. Read more [here](https://github.com/hyperapp/hyperapp/blob/master/docs/core.md#mixins) about using mixin in HyperApp.

During initialisation phase, all the actions in `App({})` will be aggregated. Now as an `action` is triggered, an event `action`is fired and it returns some result (new state). Before this state updates, an event `update` is emitted and it merges the result with current state and renders a view.

### Loading the App
#### `load()`

It renders the `App` after the document has finished loading.

### Emit events

#### `emit(name, data)`

It takes an event name to trigger and some data. Read more about types of events [here](https://github.com/hyperapp/hyperapp/blob/master/docs/api.md#events).

### Rendering

#### `render(state, view)`
Updates the DOM by patching it using `patch(parent, element, oldNode, node)`.

### Patching

`patch(parent, element, oldNode, node)` includes the patching algorithm for vtree.

Given a parent (DOM) root node and set of DOM patches, the patch function will update the DOM by applying the patches that we have computed from previous functions. It returns a new DOM root node after applying all the operations on virtual DOM tree.
