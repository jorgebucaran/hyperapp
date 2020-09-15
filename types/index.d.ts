// Minimum TypeScript Version: 3.7

declare module "hyperapp" {
  // A Hyperapp application instance has an initial state and a base view.
  // It must also be mounted over an available DOM element.
  type App<S, P = unknown, D = unknown>
    = Readonly<{
      init: Transition<S, P, D> | Action<S, P, D>
      view: View<S, D>
      node: Node
      subscriptions?: Subscription<S, P, D>
      middleware?: Middleware<S, P, D>
    }>

  // A transition is a state transformation with any effects to run.
  type Transition<S, P = unknown, D = unknown> = State<S> | StateWithEffects<S, P, D>

  // Application state is accessible in every view, action, and subscription.
  type State<S> = S

  // Transformed state can be paired with a list of effects to run.
  type StateWithEffects<S, P = unknown, D = unknown> = [State<S>, ...EffectDescriptor<S, P, D>[]]

  // A view builds a virtual DOM node representation of the application state.
  type View<S, D = unknown> = (state: State<S>) => VDOM<S, D>

  // A subscription is a set of recurring effects.
  type Subscription<S, P = unknown, D = unknown> = (state: State<S>) => Subscriber<S, P, D>[]

  // A subscriber reacts to subscription updates.
  type Subscriber<S, P = unknown, D = unknown> = boolean | undefined | Effect<S, P, D> | Unsubscribe

  // A subscriber ideally provides a function that cancels itself properly.
  type Unsubscribe = () => void

  // Middleware allows for custom processing during dispatching.
  type Middleware<S, P = unknown, D = unknown> = (dispatch: Dispatch<S, P, D>) => Dispatch<S, P, D>

  // ---------------------------------------------------------------------------

  // A dispatched action handles an event in the context of the current state.
  type Dispatch<S, P = unknown, D = unknown> = (action: Action<S, P, D>, props?: Payload<P>) => void

  // An action transforms existing state and can be wrapped by another action.
  type Action<S, P = unknown, D = unknown>
    = [Action<S, P, D>, Payload<P>]
    | ((state: State<S>, props?: Payload<P>) => Transition<S, P, D> | Action<S, P, D>)

  // A payload is data external to state that is given to a dispatched action.
  type Payload<P = unknown> = P

  // An effect descriptor describes how an effect should be invoked.
  // A function that creates this is called an effect constructor.
  type EffectDescriptor<S, P = unknown, D = unknown> = [Effect<S, P, D>, EffectData<D>]

  // An effect is where side effects and any additional dispatching occur.
  // An effect used in a subscription should be able to unsubscribe.
  type Effect<S, P = unknown, D = unknown>
    = (dispatch: Dispatch<S, P, D>, props?: EffectData<D>) =>
        void | Unsubscribe | Promise<undefined | Unsubscribe>

  // An effect is generally given additional data.
  type EffectData<D = unknown> = D

  // ---------------------------------------------------------------------------

  // A virtual DOM node represents an actual DOM element.
  type VDOM<S, D = unknown> = {
    readonly type: string
    readonly props: PropList<S, D>
    readonly children: VNode<S, D>[]
    node: MaybeNode
    readonly tag?: Tag<S, D>
    readonly key: Key
    memo?: PropList<S, D>
  }

  // Virtual DOM properties will often correspond to HTML attributes.
  type PropList<S, D = unknown>
    = Readonly<ElementCreationOptions & EventActions<S, D> & {
      [_: string]: unknown
      class?: ClassProp
      key?: Key
      style?: StyleProp
    }>

  // Actions are used as event handlers.
  type EventActions<S, D = unknown> = { [K in keyof EventsMap]?: Action<S, EventsMap[K], D> }
  type EventsMap = OnHTMLElementEventMap & OnWindowEventMap & { onsearch: Event }

  // A key can uniquely associate a virtual DOM node with a certain DOM element.
  type Key = string | null | undefined

  // The `class` property represents an HTML class attribute string.
  type ClassProp = false | string | Record<string, boolean> | ClassProp[]

