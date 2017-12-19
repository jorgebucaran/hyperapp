export as namespace Hyperapp

/** @namespace [VDOM] */

/** The VDOM representation of an Element
 *
 * @memberOf [VDOM]
 */
export interface VNode<Props> {
  type: string
  props: Props
  children: VNodeChild<object | null>[]
}

/** In the VDOM a Child could be either a VNode or a string
 *
 * @memberOf [VDOM]
 */
export type VNodeChild<Props = object> = VNode<Props> | string

/** A Component is a function that return a custom VNode
 *
 * @memberOf [VDOM]
 */
export interface Component<Props> {
  (props: Props, children: VNodeChild<object | null>[]): VNode<object>
}

/**The type for the children parameter accepted by h().
 *
 * @memberOf [VDOM]
 */
export type VNodeChildren =
  | Array<VNodeChild<object | null> | number>
  | VNodeChild<object | null>
  | number

/** The soft way to create a VNode
 * @param type      A type name or a Component function
 * @param props     Any valid HTML atributes, events, styles, and meta data
 * @param children  The children of the VNode
 *
 * @memberOf [VDOM]
 */
export function h<Props>(
  type: Component<Props> | string,
  props?: Props,
  children?: VNodeChildren
): VNode<object>

/** @namespace [App] */

/** The result of an action.
 *
 * @memberOf [App]
 */
export type ActionResult<State> = Partial<State> | Promise<any> | null | void

/** The interface for a single action implementation.
 *
 * @memberOf [App]
 */
export type ActionType<State, Actions> = (
  data: any
) =>
  | ((state: State, actions: Actions) => ActionResult<State>)
  | ActionResult<State>

/** The interface for actions implementations.
 *
 * @memberOf [App]
 */
export type ActionsType<State, Actions> = {
  [P in keyof Actions]:
    | ActionType<State, Actions>
    | ActionsType<any, Actions[P]>
}

/** The view function.
 *
 * @memberOf [App]
 */
export interface View<State, Actions> {
  (state: State, actions: Actions): VNode<object>
}

/** The app() function, entry point of Hyperapp's API.
 *
 * @param State The full state of the module including sub-modules
 * @param Actions The actions of the module including sub-modules
 *
 * @memberOf [App]
 */
export function app<State, Actions>(
  state: State,
  actions: ActionsType<State, Actions>,
  view?: View<State, Actions>,
  container?: HTMLElement | null
): Actions

/** @namespace [JSX] */

declare global {
  namespace JSX {
    interface Element<Data> extends VNode<object> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
