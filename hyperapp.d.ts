export as namespace Hyperapp

/** @namespace [VDOM] */

/** The VDOM representation of an Element
 *
 * @memberOf [VDOM]
 */
export interface VNode<Props> {
  tag: string
  props: Props
  children: VNodeChild<{} | null>[]
}

/** In the VDOM a Child could be either a VNode or a string
 *
 * @memberOf [VDOM]
 */
export type VNodeChild<Props> = VNode<Props> | string

/** A Component is a function that return a custom VNode
 *
 * @memberOf [VDOM]
 */
export interface Component<Props> {
  /** A Component is a function that return a custom VNode
   *
   * @memberOf [VDOM]
  */
  (props: Props, children: VNodeChild<{} | null>[]): VNode<{}>
}

/**The type for the children parameter accepted by h().
 *
 * @memberOf [VDOM]
 */
export type VNodeChildren =
  | Array<VNodeChild<{} | null> | number>
  | VNodeChild<{} | null>
  | number

/** The soft way to create a VNode
 * @param tag       Either a tag name e.g. 'div'. Or a Component function
 * @param props     Any valid HTML atributes, events, styles, and meta data
 * @param children  The children of the VNode
 *
 * @memberOf [VDOM]
*/
export function h<Props>(
  tag: Component<Props> | string,
  props?: Props,
  children?: VNodeChildren
): VNode<Props>

/** @namespace [App] */

/** The application state.
 *
 * @memberOf [App]
 */
export interface State {}

export interface Update<State extends Hyperapp.State> {
  (value: Partial<State>): void
}

/** Thunk that may be returned bay an action.
 *
 * @memberOf [App]
 */
export interface Thunk<State extends Hyperapp.State> {
  (update: Update<State>): {} | null | void
}

/** Result of an action.
 *
 * @memberOf [App]
 */
export type ActionResult<State extends Hyperapp.State> =
  | Partial<State>
  | Thunk<State>
  | {}
  | null
  | void

/** The interface for a single action (exposed when calling actions).
 *
 * @memberOf [App]
 */
export interface Action<State extends Hyperapp.State, Data> {
  (data: Data): ActionResult<State>
}

/** The interface for actions (exposed when calling actions).
 *
 * @memberOf [App]
 */
export interface Actions<
  State extends Hyperapp.State & Partial<Record<keyof Actions<State>, any>>
> {
  [action: string]:
    | Actions<State[keyof Action<State, any>]>
    | Action<State, any>
}

/** The interface for a single action (exposed when implementing actions).
 *
 * @memberOf [App]
 */
export interface InternalAction<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> {
  (state: State, actions: Actions, data: any): ActionResult<State>
}

/** The interface for actions (exposed when implementing actions).
 *
 * @memberOf [App]
 */
export type InternalActions<
  State extends Hyperapp.State & Partial<Record<keyof Actions, any>>,
  Actions extends Hyperapp.Actions<State>
> = {
  [P in keyof Actions]:
    | InternalAction<State, Actions>
    | InternalActions<State[P], Actions[P] & Hyperapp.Actions<State[P]>>
}

/** The view function.
 *
 * @memberOf [App]
 */
export interface View<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> {
  (state: State, actions: Actions): VNode<{}>
}

/** Input parameter of the app() function.
 *
 * @memberOf [App]
 */
export interface App<
  State extends Hyperapp.State & Record<keyof Actions, any>,
  Actions extends Hyperapp.Actions<State>
> {
  state?: State
  actions?: InternalActions<State, Actions>
  view?: View<State, Actions>
  root?: HTMLElement | null
}

/** The app() function, main entry point of Hyperapp's API.
 *
 * @memberOf [App]
 */
export function app<
  State extends Hyperapp.State & Record<keyof Actions, any>,
  Actions extends Hyperapp.Actions<State>
>(app: App<State, Actions>): Actions

/** @namespace [JSX] */

declare global {
  namespace JSX {
    interface Element<Data> extends VNode<Data> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
