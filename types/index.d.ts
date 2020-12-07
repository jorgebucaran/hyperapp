// Minimum TypeScript Version: 4.2

declare module "hyperapp" {
  // The `app` function initiates a Hyperapp application. `app` along with
  // effects are the only places where side effects are allowed.
  function app<S>(props: App<S>): void

  // The `h` function builds a virtual DOM node.
  function h<S>(
    type: string,
    props: PropList<S>,
    children?: VNode<S> | readonly VNode<S>[],
  ): VDOM<S>

  // The `memo` function stores a view along with properties for it.
  function memo<S>(tag: View<S>, memo: PropList<S>): Partial<VDOM<S>>

  // The `text` function creates a virtual DOM node representing plain text.
  function text<S>(value: number | string, node?: Node): VDOM<S>

  // ---------------------------------------------------------------------------

  // A Hyperapp application instance has an initial state and a base view.
  // It must also be mounted over an available DOM element.
  type App<S>
    = Readonly<{
      init: State<S> | EffectfulState<S> | Action<S>
      view: View<S>
      node: Node
      subscriptions?: Subscription<S>
      middleware?: Middleware<S>
    }>

  // A view builds a virtual DOM node representation of the application state.
  type View<S> = (state: State<S>) => VDOM<S>

  // A subscription is a set of recurring effects.
  type Subscription<S> = (state: State<S>) => Subscriber<S>[]

  // A subscriber reacts to subscription updates.
  type Subscriber<S, D = any> = boolean | undefined | Effect<S, D> | Unsubscribe

  // A subscriber ideally provides a function that cancels itself properly.
  type Unsubscribe = () => void

  // Middleware allows for custom processing during dispatching.
  type Middleware<S> = (dispatch: Dispatch<S>) => Dispatch<S>

  // ---------------------------------------------------------------------------

  // A dispatched action handles an event in the context of the current state.
  type Dispatch<S> = (action: Action<S>, props?: Payload<any>) => void

  // An action transforms existing state and/or wraps another action.
  type Action<S, P = any> = ActionTransform<S, P> | ActionDescriptor<S, P>
  type ActionTransform<S, P = any> = (state: State<S>, props?: Payload<P>) =>
    State<S> | EffectfulState<S> | Action<S>
  type ActionDescriptor<S, P> = [Action<S, P>, Payload<P>]

  // A transform carries out the transition from one state to another.
  type Transform<S, P = any> = (state: State<S>, props?: Payload<P>) => State<S> | EffectfulState<S>

  // A payload is data external to state that is given to an action or effect.
  type Payload<P> = P

  // Application state is accessible in every view, action, and subscription.
  type State<S> = S

  // Transformed state can be paired with a list of effects to run.
  type EffectfulState<S, D = any> = [State<S>, ...EffectDescriptor<S, D>[]]

  // An effect descriptor describes how an effect should be invoked.
  // A function that creates this is called an effect constructor.
  type EffectDescriptor<S, D> = [Effect<S, D>, Payload<D>]

  // An effect is where side effects and any additional dispatching occur.
  // An effect used in a subscription should be able to unsubscribe.
  type Effect<S, D>
    = (dispatch: Dispatch<S>, props?: Payload<D>) =>
      void | Unsubscribe | Promise<void | Unsubscribe>

  // ---------------------------------------------------------------------------

  // A virtual DOM node represents an actual DOM element.
  type VDOM<S> = {
    readonly type: string
    readonly props: PropList<S>
    readonly children: VNode<S>[]
    node: MaybeNode
    readonly tag?: Tag<S>
    readonly key: Key
    memo?: PropList<S>
  }

  // A key can uniquely associate a virtual DOM node with a certain DOM element.
  type Key = string | null | undefined

  // Actual DOM nodes will be manipulated depending on how property patching goes.
  type MaybeNode = null | undefined | Node

  // A virtual node is a convenience layer over a virtual DOM node.
  type VNode<S> = false | null | undefined | VDOM<S>

  // A virtual DOM node's tag has metadata relevant to it. Virtual DOM nodes are
  // tagged by their type to assist rendering.
  type Tag<S> = VDOMNodeType | View<S>

  // These are based on actual DOM node types:
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  const enum VDOMNodeType { SSR = 1, Text = 3 }

  // Virtual DOM properties will often correspond to HTML attributes.
  type PropList<S>
    = Readonly<ElementCreationOptions & EventActions<S> & {
      [_: string]: unknown
      class?: ClassProp
      key?: Key
      style?: StyleProp
    }>

  // The `class` property represents an HTML class attribute string.
  type ClassProp = false | string | undefined | Record<string, boolean | undefined> | ClassProp[]

  // The `style` property represents inline CSS.
  type StyleProp
    = { [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | null }
    // For some reason we need this to prevent `style` from being a string.
    & { [index: number]: never }

  // Event handlers are implemented using actions.
  type EventActions<S> = { [K in keyof EventsMap]?: Action<S, EventsMap[K]> }
  type EventsMap
    = { [K in keyof HTMLElementEventMap as `on${K}`]: HTMLElementEventMap[K] }
    & { [K in keyof WindowEventMap as `on${K}`]: WindowEventMap[K] }
    & { onsearch: Event }
}
