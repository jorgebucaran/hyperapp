# API

* [h](#h)
* [app](#app)
  * [state](#state)
  * [view](#view)
  * [actions](#actions)
    * [[_namespace._]action](#actions-action)
  * [events](#events)
    * [loaded](#events-loaded)
    * [action](#events-action)
    * [update](#events-update)
    * [render](#events-render)
  * [plugins](#plugins)
    * [Plugin](#plugins-plugin)
  * [root](#root)
* [emit](#emit)

## <a name="h"></a> h

Type: <samp>([tag](#h-tag), [data](#h-data), [children](#h-children)): [vnode]</samp>

[vnode]: /docs/virtual-nodes.md

* <a name="h-tag"></a>tag: <samp>string | ([props](#h-data), [children](#h-children)): [vnode]</samp>
* <a name="h-data"></a>data: [attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [styles](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference), [events](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers), [lifecycle events](/docs/lifecycle-events.md), etc.
* <a name="h-children"></a>children: <samp>string | Array\<[vnode]\>

## <a name="app"></a>app

Type: <samp>([props](#app-props))</samp>

* <a name="app-props"></a> props
  * [state](#state)
  * [view](#view)
  * [actions](#actions)
  * [events](#events)
  * [plugins](#plugins)
  * [root](#root)

<a name="app-props"></a>

### <a name="state"></a>state

Type: <samp>any</samp>

### <a name="view"></a>view

Type: <samp>([state](#state), [actions](#actions)): [vnode]</samp>

### <a name="actions"></a>actions
#### <a name="actions-action"></a>[_namespace._]action

Type: <samp>([state](#state), [actions](#actions), [data](#actions-data), [emit](#emit))</samp>

* <a name="actions-data"></a> data: <samp>any</samp>

### <a name="events"></a>events
#### <a name="events-loaded"></a>loaded

Type: <samp>([state](#state), [actions](#actions), _, [emit](#emit)) | Array\<[Type](#events-loaded)\></samp>

Fired after the view is mounted on the DOM.

#### <a name="events-action"></a>action

Type: <samp>([state](#state), [actions](#actions), [data](#events-action-data), [emit](#emit)): [data](#events-action-data) | Array\<[Type](#events-action)\></samp>

* <a name="events-action-data"></a>data
  * name: <samp>string</samp>
  * data: <samp>any</samp>

Fired before an action is triggered.

#### <a name="events-update"></a>update

Type: <samp>([state](#state), [actions](#actions), [data](#events-update-data), [emit](#emit)): [data](#events-update-data) | Array\<[Type](#events-update)\></samp>

* <a name="events-update-data"></a>data: the updated fragment of the state.

Fired before the state is updated.

#### <a name="events-render"></a>render

Type: <samp>([state](#state), [actions](#actions), [data](#events-render-data), [emit](#emit)): [data](#events-render-data) | Array\<[Type](#events-render)\></samp>

* <a name="events-render-data"></a>data: the [view](#view).

Fired before the view is rendered.

### <a name="plugins"></a>plugins

Type: <samp>Array\<[Plugin](#plugins-plugin)\></samp>

#### <a name="plugins-plugin"></a>Plugin

Type: <samp>([props](#app-props)): [props](#plugin-props)</samp>

* <a name="plugin-props"></a>props
  * [state](#state)
  * [actions](#actions)
  * [events](#events)

### <a name="root"></a>root

Type: <samp>[Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) = [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)</samp>

## <a name="emit"></a>emit

Type: <samp>([event](#emit-event), [data](#emit-data)): [data](#emit-data)</samp>

* <a name="emit-event"></a>event: <samp>string</samp>
* <a name="emit-data"></a>data: <samp>any</samp>
