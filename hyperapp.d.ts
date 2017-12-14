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
  (props: Props, children: VNodeChild<{} | null>[]): VNode<{}>
}

/** The type for the children parameter accepted by h().
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
  tag: Component<Props> | string,
  props?: Props,
  children?: VNodeChildren
): VNode<Props>

/** @namespace [App] */

/** The interface for a model.
 *
 * @param State The state tree
 * @param Actions The actions tree
 *
 * @memberOf [App]
 */

export interface Model<State, Actions> {
  state?: State
  actions?: Actions
}

/** The result of an action.
 *
 * @memberOf [App]
 */
export type ActionResult<State> = Partial<State> | Promise<any> | null | void

export type Action<State, Actions> = (
  data: any
) => (state: State, actions: Actions) => ActionResult<State>

// export type Action<State, Actions> = (
//   data: any,
//   state: State,
//   actions: Actions
// ) => ActionResult<State>

/** The view function.
 *
 * @memberOf [App]
 */
export type View<Model> = (model: Model) => VNode<{}>


/** The app() function, entry point of Hyperapp's API.
 *
 * @param State The full state of the module including sub-modules
 * @param Actions The actions of the module including sub-modules
 *
 * @memberOf [App]
 */
export function app<Model>(
  model: Model,
  view?: View<Model>,
  container?: HTMLElement | null
): Model

/** @namespace [JSX] */

declare global {
  namespace JSX {
    interface Element<Data> extends VNode<Data> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
