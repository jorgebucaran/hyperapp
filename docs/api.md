# API
<!-- TOC -->

- [h](#h)
  - [VirtualNode](#virtualnode)
  - [Component](#component)
- [app](#app)
  - [State](#state)
  - [View](#view)
  - [Actions](#actions)
    - [ActionResult](#actionresult)
  - [Events](#events)
    - [Default Events](#default-events)
      - [ActionData](#actiondata)
    - [CustomEvent](#customevent)
  - [Mixins](#mixins)
    - [Mixin](#mixin)
- [emit](#emit)

<!-- /TOC -->

## h

<pre>
h(
  string | <a href="#component">Component</a>,
  object,
  Array&lt<a href="#virtualnode">VirtualNode</a>&gt | string
): <a href="#virtualnode">VirtualNode</a>
</pre>

### VirtualNode

See also [Virtual Nodes](/docs/virtual-nodes.md).

<pre>
{
  tag: string,
  data: object,
  children: Array&lt<a href="#VirtualNode">VirtualNode</a>&gt
}
</pre>

### Component

See also [Components](/docs/components.md).

<pre>
<i>Component</i>(
  any,
  Array&lt<a href="#virtualnode">VirtualNode</a>&gt | string
): <a href="#virtualnode">VirtualNode</a>
</pre>

## app

<pre>
app({
  state: <a href="#state">State</a>,
  view: <a href="#view">View</a>,
  actions: <a href="#actions">Actions</a>,
  events: <a href="#events">Events</a>,
  mixins: <a href="#mixins">Mixins</a>,
  root: <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a> = <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/body">document.body</a>
}): <a href="#emit">emit</a>
</pre>

### State

See also [State](/docs/state.md).

<pre>
string | number | boolean | object
</pre>

### View

See also [View](/docs/view.md).

<pre>
(<a href="#state">State</a>, <a href="#actions">Actions</a>): <a href="#virtualnode">VirtualNode</a>
</pre>

### Actions

See also [Actions](/docs/actions.md).

<pre>
{
  [action: string]:
    | <a href="#actions">Actions</a>
    | (<a href="#state">State</a>, <a href="#actions">Actions</a>, any): <a href="#actionresult">ActionResult</a>
}
</pre>

#### ActionResult

A partial state or [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a partial state.

### Events

See also [Events](/docs/events.md).

<pre>
{
  [<i>event</i>: string]: Array&lt<a href="#customevent">CustomEvent</a>&gt | <a href="#event">CustomEvent</a>
}
</pre>

#### Default Events

<pre>
<a id="init"></a>init(<a href="#state">State</a>, <a href="#actions">Actions</a>): void
<a id="loaded"></a>loaded(<a href="#state">State</a>, <a href="#actions">Actions</a>): void
<a id="action"></a>action(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#actiondata">ActionData</a>): <a href="#actiondata">ActionData</a>
<a id="update"></a>update(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#actionresult">ActionResult</a>): <a href="#actionresult">ActionResult</a>
<a id="render"></a>render(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#view">View</a>): <a href="#view">View</a>
</pre>

##### ActionData

<pre>
{
  action: string,
  data: any
}
</pre>

#### CustomEvent

<pre>
<i>event</i>(<a href="#state">State</a>, <a href="#actions">Actions</a>, any): any
</pre>

### Mixins

See also [Mixins](/docs/mixins.md).

<pre>
Array&lt<a href="#mixin">Mixin</a>&gt
</pre>

#### Mixin

Returns an object that will be merged with the application state, actions, events and mixins.

<pre>
(<a href="#emit">emit</a>): {
  state: <a href="#state">State</a>,
  actions: <a href="#actions">Actions</a>,
  events: <a href="#events">Events</a>,
  mixins: <a href="#mixins">Mixins</a>,
}
</pre>

## emit

See also [Custom Events](/docs/events.md#custom-events).

<pre>
emit(string, any): any
</pre>


