export as namespace Hyperapp

/** @namespace [VDOM] */

/** The VDOM representation of an Element
 *
 * @memberOf [VDOM]
 */
export interface VNode<Props> {
  type: string
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
 * @param type      A tag name or a Component function
 * @param props     Any valid HTML atributes, events, styles, and meta data
 * @param children  The children of the VNode
 *
 * @memberOf [VDOM]
*/
export function h<Props>(
  type: Component<Props> | string,
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

/** Thunk that may be returned by an action.
 *
 * @memberOf [App]
 */
export interface Thunk<State extends Hyperapp.State> {
  (update: Update<State>): {} | null | void
}

/** The result of an action.
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

/**The initialization function, ran after the actions have been initialized.
 * 
 * @memberOf [App]
 */
export interface Init<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> {
  (state: State, actions: Actions): void
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

/** Definition for a single module: a self-contained set of actions that operates on a state tree.
 * 
 * OwnState and OwnActions may be set to ensure that the initial state and all actions are implemented.
 * 
 * @param State The full state of the module including sub-modules
 * @param Actions The actions of the module including sub-modules
 * @param OwnState Optional, if set, the state of this module excluding sub-modules
 *                 defaults to partial state
 * @param OwnActions Optional, if set, the actions of this module excluding sub-modules
 *                   defaults to partial actions
 * 
 * @memberOf [App]
 */
export interface Module<
  State extends Hyperapp.State & Record<keyof Actions, any>,
  Actions extends Hyperapp.Actions<State>,
  OwnState = Partial<State>,
  OwnActions = Partial<Actions>
> {
  state?: OwnState
  actions?: InternalActions<State, OwnActions & Hyperapp.Actions<State>>
  init?: Init<State, Actions>
  modules?: Modules<
    Partial<State> & Record<keyof Partial<Actions>, any>,
    Partial<Actions> & Hyperapp.Actions<State>
  >
}

/** The map of modules indexed by state slice.
 * 
 * @memberOf [App]
 */
export type Modules<
  State extends Hyperapp.State & Record<keyof Actions, any>,
  Actions extends Hyperapp.Actions<State>
> = {
  [A in keyof Actions]?: Module<
    State[A],
    Actions[A] & Hyperapp.Actions<State[A]>
  >
}

/** The props object that serves as an input to app().
 *
 * @param State The full state of the module including sub-modules
 * @param Actions The actions of the module including sub-modules
 * @param OwnState Optional, if set, the state of this module excluding sub-modules
 *                 defaults to partial state
 * @param OwnActions Optional, if set, the actions of this module excluding sub-modules
 *                   defaults to partial actions
 * 
 * @memberOf [App]
 */
export interface AppProps<
  State extends Hyperapp.State & Record<keyof Actions, any>,
  Actions extends Hyperapp.Actions<State>,
  OwnState = Partial<State>,
  OwnActions = Partial<Actions>
> extends Module<State, Actions, OwnState, OwnActions> {
  view?: View<State, Actions>
}

/** The app() function, main entry point of Hyperapp's API.
 *
 * @param State The full state of the module including sub-modules
 * @param Actions The actions of the module including sub-modules
 * @param OwnState Optional, if set, the state of this module excluding sub-modules
 *                 defaults to partial state
 * @param OwnActions Optional, if set, the actions of this module excluding sub-modules
 *                   defaults to partial actions
 * 
 * @memberOf [App]
 */
export function app<
  State extends Hyperapp.State & Record<keyof Actions, any>,
  Actions extends Hyperapp.Actions<State>,
  OwnState = Partial<State>,
  OwnActions = Partial<Actions>
>(
  app: AppProps<State, Actions, OwnState, OwnActions>,
  container?: HTMLElement | null
): Actions

/** @namespace [JSX] */

declare global {
  namespace JSX {
    interface Element<Data> extends VNode<Data> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
