# API

* [h](#h)
* [app](#app)
  * [state](#state)
  * [view](#view)
  * [actions](#actions)
    * [[namespace.]_foo_](#actions-foo)
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

* <a name="h-tag"></a><samp>tag: string | ([props](#h-data), [children](#h-children)): [vnode]</samp>
* <a name="h-data"></a><samp>data: {}</samp>
* <a name="h-children"></a><samp>children: string | [vnode]\[\]

## <a name="app"></a>app

Type: <samp>([props](#app-props))</samp>

* <a name="app-props"></a> <samp>props</samp>
  * <samp>[state](#state)</samp>
  * <samp>[view](#view)</samp>
  * <samp>[actions](#actions)</samp>
  * <samp>[events](#events)</samp>
  * <samp>[plugins](#plugins)</samp>
  * <samp>[root](#root)</samp>

<a name="app-props"></a>

### <a name="state"></a>state

Type: <samp>any</samp>

### <a name="view"></a>view

Type: <samp>([state](#state), [actions](#actions)): [vnode]</samp>

### <a name="actions"></a>actions
#### <a name="actions-foo"></a>[namespace.]_foo_

Type: <samp>([state](#state), [actions](#actions), [data](#actions-data), [emit](#emit))</samp>

* <a name="actions-data"></a> <samp>data: any</samp>

### <a name="events"></a>events
#### <a name="events-loaded"></a>loaded

Type: <samp>([state](#state), [actions](#actions), _, [emit](#emit)) | [events](#events-loaded)\[\]</samp>

Fired after the view is mounted on the DOM.

#### <a name="events-action"></a>action

Type: <samp>([state](#state), [actions](#actions), [data](#events-action-data), [emit](#emit)): [data](#events-action-data) | [action](#events-action)\[\]</samp>

* <a name="events-action-data"></a><samp>data</samp>
  * <samp>name: string</samp>
  * <samp>data: any</samp>

Fired before an action is triggered.

#### <a name="events-update"></a>update

Type: <samp>([state](#state), [actions](#actions), [data](#events-update-data), [emit](#emit)): [data](#events-update-data) | [update](#events-update)\[\]</samp>

* <a name="events-update-data"></a><samp>data</samp>: the updated fragment of the state.

Fired before the state is updated.

#### <a name="events-render"></a>render

Type: <samp>([state](#state), [actions](#actions), [view](#view), [emit](#emit)): [view](#view) | [render](#events-render)\[\]</samp>

Fired before the view is rendered.

### <a name="plugins"></a>plugins

Type: <samp>[Plugin](#plugins-plugin)\[\]</samp>

#### <a name="plugins-plugin"></a>Plugin

Type: <samp>([props](#app-props)): [props](#plugin-props)</samp>

* <a name="plugin-props"></a>props
  * <samp>[state](#state)</samp>
  * <samp>[actions](#actions)</samp>
  * <samp>[events](#events)</samp>

### <a name="root"></a>root

Type: <samp>[Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) = [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)</samp>

## <a name="emit"></a>emit

Type: <samp>([event](#emit-event), [data](#emit-data)): [data](#emit-data)</samp>

* <a name="emit-event"></a><samp>event: string</samp>
* <a name="emit-data"></a><samp>data: any</samp>
