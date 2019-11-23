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
 * Possibles state types (all except Array and Function)
 */
export type AnyState = boolean | string | number | object | symbol | null | undefined;

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
export type Dispatchable<State extends AnyState, DPayload = void, CPayload = any> = (
    State
    | [State, ...Effect<State>[]]
    | ([Action<State, CPayload>, PayloadCreator<DPayload, CPayload>])
    | ([Action<State, CPayload>, CPayload])
    | Action<State, void>      // (state) => ({ ... }) | (state) => ([{ ... }, effect1, ...])
    | Action<State, DPayload>  // (state, data) => ({ ... })  | (state, data) => ([{ ... }, effect1, ...])
);

/** Usable to 1st argument of `dispatch`. make strict for `init` (initial state and default payload are always undefined)
 *
 * @memberOf [App]
 */
export type DispatchableOnInit<State extends AnyState, CPayload = any> = (
    State
    | [State, ...Effect<State>[]]
    | ([ActionOnInit<State, CPayload>, CPayload])
    | ActionOnInit<State, void> 
);

/** A definition of `dispatch`. This is passed as an argument of effect or subscription runner.
 * 
 * @memberOf [App]
 */
type Dispatch<State extends AnyState, NextPayload> = (obj: Dispatchable<State, NextPayload>, data: NextPayload) => State;


/** An effect runner. It is actually invoked when effect is reflected.
 * 
 * @memberOf [App]
 */
export interface EffectRunner<State extends AnyState = AnyState, NextPayload = void, Props = void> {
    (dispatch: Dispatch<State, NextPayload>, props: Props): void;
}

/** An effect as the result of an action.
 * 
 * @memberOf [App]
 */
export type Effect<State extends AnyState = AnyState> = [EffectRunner<State, any, any>, any] | [EffectRunner<State, any, void>];

/** An subscription runner. It is actually invoked when effect is reflected.
 * 
 * @memberOf [App]
 */
export interface SubscriptionRunner<State extends AnyState = AnyState, NextPayload = void, Props = void> {
    (dispatch: Dispatch<State, NextPayload>, props: Props): (() => void);
}

/** A reference to an subscription to be managed by Hyperapp, with optional additional parameters
 * 
 * @memberOf [App]
 */
export type Subscription<State extends AnyState = AnyState> = [SubscriptionRunner<State, any, any>, any] | [SubscriptionRunner<State, any, void>];

/** The interface for a single action implementation.
 *
 * @memberOf [App]
 */
export interface Action<State extends AnyState, Payload = void> {
    (state: State, data: Payload): Dispatchable<State>;
}

/** The interface for a single action implementation, make strict for `init` (given state are always undefined)
 *
 * @memberOf [App]
 */
export interface ActionOnInit<State extends AnyState, Payload = void> {
    (state: undefined, data: Payload): DispatchableOnInit<State>;
}

/** The view function describes the application UI as a tree of VNodes.
 * @returns A VNode tree.
 * @memberOf [App]
 */
export interface View<State extends AnyState> {
    (state: State): VNode | null;
}

/** The possible response types for the subscription callback for an application
 * 
 * @memberOf [App]
 */
export type SubscriptionsResult<State extends AnyState> = (Subscription<State> | Falsy)[] | Subscription<State> | Falsy;

type Falsy = false | '' | 0 | null | undefined;

/** The lazy view. {@link https://github.com/jorgebucaran/hyperapp/issues/721#issuecomment-402150041}
 *
 * @memberOf [App]
 */
export function Lazy<P extends object>(props: { view: (props: P) => VNode | null, key?: string | number | null } & P): VNode;

/** The set of properties that define a Hyperapp application.
 * 
 * @memberOf [App]
 */
export interface AppProps<State extends AnyState> {
    init?: DispatchableOnInit<State>;
    view?: View<State>;
    node: Element;
    subscriptions?: (state: State) => SubscriptionsResult<State>;
    middleware?: Middleware<State>;
}

/** The middleware function.
 * 
 * @memberOf [App]
 */
export type MiddlewareFunc<State extends AnyState = AnyState> = (action: Dispatchable<State>, props: unknown) => void;

/** The middleware.
 *
 * @memberOf [App]
 */
export type Middleware<State extends AnyState = AnyState> = (func: MiddlewareFunc<State>) => MiddlewareFunc<State>;

/** The app() call creates and renders a new application.
 *
 * @param state The state object.
 * @param actions The actions object implementation.
 * @param view The view function.
 * @param container The DOM element where the app will be rendered to.
 * @returns The actions wired to the application.
 * @memberOf [App]
 */
export function app<State extends AnyState>(app: AppProps<State>): void

/**
 * The class attribute value of VNode.
 *
 * @memberOf [VDOM]
 */
export type ClassAttribute = ClassAttributeItem | null | undefined;

type ClassAttributeItem = (string | { [key: string]: any } | ClassAttributeArray);

interface ClassAttributeArray extends Array<ClassAttributeItem> { }

/**
 * The style attribute value of VNode.
 *
 * @memberOf [VDOM]
 */
export type StyleAttribute = { [key: string]: any } | null | string | undefined;

// e.g.) onchange, onupdate, oninput, ...
//
type EventKeys = keyof GlobalEventHandlers;

type EventParameterType<Key extends EventKeys> = Parameters<Exclude<GlobalEventHandlers[Key], null>>[0];

// <div onclick={A} />
//   -> A: Dispatchable<any, MouseEvent>
//
type EventAttributes = Partial<{ [key in EventKeys]: Dispatchable<AnyState, EventParameterType<key>> }>;

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