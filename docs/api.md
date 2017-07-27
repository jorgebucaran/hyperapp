# Reference
<!-- TOC -->

- [h](#h)
  - [Component](#component)
  - [VirtualNode](#virtualnode)
  - [Attributes](#attributes)
    - [LifecyleEvents](#lifecyleevents)
- [app](#app)
  - [State](#state)
  - [View](#view)
  - [Actions](#actions)
    - [ActionInfo](#actioninfo)
    - [ActionResult](#actionresult)
    - [Thunk](#thunk)
  - [Events](#events)
    - [Default Events](#default-events)
    - [CustomEvent](#customevent)
  - [Mixins](#mixins)
    - [Mixin](#mixin)
  - [Root](#root)
- [Emit](#emit)
- [Update](#update)

<!-- /TOC -->

## h

<pre>
h(
  string | <a href="#component">Component</a>,
  <a href="#attributes">Attributes</a>,
  Array&lt<a href="#virtualnode">VirtualNode</a>&gt | string
): <a href="#virtualnode">VirtualNode</a>
</pre>

### Component

See [Components](/docs/components.md).

<pre>
<i>Component</i>(
  any,
  Array&lt<a href="#virtualnode">VirtualNode</a>&gt | string
): <a href="#virtualnode">VirtualNode</a>
</pre>

### VirtualNode

See [Virtual Nodes](/docs/virtual-nodes.md).

<pre>
{
  tag: string,
  data: <a href="#attributes">Attributes</a>,
  children: Array&lt<a href="#virtualnode">VirtualNode</a>&gt
}
</pre>

### Attributes

<pre>
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes">HTMLAttributes</a> | <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute">SVGAttributes</a> | <a href="https://developer.mozilla.org/en-US/docs/Web/Events">DOMEvents</a> | <a href="#lifecyleevents">LifecyleEvents</a>
</pre>

#### LifecyleEvents

See [Lifecyle Events](/docs/lifecyle-events.md).

<pre>
<a id="oncreate"></a>oncreate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>): void
<a id="onupdate"></a>onupdate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>, <a href="#attributes">Attributes</a>): void
<a id="onremove"></a>onremove(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>): void
</pre>

## app

<pre>
app({
  state: <a href="#state">State</a>,
  view: <a href="#view">View</a>,
  actions: <a href="#actions">Actions</a>,
  events: <a href="#events">Events</a>,
  mixins: <a href="#mixins">Mixins</a>,
  root: <a href="#root">Root</a>
}): <a href="#emit">Emit</a>
</pre>

### State

See [State](/docs/state.md).

<pre>
{
  [key: string]:
    | <a href="#state">PartialState</a>
    | any
}
</pre>

### View

See [View](/docs/view.md).

<pre>
(<a href="#state">State</a>, <a href="#actions">Actions</a>): <a href="#virtualnode">VirtualNode</a>
</pre>

### Actions

See [Actions](/docs/actions.md).

<pre>
{
  [action: string]:
    | <a href="#actions">Actions</a>
    | (<a href="#state">State</a>, <a href="#actions">Actions</a>, any): <a href="#actionresult">ActionResult</a>
}
</pre>

#### ActionInfo

<pre>
{
  name: string,
  data: any
}
</pre>

#### ActionResult

A partial [State](#state) or [Thunk](#thunk).

#### Thunk

See [Thunks](/docs/actions.md#thunks).

<pre>
(<a href="#update">Update</a>): any
</pre>

### Events

See [Events](/docs/events.md).

<pre>
{
  [event: string]:
    | Array&lt<a href="#customevent">CustomEvent</a>&gt
    | <a href="#event">CustomEvent</a>
}
</pre>

#### Default Events

<pre>
<a id="load"></a>load(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#root">Root</a>): <a href="#virtualnode">VirtualNode</a>
<a id="render"></a>render(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#view">View</a>): <a href="#view">View</a>
<a id="action"></a>action(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#actioninfo">ActionInfo</a>): <a href="#actioninfo">ActionInfo</a>
<a id="resolve"></a>resolve(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#actionresult">ActionResult</a>): <a href="#actionresult">ActionResult</a>
<a id="eventsupdate"></a>update(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#state">nextState</a>): <a href="#state">State</a>
</pre>

#### CustomEvent

<pre>
<i>event</i>(<a href="#state">State</a>, <a href="#actions">Actions</a>, any): any
</pre>

### Mixins

See [Mixins](/docs/mixins.md).

<pre>
Array&lt<a href="#mixin">Mixin</a>&gt
</pre>

#### Mixin

<pre>
(<a href="#emit">Emit</a>): {
  state: <a href="#state">State</a>,
  actions: <a href="#actions">Actions</a>,
  events: <a href="#events">Events</a>,
  mixins: <a href="#mixins">Mixins</a>,
}
</pre>

### Root

<pre>
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>
</pre>

See [Root](/docs/root.md).

## Emit

See [Custom Events](/docs/events.md#custom-events).

<pre>
(string, any): any
</pre>

## Update

See [Thunks](/docs/actions.md#thunks).

<pre>
(<a href="#state">PartialState</a>): void
</pre>


