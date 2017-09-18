export as namespace Hyperapp

/** @namespace [Virtual DOM] */

/** The Virtual DOM representation of an Element
 *
 * @memberOf [Virtual DOM]
*/
export interface VirtualNode<Data> {
  tag: string
  data: Data
  children: VirtualNodeChild<{} | null>[]
}

/** In the Virtual DOM a Child could be either a Virtual Node or a string
 *
 * @memberOf [Virtual DOM]
*/
export type VirtualNodeChild<Data> = VirtualNode<Data> | string

export interface Component<Data> {
  /** A Component is a function that return a custom Virtual Node
   *
   * @memberOf [Virtual DOM]
  */
  (data: Data, children: VirtualNodeChild<{} | null>[]): VirtualNode<Data>
}

/** The soft way to create a Virtual Node
 * @param tag       Either a tag name e.g. 'div'. Or a Component function
 * @param data      Any valid HTML atributes, events, styles, and meta data
 * @param children  The children of the VirtualNode
 *
 * @memberOf [Virtual DOM]
*/
export function h<Data>(
  tag: Component<Data> | string,
  data?: Data,
  children?:
    | VirtualNodeChild<{} | null>[]
    | VirtualNodeChild<{} | null>
    | number
): VirtualNode<Data>

/** @namespace [Application] */

export interface State {}

export interface Thunk {
  (update: Function): any | null | void
}

export type ActionsResult<State extends Hyperapp.State> =
  | Partial<State>
  | Thunk
  | {}
  | null
  | void

export type VirtualActions<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> = {
  [P in keyof Actions]: (
    data: any
  ) => ActionsResult<State> | VirtualActions<State, Actions>
}

export interface Actions<State extends Hyperapp.State> {
  [action: string]:
    | Actions<State>
    | ((
        state: State,
        actions: VirtualActions<State, Actions<State>>,
        data: any
      ) => ActionsResult<State>)
}

export interface VirtualEvents<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> {
  [action: string]: (
    state: State,
    actions: VirtualActions<State, Actions>,
    data: any
  ) => any
}

export interface Events<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> {
  load?: (
    state: State,
    actions: VirtualActions<State, Actions>
  ) => void
  resolve?: (
    state: State,
    actions: VirtualActions<State, Actions>,
    result: ActionsResult<State>
  ) => ActionsResult<State>
}

export interface View<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>
> {
  (state: State, actions: VirtualActions<State, Actions>): VirtualNode<{}>
}

export interface Mixin<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>,
  Events extends Hyperapp.Events<State, Actions>
> {
  (): Application<State, Actions, Events>
  (): (
    emit: Emit<State, Actions, Events>
  ) => Application<State, Actions, Events>
}

export interface Application<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>,
  Events extends Hyperapp.Events<State, Actions>
> {
  state?: State
  actions?: Actions
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
   * @memberOF [Application]
  */
  (name: keyof Events, data?: any): any
}

export function app<
  State extends Hyperapp.State,
  Actions extends Hyperapp.Actions<State>,
  Events extends Hyperapp.Events<State, Actions>
>(app: Application<State, Actions, Events>): Emit<State, Actions, Events>

/** @namespace [JSX] */

declare global {
  namespace JSX {
    interface Element<Data> extends VirtualNode<Data> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
