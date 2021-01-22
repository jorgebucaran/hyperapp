// Minimum TypeScript Version: 4.2
// `dtslint` needs 4.2 even though these definitions should work with 4.1.

declare module "hyperapp" {
  // `app()` initiates a Hyperapp application. `app()` along with effects are
  // only places where side effects are allowed.
  function app<S>(props: App<S>): void

  // `h()` builds a virtual DOM node.
  function h<S>(
    type: string,
    props: PropList<S>,
    children?: VNode<S> | readonly VNode<S>[],
  ): VDOM<S>

  // `memo()` stores a view along with properties for it.
  function memo<S>(tag: View<S>, memo: PropList<S>): Partial<VDOM<S>>

  // `text()` creates a virtual DOM node representing plain text.
  function text<S>(value: number | string, node?: Node): VDOM<S>

  // ---------------------------------------------------------------------------

  // A Hyperapp application instance has an initial state and a base view.
  // It must also be mounted over an available DOM element.
  type App<S> = Readonly<{
    init: StateFormat<S> | Action<S>
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
  type ActionTransform<S, P = any> = (state: State<S>, props?: Payload<P>) => StateFormat<S> | Action<S>
  type ActionDescriptor<S, P> = [Action<S, P>, Payload<P>]

  // A transform carries out the transition from one state to another.
  type Transform<S, P = any> = (state: StateFormat<S>, props?: Payload<P>) => StateFormat<S>

  // State can either be on its own or associated with effects.
  type StateFormat<S> = State<S> | StateWithEffects<S>

  // Application state is accessible in every view, action, and subscription.
  type State<S> = S

  // State can be associated with a list of effects to run.
  type StateWithEffects<S, D = any> = [State<S>, ...EffectDescriptor<S, D>[]]

  // An effect descriptor describes how an effect should be invoked.
  // A function that creates this is called an effect constructor.
  type EffectDescriptor<S, D> = [Effect<S, D>, Payload<D>]

  // An effect is where side effects and any additional dispatching occur.
  // An effect used in a subscription should be able to unsubscribe.
  type Effect<S, D> = (dispatch: Dispatch<S>, props?: Payload<D>) =>
    void | Unsubscribe | Promise<void | Unsubscribe>

  // A payload is data external to state that is given to an action or effect.
  type Payload<P> = P

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
  type PropList<S> = Readonly<ElementCreationOptions & EventActions<S> & {
    [_: string]: unknown
    class?: ClassProp
    key?: Key
    style?: StyleProp
  }>

  // The `class` property represents an HTML class attribute string.
  type ClassProp = false | string | undefined | Record<string, boolean | undefined> | ClassProp[]

  // The `style` property represents inline CSS.
  //
  // NOTE: This relies on what TypeScript itself recognizes as valid CSS
  // properties. Custom properties are not covered as well as any newer
  // properties that are not yet recognized by TypeScript. Apparently,
  // the only way to accommodate them is to relax the adherence to
  // TypeScript's CSS property definitions. The trade-off doesn't
  // seem worth it given the rarity of such properties. However,
  // if you need them the workaround is to use type casting.
  type StyleProp
    = { [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | null }
    // Since strings are indexable we can avoid them by preventing indexing.
    & { [_: number]: never }

  // Event handlers are implemented using actions.
  type EventActions<S> = { [K in keyof EventsMap]?: Action<S, EventsMap[K]> }
  type EventsMap
    = { [K in keyof HTMLElementEventMap as `on${K}`]: HTMLElementEventMap[K] }
    & { [K in keyof WindowEventMap as `on${K}`]: WindowEventMap[K] }
    & { onsearch: Event }
}
