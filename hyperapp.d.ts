export as namespace hyperapp

/** @namespace [VDOM] */

/** The VDOM representation of an Element.
 *
 * @memberOf [VDOM]
 */
export interface VNode<Props> {
  name: string
  props: Props
  children: VNodeChild<object | null>[]
}

/** In the VDOM a Child can be either a VNode or a string.
 *
 * @memberOf [VDOM]
 */
export type VNodeChild<Props = object> = VNode<Props> | string

/** A Component is a function that returns a custom VNode.
 *
 * @memberOf [VDOM]
 */
export interface Component<Props> {
  (props: Props, children: VNodeChild<object | null>[]): VNode<object>
}

/** The type of the children argument passed to h().
 *
 * @memberOf [VDOM]
 */
export type VNodeChildren =
  | Array<VNodeChild<object | null> | number>
  | VNodeChild<object | null>
  | number

/** The soft way to create a VNode.
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
  data?: any
) =>
  | ((state: State, actions: Actions) => ActionResult<State>)
  | ActionResult<State>

/** The interface for the actions tree implementation.
 *
 * @memberOf [App]
 */
export type ActionsType<State, Actions> = {
  [P in keyof Actions]:
    | ActionType<State, Actions>
    | ActionsType<any, Actions[P]>
}

/** The view function describes the application UI as a tree of VNodes.
 * @returns A VNode tree.
 * @memberOf [App]
 */
export interface View<State, Actions> {
  (state: State, actions: Actions): VNode<object>
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
export function app<State, Actions>(
  state: State,
  actions: ActionsType<State, Actions>,
  view: View<State, Actions>,
  container: Element | null
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
