# API Reference

This section contains detailed descriptions for each function, property and event in HyperApp.

<samp>hyperapp</samp> is the entry point to the framework. If you load HyperApp from a <samp>\<script\></samp> tag, the module will be available in the global scope.

<samp>

```js
import a from "ok"
```


</samp>


* [hyperapp.h]()
* [hyperapp.app]()
  * [props.state]()
  * [props.view]()
  * [props.actions]()
  * [props.events]()
    * [events.loaded]()
    * [events.action]()
    * [events.update]()
    * [events.render]()
  * [props.plugins]()
  * [props.root]()
* [emit]()

## <a name="h"></a> h

Type: ([tag](#h-tag), [data](#h-data), [children](#h-children)): [vnode]

[vnode]: /docs/core.md#virtual-nodes

* <a name="h-tag"></a>tag: string | ([props](#h-data), [children](#h-children)): [vnode]
* <a name="h-data"></a>data: {}
* <a name="h-children"></a>children: string | [vnode]\[\]

## <a name="app"></a>app

Type: ([props](#app-props))

* <a name="app-props"></a> props
  * [state](#state)
  * [view](#view)
  * [actions](#actions)
  * [events](#events)
  * [plugins](#plugins)
  * [root](#root)

<a name="app-props"></a>

### <a name="state"></a>state

Type: any

### <a name="view"></a>view

Type: ([state](#state), [actions](#actions)): [vnode]

### <a name="actions"></a>actions
#### <a name="actions-foo"></a>[namespace.]_foo_

Type: ([state](#state), [actions](#actions), [data](#actions-data), [emit](#emit))

* <a name="actions-data"></a> data: any

### <a name="events"></a>events
#### <a name="events-loaded"></a>loaded

Type: ([state](#state), [actions](#actions), _, [emit](#emit)) | [events](#events-loaded)\[\]

Fired after the view is mounted on the DOM.

#### <a name="events-action"></a>action

Type: ([state](#state), [actions](#actions), [data](#events-action-data), [emit](#emit)): [data](#events-action-data) | [action](#events-action)\[\]

* <a name="events-action-data"></a>data
  * name: string
  * data: any

Fired before an action is triggered.

#### <a name="events-update"></a>update

Type: ([state](#state), [actions](#actions), [data](#events-update-data), [emit](#emit)): [data](#events-update-data) | [update](#events-update)\[\]

* <a name="events-update-data"></a>data: the updated fragment of the state.

Fired before the state is updated.

#### <a name="events-render"></a>render

Type: ([state](#state), [actions](#actions), [view](#view), [emit](#emit)): [view](#view) | [render](#events-render)\[\]

Fired before the view is rendered.

### <a name="plugins"></a>plugins

Type: [Plugin](#plugins-plugin)\[\]

#### <a name="plugins-plugin"></a>Plugin

Type: ([props](#app-props)): [props](#plugin-props)

* <a name="plugin-props"></a>props
  * [state](#state)
  * [actions](#actions)
  * [events](#events)

### <a name="root"></a>root

Type: [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) = [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

## <a name="emit"></a>emit

Type: ([event](#emit-event), [data](#emit-data)): [data](#emit-data)

* <a name="emit-event"></a>event: string
* <a name="emit-data"></a>data: any