  // The `style` property represents inline CSS.
  type StyleProp
    = { [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | null }
    // For some reason we need this to prevent `style` from being a string.
    & { [index: number]: never }

  // A virtual node is a convenience layer over a virtual DOM node.
  type VNode<S, D = unknown> = false | null | undefined | VDOM<S, D>

  // Actual DOM nodes will be manipulated depending on how property patching goes.
  type MaybeNode = null | undefined | Node

  // A virtual DOM node's tag has metadata relevant to it. Virtual DOM nodes are
  // tagged by their type to assist rendering.
  type Tag<S, D = unknown> = VDOMNodeType | View<S, D>

  // These are based on actual DOM node types:
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  const enum VDOMNodeType { SSR = 1, Text = 3 }

  // ---------------------------------------------------------------------------

  // The `app` function initiates a Hyperapp application. `app` along with effects
  // should be the only places you need to worry about side effects.
  function app<S, P = unknown, D = unknown>(props: App<S, P, D>): Dispatch<S, P, D>

  // The `h` function builds a virtual DOM node.
  function h<S, D = unknown>(
    type: string,
    props: PropList<S, D>,
    children?: VNode<S, D> | readonly VNode<S, D>[],
  ): VDOM<S, D>

  // The `memo` function stores a view along with properties for it.
  function memo<S, D = unknown>(view: View<S, D>, props: PropList<S, D>): Partial<VDOM<S, D>>

  // The `text` function creates a virtual DOM node representing plain text.
  function text<S, D = unknown>(value: number | string, node?: Node): VDOM<S, D>

  // ---------------------------------------------------------------------------

  // Due to current limitations with TypeScript (which should get resolved in
  // the future: https://github.com/microsoft/TypeScript/pull/40336), here is
  // a collection of modified copies of relevant event maps from TypeScript's
  // "lib.dom.d.ts" definition file to assist with defining `EventActions`:

  type OnElementEventMap = {
    "onfullscreenchange": Event
    "onfullscreenerror": Event
  }

  type OnGlobalEventHandlersEventMap = {
    "onabort": UIEvent
    "onanimationcancel": AnimationEvent
    "onanimationend": AnimationEvent
    "onanimationiteration": AnimationEvent
    "onanimationstart": AnimationEvent
    "onauxclick": MouseEvent
    "onblur": FocusEvent
    "oncancel": Event
    "oncanplay": Event
    "oncanplaythrough": Event
    "onchange": Event
    "onclick": MouseEvent
    "onclose": Event
    "oncontextmenu": MouseEvent
    "oncuechange": Event
    "ondblclick": MouseEvent
    "ondrag": DragEvent
    "ondragend": DragEvent
    "ondragenter": DragEvent
    "ondragexit": Event
    "ondragleave": DragEvent
    "ondragover": DragEvent
    "ondragstart": DragEvent
    "ondrop": DragEvent
    "ondurationchange": Event
    "onemptied": Event
    "onended": Event
    "onerror": ErrorEvent
    "onfocus": FocusEvent
    "onfocusin": FocusEvent
    "onfocusout": FocusEvent
    "ongotpointercapture": PointerEvent
    "oninput": Event
    "oninvalid": Event
    "onkeydown": KeyboardEvent
    "onkeypress": KeyboardEvent
    "onkeyup": KeyboardEvent
    "onload": Event
    "onloadeddata": Event
    "onloadedmetadata": Event
    "onloadstart": Event
    "onlostpointercapture": PointerEvent
    "onmousedown": MouseEvent
    "onmouseenter": MouseEvent
    "onmouseleave": MouseEvent
    "onmousemove": MouseEvent
    "onmouseout": MouseEvent
    "onmouseover": MouseEvent
    "onmouseup": MouseEvent
    "onpause": Event
    "onplay": Event
    "onplaying": Event
    "onpointercancel": PointerEvent
    "onpointerdown": PointerEvent
    "onpointerenter": PointerEvent
    "onpointerleave": PointerEvent
    "onpointermove": PointerEvent
    "onpointerout": PointerEvent
    "onpointerover": PointerEvent
    "onpointerup": PointerEvent
    "onprogress": ProgressEvent
    "onratechange": Event
    "onreset": Event
    "onresize": UIEvent
    "onscroll": Event
    "onsecuritypolicyviolation": SecurityPolicyViolationEvent
    "onseeked": Event
    "onseeking": Event
    "onselect": Event
    "onselectionchange": Event
    "onselectstart": Event
    "onstalled": Event
    "onsubmit": Event
    "onsuspend": Event
    "ontimeupdate": Event
    "ontoggle": Event
    "ontouchcancel": TouchEvent
    "ontouchend": TouchEvent
    "ontouchmove": TouchEvent
    "ontouchstart": TouchEvent
    "ontransitioncancel": TransitionEvent
    "ontransitionend": TransitionEvent
    "ontransitionrun": TransitionEvent
    "ontransitionstart": TransitionEvent
    "onvolumechange": Event
    "onwaiting": Event
    "onwheel": WheelEvent
  }

  type OnDocumentAndElementEventHandlersEventMap = {
    "oncopy": ClipboardEvent
    "oncut": ClipboardEvent
    "onpaste": ClipboardEvent
  }

  type OnHTMLElementEventMap
    = OnElementEventMap
    & OnGlobalEventHandlersEventMap
    & OnDocumentAndElementEventHandlersEventMap

  type OnWindowEventHandlersEventMap = {
    "onafterprint": Event
    "onbeforeprint": Event
    "onbeforeunload": BeforeUnloadEvent
    "onhashchange": HashChangeEvent
    "onlanguagechange": Event
    "onmessage": MessageEvent
    "onmessageerror": MessageEvent
    "onoffline": Event
    "ononline": Event
    "onpagehide": PageTransitionEvent
    "onpageshow": PageTransitionEvent
    "onpopstate": PopStateEvent
    "onrejectionhandled": PromiseRejectionEvent
    "onstorage": StorageEvent
    "onunhandledrejection": PromiseRejectionEvent
    "onunload": Event
  }

  type OnWindowEventMap = OnGlobalEventHandlersEventMap & OnWindowEventHandlersEventMap & {
    "onabort": UIEvent
    "onafterprint": Event
    "onbeforeprint": Event
    "onbeforeunload": BeforeUnloadEvent
    "onblur": FocusEvent
    "oncanplay": Event
    "oncanplaythrough": Event
    "onchange": Event
    "onclick": MouseEvent
    "oncompassneedscalibration": Event
    "oncontextmenu": MouseEvent
    "ondblclick": MouseEvent
    "ondevicelight": DeviceLightEvent
    "ondevicemotion": DeviceMotionEvent
    "ondeviceorientation": DeviceOrientationEvent
    "ondeviceorientationabsolute": DeviceOrientationEvent
    "ondrag": DragEvent
    "ondragend": DragEvent
    "ondragenter": DragEvent
    "ondragleave": DragEvent
    "ondragover": DragEvent
    "ondragstart": DragEvent
    "ondrop": DragEvent
    "ondurationchange": Event
    "onemptied": Event
    "onended": Event
    "onerror": ErrorEvent
    "onfocus": FocusEvent
    "onhashchange": HashChangeEvent
    "oninput": Event
    "oninvalid": Event
    "onkeydown": KeyboardEvent
    "onkeypress": KeyboardEvent
    "onkeyup": KeyboardEvent
    "onload": Event
    "onloadeddata": Event
    "onloadedmetadata": Event
    "onloadstart": Event
    "onmessage": MessageEvent
    "onmousedown": MouseEvent
    "onmouseenter": MouseEvent
    "onmouseleave": MouseEvent
    "onmousemove": MouseEvent
    "onmouseout": MouseEvent
    "onmouseover": MouseEvent
    "onmouseup": MouseEvent
    "onmousewheel": Event
    "onMSGestureChange": Event
    "onMSGestureDoubleTap": Event
    "onMSGestureEnd": Event
    "onMSGestureHold": Event
    "onMSGestureStart": Event
    "onMSGestureTap": Event
    "onMSInertiaStart": Event
    "onMSPointerCancel": Event
    "onMSPointerDown": Event
    "onMSPointerEnter": Event
    "onMSPointerLeave": Event
    "onMSPointerMove": Event
    "onMSPointerOut": Event
    "onMSPointerOver": Event
    "onMSPointerUp": Event
    "onoffline": Event
    "ononline": Event
    "onorientationchange": Event
    "onpagehide": PageTransitionEvent
    "onpageshow": PageTransitionEvent
    "onpause": Event
    "onplay": Event
    "onplaying": Event
    "onpopstate": PopStateEvent
    "onprogress": ProgressEvent<Window>
    "onratechange": Event
    "onreadystatechange": ProgressEvent<Window>
    "onreset": Event
    "onresize": UIEvent
    "onscroll": Event
    "onseeked": Event
    "onseeking": Event
    "onselect": Event
    "onstalled": Event
    "onstorage": StorageEvent
    "onsubmit": Event
    "onsuspend": Event
    "ontimeupdate": Event
    "onunload": Event
    "onvolumechange": Event
    "onvrdisplayactivate": Event
    "onvrdisplayblur": Event
    "onvrdisplayconnect": Event
    "onvrdisplaydeactivate": Event
    "onvrdisplaydisconnect": Event
    "onvrdisplayfocus": Event
    "onvrdisplaypointerrestricted": Event
    "onvrdisplaypointerunrestricted": Event
    "onvrdisplaypresentchange": Event
    "onwaiting": Event
  }
}
