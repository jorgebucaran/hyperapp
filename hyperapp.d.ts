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

/** An effect as the result of an ation
 * 
 * @memberOf [App]
 */
export type Dispatch<State> = <Data = {}, Props=void>(obj: Action<State, Data, Props> | State, data: Data) => void;


/** An effect as the result of an ation
 * 
 * @memberOf [App]
 */
export type EffectFunc<State, Props, Result = void> = (props: Props, dispatch: Dispatch<State>) => Result;

/** An effect as the result of an ation
 * 
 * @memberOf [App]
 */
export type Effect<State, Props> = [EffectFunc<State, Props>, Props];

/** The result of an action.
 *
 * @memberOf [App]
 */
export type ActionResult<State> = State | [State, ...Effect<State, unknown>[]];

/** The interface for a single action implementation.
 *
 * @memberOf [App]
 */
export type ActionFunc<State, Data = {}, Props = undefined> =
    Props extends void ? ((state: State, data: Data) => ActionResult<State>) : ((state: State, props: Props, data: Data) => ActionResult<State>);

/** A reference to an action to be invoked by Hyperapp, with optional additional parameters
 * 
 * @memberOf [App]
 */
export type Action<State, Data = {}, Props = undefined> =
    Props extends void ? ActionFunc<State, Data, Props> : [ActionFunc<State, Data, Props>, Props]

/** A reference to an subscription to be managed by Hyperapp, with optional additional parameters
 * 
 * @memberOf [App]
 */
export type Subscription<State, Props = any> = [EffectFunc<State, Props, () => void>, Props];

/**
 * A function used to create a particular subscription.
 * 
 * @memberOf [App]
 */
export type SubscriptionConstructor<State, Props = {}> = (props: Props) => Subscription<State, Props>


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
export interface App<State> {
    init?: (() => State) | State;
    view: View<State>;
    container?: Element;
    subscriptions: Subscriptions<State>;
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
export function app<State>(app: App<State>): void

// /** @namespace [JSX] */

declare global {
    namespace JSX {
        interface Element extends VNode<any> {}
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}
