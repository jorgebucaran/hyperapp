// TypeScript Version: 3.0

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

type PayloadCreator<DPayload, CPayload> = ((data: DPayload) => CPayload);

/** Usable to 1st argument of `dispatch`. Usually, This is a reference to an action to be invoked by Hyperapp, with custom payload
 *
 * @memberOf [App]
 */
export type Dispatchable<State, DPayload = any, CPayload = any> = (
    ([ActionWithEffects<State, CPayload, DPayload>, PayloadCreator<DPayload, CPayload>])
    | ([ActionWithEffects<State, CPayload, DPayload>, CPayload])
    | ActionWithEffects<State, void, DPayload>      // (state) => ({ ... }) | (state) => ([{ ... }, effect1, ...])
    | ActionWithEffects<State, DPayload, DPayload>  // (state, data) => ({ ... })  | (state, data) => ([{ ... }, effect1, ...])
);

/** Usable to 1st argument of `dispatch`, make strict for `init` (state and default payload are always undefined)
 *
 * @memberOf [App]
 */
export type DispatchableOnInit<State, CPayload> = (
    State
    | ([(ActionOnInit<State, CPayload>), PayloadCreator<undefined, CPayload>])
    | ([(ActionOnInit<State, CPayload>), CPayload])
    | ActionOnInit<State, undefined>
);

/** A definition of `dispatch`. This is passed as an argument of effect or subscription runner.
 * 
 * @memberOf [App]
 */
export type Dispatch<State, NextPayload> = (obj: Dispatchable<State, NextPayload>, data: NextPayload) => void;


/** An effect runner. It is actually invoked when effect is reflected.
 * 
 * @memberOf [App]
 */
export type EffectFunc<State, Props, AcceptDPayload = any, NextPayload = void> = (dispatch: Dispatch<State, NextPayload>, props: Props, payload: AcceptDPayload) => void;

/** An effect as the result of an action.
 * 
 * @memberOf [App]
 */
export type Effect<State = any, AcceptDPayload = any> = [EffectFunc<State, any, AcceptDPayload>, any];

/** An subscription runner. It is actually invoked when effect is reflected.
 * 
 * @memberOf [App]
 */
export type SubscriptionFunc<State, Props, NextPayload> = (dispatch: Dispatch<State, NextPayload>, props: Props) => (() => void);

/** A reference to an subscription to be managed by Hyperapp, with optional additional parameters
 * 
 * @memberOf [App]
 */
export type Subscription<State = any> = [SubscriptionFunc<State, any, any>, any];

/** The result of an action.
 *
 * @memberOf [App]
 */
export type ActionResultWithEffects<State, AcceptDPayload> = State | [State, ...Effect<State, AcceptDPayload>[]];

/** The interface for a single action implementation. (without effect)
 *
 * @memberOf [App]
 */
export type Action<State, Payload = void> = (state: State, data: Payload) => State;

/** The interface for a single action implementation.
 *
 * @memberOf [App]
 */
export type ActionWithEffects<State, Payload, AcceptDPayload> = (state: State, data: Payload) => ActionResultWithEffects<State, AcceptDPayload>;

/** The interface for a single action implementation, make strict for `init` (given state are always undefined)
 *
 * @memberOf [App]
 */
export type ActionOnInit<State, Payload = void> = (state: undefined, data: Payload) => ActionResultWithEffects<State, any>;

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
export type SubscriptionsResult<State> = | (Subscription<State> | boolean)[] | Subscription<State>;

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

// e.g.) onchange, onupdate, oninput, ...
//
type EventKeys = keyof GlobalEventHandlers;

// <div onclick={A} title={B} />
//   -> A: Dispatchable<any>  B: any
//
type JSXAttribute = Partial<{ [key in EventKeys]: Dispatchable<any> }> & { [key: string]: any };

// /** @namespace [JSX] */
declare global {
    namespace JSX {
        interface Element extends VNode<any> { }
        interface IntrinsicElements {
            [elemName: string]: JSXAttribute;
        }
    }
}