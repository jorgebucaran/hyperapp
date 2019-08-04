export as namespace hyperapp;


/** @namespace [VDOM] */

/** The VDOM representation of an Element.
 *
 * @memberOf [VDOM]
 */
export interface VNode<Attributes = {}> {
    nodeName: string;
    attributes?: Attributes;
    children: (VNode | string)[];
    key: string | number | null;
}

/**
 * Possibles children types
 */
export type Children = VNode | string | number | null

/** A Component is a function that returns a custom VNode or View.
 *
 * @memberOf [VDOM]
 */
export interface Component<Attributes = {}> {
    (attributes: Attributes, children: Children[]): VNode<Attributes>;
}

/** The soft way to create a VNode.
 * @param name      An element name or a Component function
 * @param attributes     Any valid HTML atributes, events, styles, and meta data
 * @param children  The children of the VNode
 * @returns A VNode tree.
 *
 * @memberOf [VDOM]
 */
export function h<Attributes>(
    nodeName: Component<Attributes> | string,
    attributes?: Attributes,
    ...children: (Children | Children[])[]
): VNode<Attributes>

/** @namespace [App] */

// ActionPayload<void, void>     -> void
// ActionPayload<Event, string>  -> (string | ((data: Event) => string)) 
//
type ActionPayload<DPayload, CPayload> = (CPayload extends void ? void : (CPayload | ((data: DPayload) => CPayload)));

/** Usable to 1st argument of `dispatch`. Usually, This is a reference to an action to be invoked by Hyperapp, with custom payload
 *
 * @memberOf [App]
 */
export type Dispatchable<State, DPayload, CPayload> = (
    ([Action<State, CPayload>, ActionPayload<DPayload, CPayload>])
    | Action<State, DPayload>  // (state, data) => ({ ... }) 
    | Action<State, void>      // (state) => ({ ... }) 
);

/** Usable to 1st argument of `dispatch`, make strict for `init` (state and default payload are always undefined)
 *
 * @memberOf [App]
 */
export type DispatchableOnInit<State, CPayload> = (
    State
    | ([(ActionOnInit<State, CPayload>), ActionPayload<undefined, CPayload>])
    | ActionOnInit<State, undefined>
);

/** A definition of `dispatch`. This is passed as an argument of effect or subscription runner.
 * 
 * @memberOf [App]
 */
export type Dispatch<State, AcceptPayload> = (obj: Dispatchable<State, any, any>, data: AcceptPayload) => void;


/** An effect or subscription runner. It is actually invoked when effect is reflected.
 * 
 * @memberOf [App]
 */
export type EffectFunc<State, Props, NextPayload, Result = void> = (dispatch: Dispatch<State, NextPayload>, props: Props, payload: any) => Result;

/** An effect as the result of an action.
 * 
 * @memberOf [App]
 */
export type Effect<State, Props, NextPayload = void> = [EffectFunc<State, Props, NextPayload>, Props];

/** The result of an action.
 *
 * @memberOf [App]
 */
export type ActionResult<State> = State | [State, ...Effect<State, any>[]];

/** The interface for a single action implementation. (without effect)
 *
 * @memberOf [App]
 */
export type PureAction<State, Payload = void> = (
    Payload extends void
    ? (state: State) => State
    : (state: State, data: Payload) => State
)

/** The interface for a single action implementation.
 *
 * @memberOf [App]
 */
export type Action<State, Payload = void> = (
    Payload extends void
    ? (state: State) => ActionResult<State>
    : (state: State, data: Payload) => ActionResult<State>
)

/** The interface for a single action implementation, make strict for `init` (given state are always undefined)
 *
 * @memberOf [App]
 */
export type ActionOnInit<State, Payload = void> = (
    Payload extends void
    ? (state: undefined) => ActionResult<State>
    : (state: undefined, data: Payload) => ActionResult<State>
)

/** A reference to an subscription to be managed by Hyperapp, with optional additional parameters
 * 
 * @memberOf [App]
 */
export type Subscription<State, Props, Payload = void> = [EffectFunc<State, Props, Payload, () => void>, Props];


/** The view function describes the application UI as a tree of VNodes.
 * @returns A VNode tree.
 * @memberOf [App]
 */
export interface View<State> {
    (state: State): VNode<object> | null;
}

/** The possible response types for the subscription callback for an application
 * 
 * @memberOf [App]
 */
export type SubscriptionsResult<State> = | (Subscription<State, any> | boolean)[] | Subscription<State, any>;

/** The subscriptions function describes the current application subscriptions.
 * @returns The current subscription(s) given the current state
 * @memberOf [App]
 */
export type Subscriptions<State> = (state: State) => SubscriptionsResult<State>;

/** The set of properties that define a Hyperapp application.
 * @memberOf [App]
 */
export interface AppProps<State> {
    init?: DispatchableOnInit<State, any>;
    view: View<State>;
    node: Element;
    subscriptions?: Subscriptions<State>;
}

/** The app() call creates and renders a new application.
 *
 * @param state The state object.
 * @param actions The actions object implementation.
 * @param view The view function.
 * @param container The DOM element where the app will be rendered to.
 * @returns The actions wired to the application.
 * @memberOf [App]
 */
export function app<State>(app: AppProps<State>): void

/** Action wrapper for strict typing. (without payload)
 * 
 * @param action The action function.
 * @memberOf [App]
 */
export function a<S, DPayload>(action: Action<S, DPayload>): Dispatchable<S, DPayload, void>;

/** Action wrapper for strict typing. (with payload)
 *
 * @param action The action function.
 * @param payload The parameter passed to action function.
 * @memberOf [App]
 */
export function a<S, DPayload, PPayload>(action: Action<S, PPayload>, payload: ActionPayload<DPayload, PPayload>): Dispatchable<S, DPayload, PPayload>;

/** Alias of `a` 
 * 
 * @memberOf [App]
 */
export function an<S, DPayload = void>(action: Action<S, DPayload>): Dispatchable<S, DPayload, void>;

/** Alias of `a`
 * 
 * @memberOf [App]
 */
export function an<S, DPayload, PPayload>(action: Action<S, PPayload>, payload: ActionPayload<DPayload, PPayload>): Dispatchable<S, DPayload, PPayload>;

// e.g.) onchange, onupdate, oninput, ...
//
type EventKeys = keyof GlobalEventHandlers;

type EventParameterType<Key extends EventKeys> = Parameters<Exclude<GlobalEventHandlers[Key], null>>[0];

// <div onclick={A} title={B} />
//   -> A: Dispatchable<any, MouseEvent, any>  B: any
//
type JSXAttribute = Partial<{ [key in EventKeys]: Dispatchable<any, EventParameterType<key>, any> }> & { [key: string]: any };

// /** @namespace [JSX] */
declare global {
    namespace JSX {
        interface Element extends VNode<any> {}
        interface IntrinsicElements {
            [elemName: string]: JSXAttribute;
        }
    }
}
