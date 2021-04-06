// Minimum TypeScript Version: 4.2

declare module "hyperapp" {
  // `app()` initiates a Hyperapp instance. `app()` along with runners and
  // subscribers are the only places where side effects are allowed.
  function app<S>(props: App<S>): Dispatch<S>

  // `h()` builds a virtual DOM node.
  function h<S, T extends string = string>(
    // Tags cannot be empty strings.
    tag: T extends "" ? never : T,
    props: PropList<S>,
    children?: MaybeVDOM<S> | readonly MaybeVDOM<S>[]
  ): VDOM<S>

  // `memo()` stores a view along with any given data for it.
  function memo<S, D extends string | any[] | Record<string, any>>(
    view: View<D>,
    data: D
  ): VDOM<S>

  // `text()` creates a virtual DOM node representing plain text.
  function text<T, S>(
    // While most values can be stringified, symbols and functions cannot.
    value: T extends symbol | ((..._: any[]) => any) ? never : T,
    node?: Node
  ): VDOM<S>

  // ---------------------------------------------------------------------------

  // This utility type ensures at least one property in an object is present.
  // `App` uses this to conveniently mark `app({})` as invalid because that
  // is basically a fancy no-op.
  type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T]
  // Credit: https://stackoverflow.com/a/59987826/1935675

  // This utility type requires every property of an object or none at all.
  // `App` uses this to make sure `view:` always appears alongside `node:`.
  type AllOrNothing<T> = T | { [K in keyof T]?: never }

  // ---------------------------------------------------------------------------

  // A Hyperapp instance generally has an initial state and a base view and is
  // mounted over an available DOM element.
  type App<S> = Readonly<
    {
      view: View<S>
      node: Node
    } |
    AtLeastOne<{
      init: State<S> | StateWithEffects<S> | Action<S>
      subscriptions: Subscriptions<S>
      dispatch: DispatchInitializer<S>
    }> &
    AllOrNothing<{
      view: View<S>
      node: Node
    }>
  >

  // A view builds a virtual DOM node representation of the application state.
  type View<S> = (state: State<S>) => VDOM<S>

  // The subscriptions function manages a set of subscriptions.
  type Subscriptions<S> = (
    state: State<S>
  ) => (boolean | undefined | Subscription<S> | Unsubscribe)[]

  // A subscription represents subscriber activity.
  type Subscription<S, D = any> = [Subscriber<S, D>, Payload<D>]

  // A subscriber reacts to subscription updates.
  type Subscriber<S, D> = (
    dispatch: Dispatch<S>,
    payload?: Payload<D>
  ) => void | Unsubscribe

  // An unsubscribe function cleans up a canceled subscription.
  type Unsubscribe = () => void

  // Dispatching can be augmented to do custom processing.
  type DispatchInitializer<S> = (dispatch: Dispatch<S>) => Dispatch<S>

  // ---------------------------------------------------------------------------

  // A dispatched action handles an event in the context of the current state.
  type Dispatch<S> = (action: Action<S>, payload?: Payload<any>) => void

  // An action transforms existing state and/or wraps another action.
  type Action<S, P = any> = ActionTransform<S, P> | ActionWithPayload<S, P>
  type ActionTransform<S, P = any> = (
    state: State<S>,
    payload: Payload<P>
  ) => State<S> | StateWithEffects<S> | Action<S>
  type ActionWithPayload<S, P> = [ActionTransform<S, P>, Payload<P>]

  // A transform carries out the transition from one state to another.
  type Transform<S, P = any> = (
    state: State<S> | StateWithEffects<S>,
    payload?: Payload<P>
  ) => State<S> | StateWithEffects<S>

  // Application state is accessible in every view, action, and subscription.
  type State<S> = S

  // State can be associated with a list of effects to run.
  type StateWithEffects<S, D = any> = [State<S>, ...Effect<S, D>[]]

  // It is often convenient to abstract away effect preparation.
  type EffectCreator<S, D = any> = (..._: any[]) => Effect<S, D>

  // An effect is an abstraction over an impure process.
  type Effect<S, D = any> = [Effecter<S, D>, Payload<D>]

  // An effecter is where side effects and any additional dispatching may occur.
  type Effecter<S, D> = (
    dispatch: Dispatch<S>,
    payload?: Payload<D>
  ) => void | Promise<void>

  // A payload is data given to an action, effect, or subscription.
  type Payload<P> = P

  // ---------------------------------------------------------------------------

  // A virtual DOM node represents an actual DOM element.
  type VDOM<S> = {
    readonly type: VDOMNodeType
    readonly props: PropList<S>
    readonly children: MaybeVDOM<S>[]
    node: null | undefined | Node
    readonly tag: Tag<S>
    readonly key: Key
    memo?: PropList<S>
    events?: Record<string, Action<S>>

    // `_VDOM` is a guard property which gives us a way to tell `VDOM` objects
    // apart from `PropList` objects. Since users are not expected to manually
    // create their own VDOM elements, we can take advantage of this
    // TypeScript-specific trick without forcing the user to do
    // anything different.
    _VDOM: true
  }

  // These are based on actual DOM node types:
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  const enum VDOMNodeType {
    SSR = 1,
    Text = 3,
  }

  // In certain places a virtual DOM node can be made optional.
  type MaybeVDOM<S> = boolean | null | undefined | VDOM<S>

  // A virtual DOM node's tag has metadata relevant to it. Virtual DOM nodes are
  // tagged by their type to assist rendering.
  type Tag<S> = string | View<S>

  // A key can uniquely associate a virtual DOM node with a certain DOM element.
  type Key = string | null | undefined

  // Virtual DOM properties will often correspond to HTML attributes.
  type PropList<S> = Readonly<
    ElementCreationOptions &
      EventActions<S> & {
        [_: string]: unknown
        class?: ClassProp
        key?: Key
        style?: StyleProp

        // By disallowing `_VDOM` we ensure that values having the `VDOM` type are
        // not mistaken for also having `PropList`.
        _VDOM?: never
      }
  >

  // The `class` property represents an HTML class attribute string.
  type ClassProp =
    | boolean
    | string
    | undefined
    | Record<string, boolean | undefined>
    | ClassProp[]

  // The `style` property represents inline CSS.
  //
  // NOTE: This relies on what TypeScript itself recognizes as valid CSS
  // properties. Custom properties are not covered as well as any newer
  // properties that are not yet recognized by TypeScript. Apparently,
  // the only way to accommodate them is to relax the adherence to
  // TypeScript's CSS property definitions. The trade-off doesn't
  // seem worth it given the chances of using such properties.
  // However, you can use type casting if you want to them.
  type StyleProp = {
    [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | null
  } & // Since strings are indexable we can avoid them by preventing indexing.
  { [_: number]: never }

  // Event handlers are implemented using actions.
  type EventActions<S> = {
    [K in keyof EventsMap]?: Action<S, EventsMap[K]> | ActionWithPayload<S, any>
  }
  type EventsMap = {
    [K in keyof HTMLElementEventMap as `on${K}`]: HTMLElementEventMap[K]
  } &
    { [K in keyof WindowEventMap as `on${K}`]: WindowEventMap[K] } & {
      onsearch: Event
    }
}
