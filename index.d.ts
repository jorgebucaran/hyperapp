// Minimum TypeScript Version: 4.2

// This requires every property of an object or none at all.
type AllOrNothing<T> = T | { [K in keyof T]?: never }

// This ensures at least one property in an object is present.
type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T]
// Credit: https://stackoverflow.com/a/59987826/1935675

// This ensures at least one object property group is present.
type AtLeastSomething<T, U> = U | AtLeastOne<T> & AllOrNothing<U>

// Most event typings are provided by TypeScript itself.
type EventsMap =
  & { [K in keyof HTMLElementEventMap as `on${K}`]: HTMLElementEventMap[K] }
  & { [K in keyof WindowEventMap as `on${K}`]: WindowEventMap[K] }
  & { onsearch: Event }

// Indexable values are able to use subscripting.
type Indexable = string | unknown[] | Record<string, any>

// This validates plain objects while invalidating array objects and string
// objects by disallowing numerical indexing.
type IndexableByKey = Record<number, never>

// Empty strings can cause issues in certain places.
type NonEmptyString<T> = T extends "" ? never : T

// -----------------------------------------------------------------------------

declare module "hyperapp" {
  // `app()` initiates a Hyperapp instance. Only `app()`'s `node:` property and
  // effecters and subscribers are allowed to have side effects.
  function app<S>(props: App<S>): Dispatch<S>

  // `h()` builds a virtual DOM node.
  function h<S, C = unknown, T extends string = string>(
    tag: NonEmptyString<T>,
    props: CustomPayloads<S, C> & Props<S>,
    children?: MaybeVNode<S> | readonly MaybeVNode<S>[]
  ): ElementVNode<S>

  // `memo()` stores a view along with any given data for it.
  function memo<S, D extends Indexable = Indexable>(
    view: (data: D) => VNode<S>,
    data: D
  ): VNode<S>

  // `text()` creates a virtual DOM node representing plain text.
  function text<T = unknown>(
    // Values, aside from symbols and functions, can be handled.
    value: T extends symbol | ((..._: unknown[]) => unknown) ? never : T
  ): TextVNode

  // ---------------------------------------------------------------------------

  // This lets you make a variant of `h()` which is aware of your Hyperapp
  // instance's state. The `_ extends never` ensures that any state-aware
  // `h()` doesn't have an explicit state type that contradicts the
  // state type it actually uses.
  interface TypedH<S> {
    <_ extends never, C = unknown, T extends string = string>(
      tag: NonEmptyString<T>,
      props: CustomPayloads<S, C> & Props<S>,
      children?: MaybeVNode<S> | readonly MaybeVNode<S>[]
    ): ElementVNode<S>
  }

  // ---------------------------------------------------------------------------

  // An action transforms existing state and/or wraps another action.
  type Action<S, P = any> = (state: S, payload: P) => Dispatchable<S>

  // A Hyperapp instance typically has an initial state and a top-level view
  // mounted over an available DOM element.
  type App<S> =
    Readonly<AtLeastSomething<{
      // State is established through either direct assignment or an action.
      init: Dispatchable<S>

      // The subscriptions function manages a set of subscriptions.
      subscriptions: (state: S) =>
        readonly (boolean | undefined | Subscription<S>)[]

      // Dispatching can be augmented to do custom processing.
      dispatch: (dispatch: Dispatch<S>) => Dispatch<S>
    }, {
      // The top-level view can build a virtual DOM node depending on the state.
      view: (state: S) => VNode<S>

      // The mount node is where a Hyperapp instance will get placed.
      node: Node
    }>>

  // The `class` property represents an HTML class attribute string.
  type ClassProp =
    | boolean
    | string
    | undefined
    | Record<string, boolean | undefined>
    | ClassProp[]

  // This lets event-handling actions properly accept custom payloads.
  type CustomPayloads<S, T> = {
    [K in keyof T]?:
      K extends "style"
      ? StyleProp
      : T[K] extends [action: Action<S, infer P>, payload: unknown]
      ? readonly [action: Action<S, P>, payload: P]
      : T[K]
  }

