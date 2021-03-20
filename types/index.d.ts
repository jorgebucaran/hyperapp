// Minimum TypeScript Version: 4.2
// `dtslint` needs 4.2 even though these definitions should work with 4.1.

declare module "hyperapp" {
  // `app()` initiates a Hyperapp application. `app()` along with runners and
  // subscribers are the only places where side effects are allowed.
  function app<S>(props: App<S>): void

  // `h()` builds a virtual DOM node.
  function h<S>(tag: string, props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): VDOM<S>

  // `memo()` stores a view along with data for it.
  function memo<S>(view: View<S>, data: string | any[] | Record<string, any>): Partial<VDOM<S>>

  // `text()` creates a virtual DOM node representing plain text.
  function text<S>(value: number | string, node?: Node): VDOM<S>

  // ---------------------------------------------------------------------------

  // A Hyperapp application instance has an initial state and a base view.
  // It must also be mounted over an available DOM element.
  type App<S> = Readonly<{
    init: StateFormat<S> | Action<S>
    view: View<S>
    node: Node
    subscriptions?: Subscriptions<S>
    middleware?: Middleware<S>
  }>

  // A view builds a virtual DOM node representation of the application state.
  type View<S> = (state: State<S>) => VDOM<S>

  // The subscriptions function manages a set of subscriptions.
  type Subscriptions<S> = (state: State<S>) => Subscription<S>[]

  // A subscription represents subscriber activity.
  type Subscription<S, D = any> = boolean | undefined | SubscriberDescriptor<S, D> | Unsubscribe

  // A subscriber reacts to subscription updates.
  type SubscriberDescriptor<S, D> = [Subscriber<S, D>, Payload<D>]
  type Subscriber<S, D> = (dispatch: Dispatch<S>, props?: Payload<D>) => void | Unsubscribe

  // An unsubscribe function cleans up a canceled subscription.
  type Unsubscribe = () => void

  // Middleware allows for custom processing during dispatching.
  type Middleware<S> = (dispatch: Dispatch<S>) => Dispatch<S>

  // ---------------------------------------------------------------------------

  // A dispatched action handles an event in the context of the current state.
  type Dispatch<S> = (action: Action<S>, props?: Payload<any>) => void

  // An action transforms existing state and/or wraps another action.
  type Action<S, P = any> = ActionTransform<S, P> | ActionDescriptor<S, P>
  type ActionTransform<S, P = any> = (state: State<S>, props?: Payload<P>) => StateFormat<S> | Action<S>
  type ActionDescriptor<S, P> = [ActionTransform<S, P>, Payload<P>]

  // A transform carries out the transition from one state to another.
  type Transform<S, P = any> = (state: StateFormat<S>, props?: Payload<P>) => StateFormat<S>

  // State can either be on its own or associated with effects.
  type StateFormat<S> = State<S> | StateWithEffects<S>

  // Application state is accessible in every view, action, and subscription.
  type State<S> = S

  // State can be associated with a list of effects to run.
  type StateWithEffects<S, D = any> = [State<S>, ...(Effect<S, D> | RunnerDescriptor<S, D>)[]]

  // An effect is an abstraction over an impure process.
  type Effect<S, D = any> = (..._: any[]) => RunnerDescriptor<S, D>

  // A runner is where side effects and any additional dispatching may occur.
  type RunnerDescriptor<S, D = any> = [Runner<S, D>, Payload<D>]
  type Runner<S, D> = (dispatch: Dispatch<S>, props?: Payload<D>) => void | Promise<void>

  // A payload is data given to an action, effect, or subscription.
  type Payload<P> = P

  // ---------------------------------------------------------------------------

  // A virtual DOM node represents an actual DOM element.
  type VDOM<S> = {
    readonly type: VDOMNodeType
    readonly props: PropList<S>
    readonly children: VNode<S>[]
    node: MaybeNode
    readonly tag?: Tag<S>
    readonly key: Key
    memo?: PropList<S>
    events?: Record<string, Action<S>>

    // `_VDOM` is a guard property which gives us a way to tell `VDOM` objects
    // apart from `PropList` object.
    _VDOM: true
  }

  // These are based on actual DOM node types:
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  const enum VDOMNodeType { SSR = 1, Text = 3 }

  // A virtual node is a convenience layer over a virtual DOM node.
  type VNode<S> = boolean | null | undefined | VDOM<S>

  // Actual DOM nodes get manipulated depending on how property patching goes.
  type MaybeNode = null | undefined | Node

  // A virtual DOM node's tag has metadata relevant to it. Virtual DOM nodes are
  // tagged by their type to assist rendering.
  type Tag<S> = string | View<S>

  // A key can uniquely associate a virtual DOM node with a certain DOM element.
  type Key = string | null | undefined

  // Virtual DOM properties will often correspond to HTML attributes.
  type PropList<S> = Readonly<ElementCreationOptions & EventActions<S> & {
    [_: string]: unknown
    class?: ClassProp
    key?: Key
    style?: StyleProp

    // By disallowing `_VDOM` we ensure that values matching `VDOM` are not
    // mistaken for also matching `PropList`.
    _VDOM?: never
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
