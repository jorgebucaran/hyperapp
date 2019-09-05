// TypeScript Version: 3.0

export as namespace hyperapp;

/** @namespace [VDOM] */

/** The VDOM representation of an Element.
 *
 * @memberOf [VDOM]
 */
export interface VNode {
    name: unknown; // protected (internal implementation)
    props: unknown; // protected (internal implementation)
    children: unknown; // protected (internal implementation)
    node: unknown; // protected (internal implementation)
    type: unknown; // protected (internal implementation)
    key: unknown; // protected (internal implementation)
    lazy: unknown; // protected (internal implementation)
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
    (attributes: Attributes, children: VNode[]): VNode | null;
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
): VNode

/** @namespace [App] */

type PayloadCreator<DPayload, CPayload> = ((data: DPayload) => CPayload);

/** Usable to 1st argument of `dispatch`. Usually, This is a reference to an action to be invoked by Hyperapp, with custom payload
 *
 * @memberOf [App]
 */
export type Dispatchable<State, DPayload = void, CPayload = any> = (
    ([Action<State, CPayload>, PayloadCreator<DPayload, CPayload>])
    | ([Action<State, CPayload>, CPayload])
    | Action<State, void>      // (state) => ({ ... }) | (state) => ([{ ... }, effect1, ...])
    | Action<State, DPayload>  // (state, data) => ({ ... })  | (state, data) => ([{ ... }, effect1, ...])
);

/** Usable to 1st argument of `dispatch`, make strict for `init` (state and default payload are always undefined)
 *
 * @memberOf [App]
 */
export type DispatchableOnInit<State, CPayload = any> = (
    State
    | ([(ActionOnInit<State, CPayload>), PayloadCreator<undefined, CPayload>])
    | ([(ActionOnInit<State, CPayload>), CPayload])
    | ActionOnInit<State, undefined>
);

/** A definition of `dispatch`. This is passed as an argument of effect or subscription runner.
 * 
 * @memberOf [App]
 */
export type Dispatch<State, NextPayload = void> = (obj: Dispatchable<State, NextPayload>, data: NextPayload) => State;


/** An effect runner. It is actually invoked when effect is reflected.
 * 
 * @memberOf [App]
 */
export interface EffectRunner<State, NextPayload, Props> {
    (dispatch: Dispatch<State, NextPayload>, props: Props): void;
}

/** An effect as the result of an action.
 * 
 * @memberOf [App]
 */
export type Effect<State = any> = [EffectRunner<State, any, any>, any];

/** An subscription runner. It is actually invoked when effect is reflected.
 * 
 * @memberOf [App]
 */
export interface SubscriptionRunner<State, NextPayload, Props>{
    (dispatch: Dispatch<State, NextPayload>, props: Props): (() => void);
}

/** A reference to an subscription to be managed by Hyperapp, with optional additional parameters
 * 
 * @memberOf [App]
 */
export type Subscription<State = any> = [SubscriptionRunner<State, any, any>, any];

/** The result of an action. It is new state, new state with effects, action or action with payload.
 *
 * @memberOf [App]
 */
export type ActionResult<State> = (State | [State, ...Effect<State>[]] | Dispatchable<State>);

/** The interface for a single action implementation.
 *
 * @memberOf [App]
 */
export interface Action<State, Payload = void> {
    (state: State, data: Payload): ActionResult<State>;
}

/** The interface for a single action implementation. (return new state only, its return value is reusable and testable)
 *
 * @memberOf [App]
 */
export interface PureAction<State, Payload = void> {
    (state: State, data: Payload): State;
}

/** The interface for a single action implementation, make strict for `init` (given state are always undefined)
 *
 * @memberOf [App]
 */
export interface ActionOnInit<State, Payload = void> {
    (state: undefined, data: Payload): ActionResult<State>;
}

/** The view function describes the application UI as a tree of VNodes.
 * @returns A VNode tree.
 * @memberOf [App]
 */
export interface View<State> {
    (state: State): VNode | null;
}

/** The possible response types for the subscription callback for an application
 * 
 * @memberOf [App]
 */
export type SubscriptionsResult<State> = | (Subscription<State> | boolean)[] | Subscription<State> | boolean;

/** The subscriptions function describes the current application subscriptions.
 * @returns The current subscription(s) given the current state
 * @memberOf [App]
 */
export type Subscriptions<State> = (state: State) => SubscriptionsResult<State>;


/** The lazy view. {@link https://github.com/jorgebucaran/hyperapp/issues/721#issuecomment-402150041}
 *
 * @memberOf [App]
 */
export function Lazy<P extends object>(props: { view: (props: P) => VNode | null, key?: string | number | null } & P): VNode;


/** The set of properties that define a Hyperapp application.
 * 
 * @memberOf [App]
 */
export interface AppProps<State> {
    init?: DispatchableOnInit<State, any>;
    view?: View<State>;
    node: Element;
    subscriptions?: Subscriptions<State>;
    middleware?: Middleware<State>;
}

/** The middleware function.
 * 
 * @memberOf [App]
 */
export type MiddlewareFunc<State = any> = (action: State | Dispatchable<State>, props: unknown) => void;

/** The middleware.
 *
 * @memberOf [App]
 */
export type Middleware<State = any> = (func: MiddlewareFunc<State>) => MiddlewareFunc<State>;

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


/**
 * The class attribute value of VNode.
 *
 * @memberOf [VDOM]
 */
export type ClassAttribute = ClassAttributeItem | null | undefined;

type ClassAttributeItem = (string | { [key: string]: boolean } | ClassAttributeArray);

interface ClassAttributeArray extends Array<ClassAttributeItem> { }

/**
 * The style attribute value of VNode.
 *
 * @memberOf [VDOM]
 */
export type StyleAttribute = { [key: string]: any } | null | undefined;

// e.g.) onchange, onupdate, oninput, ...
//
type EventKeys = keyof GlobalEventHandlers;

type EventParameterType<Key extends EventKeys> = Parameters<Exclude<GlobalEventHandlers[Key], null>>[0];

// <div onclick={A} />
//   -> A: Dispatchable<any, MouseEvent>
//
type EventAttributes = Partial<{ [key in EventKeys]: Dispatchable<any, EventParameterType<key>> }>;

export interface JSXAttribute extends EventAttributes {
    key?: PropertyKey;
    class?: ClassAttribute;
    style?: StyleAttribute;

    [attrName: string]: any;
}

// /** @namespace [JSX] */
declare global {
    namespace JSX {
        interface Element extends VNode { }
        interface IntrinsicElements {
            [elemName: string]: JSXAttribute;
        }
    }
}