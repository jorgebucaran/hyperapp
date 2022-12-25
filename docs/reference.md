# Reference

## API

- [`h()`](api/h.md) creates a virtual DOM node (VNode) that gets rendered.
- [`text()`](api/text.md) turns a string into a VNode.
- [`app()`](api/app.md) initializes a Hyperapp app and mounts it.
- [`memo()`](api/memo.md) creates a special VNode that is lazily rendered.

## Architecture

- [State](architecture/state.md) represents your application's data.
- [Views](architecture/views.md) represent your state visually.
- [Actions](architecture/actions.md) cause state transitions and trigger effects.
- [Effects](architecture/effects.md) are triggered by actions to interact with external processes.
- [Subscriptions](architecture/subscriptions.md) dispatch actions in response to external events.
- [Dispatch](architecture/dispatch.md) controls action dispatching.

&nbsp;&nbsp;&nbsp;&nbsp;[Flowchart](architecture/flowchart.md) showing the general flow of a hyperapp app.

<h2 title="“I’d like to think of browsing the glossary as flipping pages in a book. I can go anywhere instantly and learn whatever suits my fancy.” ―@icylace">Glossary</h2>

- [Action](architecture/actions.md): An app behavior that transitions state and invokes effects.
- [Action Descriptor](architecture/actions.md#payloads): A tuple representing an action with its payload.
- [Component](architecture/views.md#components): A view with a specific purpose.
- [Dispatch Function](architecture/dispatch.md#dispatch): The process that executes actions, applies state, and calls effects.
- [Dispatch Initializer](architecture/dispatch.md#dispatch-initializer): A function that controls dispatch.
- [Effect](architecture/effects.md): A generalized encapsulation of an external process.
- [Effecter](architecture/effects.md#effecters): A function that carries out an effect.
- [Event Payload](architecture/actions.md#event-payloads): A payload specific to an event.
- [Memoization](architecture/views.md#memoization): In Hyperapp, the delayed rendering of VNodes.
- [Mount Node](api/app.md#node): The DOM element that holds the app.
- [Payload](architecture/actions.md#payloads): Data given to an action.
- [State](architecture/state.md): The unified set of data your Hyperapp application uses and maintains.
- [State Transition](architecture/state.md#state-transitions): An evolutionary step for the state.
- [Subscriber](architecture/subscriptions.md#subscribers): A function that carries out a subscription.
- [Subscription](architecture/subscriptions.md): A binding between the app and external events.
- [Top-Level View](architecture/views.md#top-level-view): The main view which is given the state.
- [VDOM](architecture/views.md#virtual-dom): The virtual DOM, an in-memory representation for the DOM of the current page.
- [View](architecture/views.md): A function describing the desired DOM, represented by a VNode, as a function of the current state.
- [Wrapped Action](architecture/actions.md#wrapped-actions): An action that is returned by another action.
