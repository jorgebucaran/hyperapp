# API

* [hyperapp.h](#h)
* [hyperapp.app](#app)
  * [props.state](#state)
  * [props.view](#view)
  * [props.actions](#actions)
  * [props.events](#events)
    * [ready](#ready)
    * [action](#action)
    * [update](#update)
    * [render](#render)
  * [props.mixins](#mixins)
  * [props.root](#root)
* [emit](#emit)

## h

[vnode]: /docs/core.md#virtual-nodes

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
#### <a name="actions-foo"></a>[namespace.]_foo_

Type: ([state](#state), [actions](#actions), [data](#actions-data), [emit](#emit))

* <a name="actions-data"></a> data: any

### events
#### ready

Type: ([state](#state), [actions](#actions), _, [emit](#emit)) | Array\<[events](#ready)\>

Fired after the view is mounted on the DOM.

#### action

Type: ([state](#state), [actions](#actions), [data](#action-data), [emit](#emit)): [data](#action-data) | Array\<[action](#action)\>

* <a name="action-data"></a>data
  * name: string
  * data: any

Fired before an action is triggered.

#### update

Type: ([state](#state), [actions](#actions), [data](#update-data), [emit](#emit)): [data](#update-data) | Array\<[update](#update)\>

* <a name="update-data"></a>data: the updated fragment of the state.

Fired before the state is updated.

#### render

Type: ([state](#state), [actions](#actions), [view](#view), [emit](#emit)): [view](#view) | Array\<[render](#render)\>

Fired before the view is rendered.

### mixins

Type: Array\<[Mixin](#mixins-mixin)\>

#### <a name="mixins-mixin"></a>Mixin

Type: ([props](#app-props)): [props](#mixin-props)

* <a name="mixin-props"></a>props
  * [mixins](#mixins)
  * [state](#state)
  * [actions](#actions)
  * [events](#events)

### root

Type: [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) = [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

## emit

Type: ([event](#emit-event), [data](#emit-data)): [data](#emit-data)

* <a name="emit-event"></a>event: string
* <a name="emit-data"></a>data: any
