export as namespace Hyperapp

/** @namespace [VDOM] */

/** 
 * The VDOM representation of an Element.
 *
 * @memberOf [VDOM]
 */
export interface VNode<Props> {
  name: string
  props: Props
  children: VNodeChild<object | null>[]
}

/** 
 * In the VDOM a Child can be either a VNode or a string.
 *
 * @memberOf [VDOM]
 */
export type VNodeChild<Props = object> = VNode<Props> | string

/** 
 * A Component is a function that returns a custom VNode.
 *
 * @memberOf [VDOM]
 */
export interface Component<Props> {
  (props: Props, children: VNodeChild<object | null>[]): VNode<object>
}

/** 
 * The type of the children argument passed to h().
 *
 * @memberOf [VDOM]
 */
export type VNodeChildren =
  | Array<VNodeChild<object | null> | number>
  | VNodeChild<object | null>
  | number

/** 
 * The soft way to create a VNode.
 * @param name      An element name or a Component function
 * @param props     Any valid HTML atributes, events, styles, and meta data
 * @param children  The children of the VNode
 * @returns A VNode tree.
 *
 * @memberOf [VDOM]
 */
export function h<Props>(
  name: Component<Props> | string,
  props?: Props,
  children?: VNodeChildren
): VNode<object>

/** @namespace [App] */

/** 
 * Type to describe a nested map of type T
 * 
 * example: { 'foo' : { 'bar': 1 }, 'baz': '' }
 */
type NestedMap<T> = {
  [key: string]: NestedMap<T> | T
}

/** 
 * Type alias to proxy UnwiredActions to WiredActions.
 */
type ActionProxy<
  TState extends StateType,
  TActions extends UnwiredActions<TState, TActions>
> = { [P in keyof TActions]: WiredAction<TState, any> }

/** 
 * Type to describe anything that's not a function or object
 */
export type Primitive = string | number | boolean | null | undefined | any[]

/** 
 * The result of an action.
 *
 * @memberOf [App]
 */
export type ActionResult<TState extends Primitive | NestedMap<Primitive>> =
  | Partial<TState>
  | Promise<any>
  | null
  | void

/** 
 * The view function describes the application UI as a tree of VNodes.
 * @returns A VNode tree.
 * @memberOf [App]
 */
export interface View<
  TState extends StateType,
  TActions extends WiredActions<TState, TActions>
> {
  (state: TState, actions: TActions): VNode<any>
}

/** 
 * The app() call creates and renders a new application.
 *
 * @param state The state object.
 * @param actions The actions object implementation.
 * @param view The view function.
 * @param container The DOM element where the app will be rendered to.
 * @returns The actions wired to the application.
 */
export declare const app: App

/**
 * The interface for app(). Use this for implementing Higher Order App's
 */
export interface App {
  <TState extends StateType, TActions extends UnwiredActions<TState, TActions>>(
    state: TState,
    actions: TActions,
    view: View<TState, ActionProxy<TState, TActions>>,
    container: HTMLElement | null
  ): ActionProxy<TState, TActions>
}

/** 
 * The type of action that's been returned from app()
 * 
 * This action is also passed as second parameter to the function that's 
 * returned from unwired actions.
 */
type WiredAction<
  TState extends Primitive | NestedMap<Primitive>,
  TPayload extends Primitive | NestedMap<Primitive> = any
> = (data?: TPayload) => TState

/** 
 * The action that's being passed as second param in an object to app(). 
 * Use this when implementing your actions.
 */
export type UnwiredAction<
  TState extends StateType,
  TActions extends UnwiredActions<TState, TActions>,
  TPayload extends Primitive | NestedMap<Primitive> = any
> = (
  data?: TPayload
) =>
  | ((
      state: TState,
      actions: ActionProxy<TState, TActions>
    ) => ActionResult<TState>)
  | ActionResult<TState>

/** 
 * Convenience type for defining initial State. 
 * Extend your state object from this interface.
 */
export interface StateType extends NestedMap<Primitive> {}

/** 
 * Convenience type for defining your Actions.
 * Extend your actions object from this interface.
 */
interface UnwiredActions<
  TState extends StateType,
  TActions extends UnwiredActions<TState, ActionProxy<TState, TActions>>
> extends NestedMap<UnwiredAction<TState, ActionProxy<TState, TActions>>> {}

/**
 * Convenience type for NestedMap<WiredAction>
 */
interface WiredActions<
  TState extends StateType,
  TActions extends UnwiredActions<TState, TActions>
> extends NestedMap<WiredAction<any, TState>> {}

/** @namespace [JSX] */
declare global {
  namespace JSX {
    interface Element<Data> extends VNode<object> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
