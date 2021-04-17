// Minimum TypeScript Version: 4.2

declare module "hyperapp" {
  // `app()` initiates a Hyperapp instance. `app()` along with runners and
  // subscribers are the only places where side effects are allowed.
  function app<S>(props: App<S>): Dispatch<S>

  // `h()` builds a virtual DOM node.
  function h<S, C = unknown, T extends string = string>(
    // Tags cannot be empty strings.
    tag: T extends "" ? never : T,
    props: ValidateCustomPayloads<S, C> & PropList<S>,
    children?: MaybeVDOM<S> | readonly MaybeVDOM<S>[]
  ): VDOM<S>

  // `memo()` stores a view along with any given data for it.
  function memo<S, D extends string | any[] | Record<string, any>>(
    view: View<D>,
    data: D
  ): VDOM<S>

  // `text()` creates a virtual DOM node representing plain text.
  function text<S, T = unknown>(
    // While most values can be stringified, symbols and functions cannot.
    value: T extends symbol | ((..._: any[]) => any) ? never : T,
    node?: Node
  ): VDOM<S>

  // ---------------------------------------------------------------------------

  // This lets you use a version of `h` which assumes your particular app state.
  // The `_ extends never` ensures that any such state-aware `h` doesn't have
  // an explicitly set state type that contradicts the type it actually uses.
  interface TypedH<S> {
    <_ extends never, T extends string = string>(
      tag: T extends "" ? never : T,
      props: PropList<S>,
      children?: MaybeVDOM<S> | readonly MaybeVDOM<S>[]
    ): VDOM<S>
  }

  // This helper for `h` lets event handling actions accept custom payloads.
  type ValidateCustomPayloads<S, T> = {
    [K in keyof T]?:
      K extends "style" ? StyleProp
      : T[K] extends [Action<S, infer P>, unknown] ? [Action<S, P>, P]
      : T[K]
  }

  // This utility type requires every property of an object or none at all.
  // `App` uses this to make sure `view:` always appears alongside `node:`.
  type AllOrNothing<T> = T | { [K in keyof T]?: never }

  // This utility type ensures at least one property in an object to be present.
  // `App` uses this to conveniently invalidate `app({})` because that is
  // basically a fancy no-op.
  type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T]
  // Credit: https://stackoverflow.com/a/59987826/1935675

  // This utility type validates plain objects while invalidating array objects
  // and string objects by disallowing numerical indexing. Used by `StyleProp`.
  type IndexableByKey = Record<number, never>

  // ---------------------------------------------------------------------------

  // A Hyperapp instance generally has an initial state and a base view and is
  // mounted over an available DOM element.
  type App<S> = Readonly<
    {
      view: View<S>
      node: Node
    } |
    AtLeastOne<{
      init: Dispatchable<S>
      subscriptions: Subscriptions<S>
      dispatch: DispatchInitializer<S>
    }> &
    AllOrNothing<{
      view: View<S>
      node: Node
    }>
  >

  // A view builds a virtual DOM node representation of the application state.
  type View<S> = (state: S) => VDOM<S>

  // The subscriptions function manages a set of subscriptions.
  type Subscriptions<S> = (
    state: S
  ) => (boolean | undefined | Subscription<S> | Unsubscribe)[]

  // A subscription reacts to external activity.
  type Subscription<S, P = any> = [
    subscriber: (dispatch: Dispatch<S>, payload: P) => void | Unsubscribe,
    payload: P
  ]

  // An unsubscribe function cleans up a canceled subscription.
  type Unsubscribe = () => void

  // Dispatching can be augmented to do custom processing.
  type DispatchInitializer<S> = (dispatch: Dispatch<S>) => Dispatch<S>

  // ---------------------------------------------------------------------------

  // A dispatched action handles an event in the context of the current state.
  type Dispatch<S> = (dispatchable: Dispatchable<S>, payload?: any) => void

  // A dispatchable entity, when processed, causes a state transition.
  type Dispatchable<S, P = any> =
    | S
    | [state: S, ...effects: Effect<S, P>[]]
    | Action<S, P>
    | [action: Action<S, P>, payload: P]

  // An action transforms existing state and/or wraps another action.
  type Action<S, P = any> = (state: S, payload: P) => Dispatchable<S>

  // An effect is where side effects and any additional dispatching may occur.
  type Effect<S, P = any> = [
    effecter: (dispatch: Dispatch<S>, payload: P) => void | Promise<void>,
    payload: P
  ]

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
    events?: Record<string, Action<S> | [action: Action<S>, payload: any]>

    // `_VDOM` is a guard property which gives us a way to tell `VDOM` objects
    // apart from `PropList` objects. Since we don't expect users to manually
    // create their own VNodes, we can take advantage of this trick that's
    // specific to TypeScript without forcing the user to do
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
    | Partial<Omit<HTMLElement, keyof (
      | DocumentAndElementEventHandlers
      & ElementCSSInlineStyle
      & GlobalEventHandlers
    )>>
    & ElementCreationOptions
    & EventActions<S>
    & {
      [_: string]: unknown
      class?: ClassProp
      key?: Key
      style?: StyleProp

      // By disallowing `_VDOM` we ensure that values having the `VDOM` type
      // are not mistaken for also having `PropList`.
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
  type StyleProp = IndexableByKey & {
    [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | null
  }

  // Event handlers are implemented using actions.
  type EventActions<S> = {
    [K in keyof EventsMap]?:
      | Action<S, EventsMap[K]>
      | [action: Action<S>, payload: any]
  }

  // Most event typings are provided by TypeScript itself.
  type EventsMap =
    | { [K in keyof HTMLElementEventMap as `on${K}`]: HTMLElementEventMap[K] }
    & { [K in keyof WindowEventMap as `on${K}`]: WindowEventMap[K] }
    & { onsearch: Event }
}
