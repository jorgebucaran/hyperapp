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

export interface Component<Props> {
  /** A Component is a function that return a custom VNode
   *
   * @memberOf [VDOM]
  */
  (props: Props, children: VNodeChild<{} | null>[]): VNode<{}>
}

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

export interface State {}

export interface Thunk {
  (update: Function): any | null | void
}

export type ActionResult<State extends Hyperapp.State> =
  | Partial<State>
  | Thunk
  | {}
  | null
  | void

export interface Action<State extends Hyperapp.State, Data> {
  (data: Data): ActionResult<State>
}

export interface Actions<
  State extends Hyperapp.State & Partial<Record<keyof Actions<State>, any>>
> {
  [action: string]:
    | Actions<State[keyof Action<State, any>]>
    | Action<State, any>
}

export interface InternalAction<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> {
  (state: State, actions: Actions, data: any): ActionResult<State>
}

export type InternalActions<
  State extends Hyperapp.State & Partial<Record<keyof Actions, any>>,
  Actions extends Hyperapp.Actions<State>
> = {
  [P in keyof Actions]:
    | InternalAction<State, Actions>
    | InternalActions<State[P], Actions[P] & Hyperapp.Actions<State[P]>>
}

export interface Events<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> {
  [action: string]:
    | ((state: State, actions: Actions, data: any) => any)
    | undefined
}

export interface DefaultEvents<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> extends Hyperapp.Events<State, Actions> {
  load?: (state: State, actions: Actions) => void
  resolve?: (
    state: State,
    actions: Actions,
    result: ActionResult<State>
  ) => ActionResult<State>
}

export interface View<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> {
  (state: State, actions: Actions): VNode<{}>
}

export interface Mixin<
  State extends Hyperapp.State & Record<keyof Actions, any>,
  Actions extends Hyperapp.Actions<State>,
  Events extends Hyperapp.DefaultEvents<State, Actions>
> {
  (): App<State, Actions, Events>
  (): (emit: Emit<State, Actions, Events>) => App<State, Actions, Events>
}

export interface App<
  State extends Hyperapp.State & Record<keyof Actions, any>,
  Actions extends Hyperapp.Actions<State>,
  Events extends Hyperapp.DefaultEvents<State, Actions>
> {
  state?: State
  actions?: InternalActions<State, Actions>
  events?: Events
  view?: View<State, Actions>
  root?: HTMLElement | null
  mixins?: Mixin<{}, {}, {}>[]
}

export interface Emit<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>,
  Events extends Hyperapp.Events<State, Actions>
> {
  /** Call succesively each event handler of the specified event
   * @param name  The name of the event to call
   * @param data  Will be reduced by each event handler
   *
   * @memberOF [App]
  */
  (name: keyof Events, data?: any): any
}

export function app<
  State extends Hyperapp.State & Record<keyof Actions, any>,
  Actions extends Hyperapp.Actions<State>,
  Events extends Hyperapp.Events<State, Actions>
>(app: App<State, Actions, Events>): Emit<State, Actions, Events>

/** @namespace [JSX] */

declare global {
  namespace JSX {
    interface Element<Data> extends VNode<Data> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
