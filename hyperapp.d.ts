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

/** The result of an action.
 *
 * @memberOf [App]
 */
export type ActionResult<State> = Partial<State> | Promise<any> | null | void

export type InternalAction<State, Actions> =
  | ((state: State, actions: Actions) => (data: any) => ActionResult<State>)
  | ((state: State, actions: Actions) => ActionResult<State>)

/** The interface for actions (exposed when implementing actions).
 *
 * @memberOf [App]
 */
export type InternalActions<State, Actions, OwnActions = Actions> = {
  [P in keyof OwnActions]:
    | InternalAction<State, Actions>
    | InternalActions<any, any>
}

/** The view function.
 *
 * @memberOf [App]
 */
export interface View<State, Actions> {
  (state: State, actions: Actions): VNode<{}>
}

export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T]

type Sub<A, B> = { [P in keyof A]: A[P] } & { [P in keyof B]: never }

/** Definition for a single module: a self-contained set of actions that operates on a state tree.
 *
 * OwnState and OwnActions may be set to ensure that the initial state and all actions are implemented.
 *
 * @param State The full state of the module including sub-modules
 * @param Actions The actions of the module including sub-modules
 * @param OwnState Optional, if set, the state of this module excluding sub-modules
 *                 defaults to full state
 * @param OwnActions Optional, if set, the actions of this module excluding sub-modules
 *                   defaults to full actions
 *
 * @memberOf [App]
 */
export interface Module<
  State,
  Actions,
  OwnState = State,
  OwnActions = Actions
> {
  state?: OwnState
  actions?: InternalActions<State, Actions, OwnActions>
  // Should be Modules<State - OwnState, Actions - OwnActions> - see https://github.com/Microsoft/TypeScript/issues/4183
  modules?: Modules<any, any>
}

/** The map of modules indexed by state slice.
 *
 * @memberOf [App]
 */
export type Modules<State, Actions> = {
  [S in keyof State]?: Module<State[S], Actions[S & keyof Actions]>
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
  State,
  Actions,
  OwnState = State,
  OwnActions = Actions
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
export function app<State, Actions, OwnState = State, OwnActions = Actions>(
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