  // Dispatching will cause state transitions.
  type Dispatch<S> = (dispatchable: Dispatchable<S>, payload?: unknown) => void

  // A dispatchable entity is used to cause a state transition.
  type Dispatchable<S, P = any> =
    | S
    | [state: S, ...effects: MaybeEffect<S, P>[]]
    | Action<S, P>
    | readonly [action: Action<S, P>, payload: P]

  // An effect is where side effects and any additional dispatching may occur.
  type Effect<S, P = any> = readonly [
    effecter: (dispatch: Dispatch<S>, payload: P) => void | Promise<void>,
    payload: P
  ]
  
  // Effects can be declared conditionally.
  type MaybeEffect<S, P> = null | undefined | boolean | "" | 0 | Effect<S, P>


  // Event handlers are implemented using actions.
  type EventActions<S> = {
    [K in keyof EventsMap]:
      | Action<S, EventsMap[K]>
      | readonly [action: Action<S>, payload: unknown]
  }

  // In certain places a virtual DOM node can be made optional.
  type MaybeVNode<S> = boolean | null | undefined | VNode<S>

  // Virtual DOM properties will often correspond to HTML attributes.
  type Props<S> =
    Readonly<
      Partial<
        Omit<HTMLElement, keyof (
          DocumentAndElementEventHandlers &
          ElementCSSInlineStyle &
          GlobalEventHandlers
        )> &
        ElementCreationOptions &
        EventActions<S>
      > &
      {
        [_: string]: unknown
        class?: ClassProp
        key?: VNode<S>["key"]
        style?: StyleProp

        // By disallowing `_VNode` we ensure values having the `VNode` type are
        // not mistaken for also having the `Props` type.
        _VNode?: never
      }
    >

  // The `style` property represents inline CSS. This relies on TypeScript's CSS
  // property definitions. Custom properties aren't covered as well as any newer
  // properties yet to be recognized by TypeScript. The only way to accommodate
  // them is to relax the adherence to TypeScript's CSS property definitions.
  // It's a poor trade-off given the likelihood of using such properties.
  // However, you can use type casting if you want to use them.
  type StyleProp = IndexableByKey & {
    [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | null
  }

  // A subscription reacts to external activity.
  type Subscription<S, P = any> = readonly [
    subscriber: (dispatch: Dispatch<S>, payload: P) => Unsubscribe,
    payload: P
  ]

  // An unsubscribe function cleans up a canceled subscription.
  type Unsubscribe = () => void

  // A virtual DOM node (a.k.a. VNode) represents an actual DOM element.
  type ElementVNode<S> = {
    readonly props: Props<S>
    readonly children: readonly MaybeVNode<S>[]
    node: null | undefined | Node

    // Hyperapp takes care of using native Web platform event handlers for us.
    events?:
      Record<
        string,
        Action<S> | readonly [action: Action<S>, payload: unknown]
      >

    // A key can uniquely associate a VNode with a certain DOM element.
    readonly key: string | null | undefined

    // A VNode's tag is either an element name or a memoized view function.
    readonly tag: string | ((data: Indexable) => VNode<S>)

    // If the VNode's tag is a function then this data will get passed to it.
    memo?: Indexable

    // VNode types are based on actual DOM node types:
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    readonly type: 1

    // `_VNode` is a phantom guard property which gives us a way to tell `VNode`
    // objects apart from `Props` objects. Since we don't expect users to make
    // their own VNodes manually, we can take advantage of this trick which
    // is unique to TypeScript type definitions for JavaScript code.
    _VNode: true
  }

  // Certain VNodes specifically represent Text nodes and don't rely on state.
  type TextVNode = {
    readonly props: {}
    readonly children: []
    node: null | undefined | Node
    readonly key: undefined
    readonly tag: string
    readonly type: 3
    _VNode: true
  }
  
  // VNodes may represent either Text or Element nodes.
  type VNode<S> = ElementVNode<S> | TextVNode
}
