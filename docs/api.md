# API

* [hyperapp.h](#h)
* [hyperapp.app](#app)
  * [state](#state)
  * [view](#view)
  * [actions](#actions)
  * [events](#events)
    * [init](#init)
    * [loaded](#loaded)
    * [action](#action)
    * [update](#update)
    * [render](#render)
  * [mixins](#mixins)
  * [root](#root)
* [emit](#emit)

## h

[vnode]: /docs/virtual-nodes.md

Type: ([tag](#h-tag), [data](#h-data), [children](#h-children)): [vnode]

* <a name="h-tag"></a>tag: string | ([props](#h-data), [children](#h-children)): [vnode]
* <a name="h-data"></a>data: {}
* <a name="h-children"></a>children: string | Array\<[vnode]\>

## app

Type: ([props](#app-props)): [emit](#emit)

* <a name="app-props"></a> props
  * [state](#state)
  * [view](#view)
  * [actions](#actions)
  * [events](#events)
  * [mixins](#mixins)
  * [root](#root)

### state

Type: any

### view

Type: ([state](#state), [actions](#actions)): [vnode]

### actions
#### [namespace.]_foo_

Type: ([state](#state), [actions](#actions), [data](#actions-data))

* <a name="actions-data"></a> data: any

### events
#### init

([state](#state), [actions](#actions))

The init event is fired before the first render occurs. This is a good place to initialize your application, create a network request, access the local [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage), etc.

#### loaded

Type: ([state](#state), [actions](#actions))

The loaded event is fired immediately after the [view](#view) is rendered and attached to the DOM.

#### action

Type: ([state](#state), [actions](#actions), [data](#action-data)): [data](#action-data)

* <a name="action-data"></a>data
  * name: the name of the action
  * data: the data passed to the action

The action event is fired before an action is called.

#### update

Type: ([state](#state), [actions](#actions), [data](#update-data)): [data](#update-data)

* <a name="update-data"></a>data: the data used to update the global state.

The update event is fired before the state is updated.

#### render

Type: ([state](#state), [actions](#actions), [view](#view)): [view](#view)

The render event is fired immediately before the view is rendered. This event can be used to implement a page router. Return the view you want to render.

### mixins

Type: Array\<[Mixin](#mixin)\>

#### mixin

Type: ([emit](#emit)): [props](#mixin-props)

* <a name="mixin-props"></a>props: the object used to extend your application [props](#app-props).
  * [state](#state)
  * [actions](#actions)
  * [events](#events)
  * [mixins](#mixins)

### root

Type: [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) = [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

## emit

Type: ([event](#emit-event), [data](#emit-data)): [data](#emit-data)

* <a name="emit-event"></a>event: string
* <a name="emit-data"></a>data: any

Returns the given data reduced by successively calling each event handler of the specified event.




