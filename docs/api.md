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
    - [Event](#event)
    - [init](#init)
    - [loaded](#loaded)
    - [action](#action)
    - [update](#update)
    - [render](#render)
  - [Mixins](#mixins)
    - [Mixin](#mixin)
- [emit](#emit)

<!-- /TOC -->

## h

Returns a new virtual node.

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

Renders an application.

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
(<a href="#state">State</a>, <a href="#actions">Actions</a>) => <a href="#virtualnode">VirtualNode</a>
</pre>

### Actions

See also [Actions](/docs/actions.md).

<pre>
{
  [action: string]:
    | <a href="#actions">Actions</a>
    | (<a href="#state">State</a>, <a href="#actions">Actions</a>, any) => <a href="#actionresult">ActionResult</a>
}
</pre>

#### ActionResult

A partial state or [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a partial state. This result is used to update the current state using a shallow merge.

### Events

See also [Events](/docs/events.md).

<pre>
{
  [<i>event</i>: string]: Array&lt<a href="#event">Event</a>&gt | <a href="#event">Event</a>
}
</pre>

#### Event

<pre>
<i>event</i>(<a href="#state">State</a>, <a href="#actions">Actions</a>, any): any
</pre>


#### init

The init events fires before the first render. This is a good place to initialize your application.

<pre>
init(<a href="#state">State</a>, <a href="#actions">Actions</a>): void
</pre>

#### loaded

The loaded event fires after the first render. This event is useful if you need to access real DOM nodes during initialization.

<pre>
loaded(<a href="#state">State</a>, <a href="#actions">Actions</a>): void
</pre>

#### action

The action event fires every time before an action is called.

<pre>
action(<a href="#state">State</a>, <a href="#actions">Actions</a>, {
  action: string,
  data: any
}): any
</pre>

#### update

The update event fires every time before the state is updated.

<pre>
update(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#actionresult">ActionResult</a>): <a href="#actionresult">ActionResult</a>
</pre>

#### render

The render event fires every time before the view is rendered. You can use this event to overwrite the current view by returning a new one.

<pre>
render(<a href="#state">State</a>, <a href="#actions">Actions</a>, <a href="#view">View</a>): <a href="#view">View</a>
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

Returns the given data reduced by successively calling each event handler of the specified event. See also [Custom Events](/docs/events.md#custom-events)

<pre>
emit(string, any): any
</pre>


