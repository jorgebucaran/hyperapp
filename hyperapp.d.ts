declare module "hyperapp" {

  export interface VNodeData {
    [key: string]: any;
  }

  export interface VNode {
    tag: string;
    data: VNodeData;
    children: string | VNode | Array<VNode>;
  }

  export type viewFunction<State, Actions> = (state: State, actions: Actions) => VNode;
  export type emitFunction<Data> = (event: string, data?: Data) => Data;
  export type vnodeFunction = (props: VNodeData, children: string | VNode | Array<VNode>) => VNode;

  export interface Actions<State> {
    [key: string]: ( (state?: State, actions?: Actions<State>, data?: any, emit?: emitFunction<any>) => Partial<State> | any )
                 | Actions<State>;
  }

  export interface Events<State, ActionsInterface extends Actions<State> | undefined> {
    loaded: ( (state: State, actions: ActionsInterface, data: any, emit: emitFunction<any>) => void )
          | Array< (state: State, actions: ActionsInterface, data: any, emit: emitFunction<any>) => void >;
    action: ( <Data>(state: State, actions: ActionsInterface, data: Data, emit: emitFunction<any>) => Data )
          | Array< <Data>(state: State, actions: ActionsInterface, data: Data, emit: emitFunction<any>) => Data >;
    update: ( (state: State, actions: ActionsInterface, data: State, emit: emitFunction<any>) => State )
          | Array< (state: State, actions: ActionsInterface, data: State, emit: emitFunction<any>) => State >;
    render: ( (state: State, actions: ActionsInterface, view: viewFunction<State, ActionsInterface>, emit: emitFunction<any>) => viewFunction<State, ActionsInterface> )
          | Array<(state: State, actions: ActionsInterface, view: viewFunction<State, ActionsInterface>, emit: emitFunction<any>) => viewFunction<State, ActionsInterface>>;

    // [key: string]:( <Data>(state: State, actions: ActionsInterface, data: Data, emit: emitFunction<any>) => Data )
    //      | Array< <Data>(state: State, actions: ActionsInterface, data: Data, emit: emitFunction<any>) => Data >;
  }

  export interface Mixin<State, ActionsInterface extends Actions<State> | undefined, EventsInterface extends Partial<Events<State, ActionsInterface>> | undefined> {
    state: State;
    actions: ActionsInterface;
    events: EventsInterface;
    mixins: Array< Partial<Mixin<State, ActionsInterface, EventsInterface>> >;
  }

  export interface Application<State, ActionsInterface extends Actions<State> | undefined, EventsInterface extends Partial<Events<State, ActionsInterface>> | undefined> extends Partial<Mixin<State, ActionsInterface, EventsInterface>> {
    root: HTMLElement;
    view: viewFunction<State, ActionsInterface>;
  }

  export function h(tag: string | vnodeFunction, data?: VNodeData, children?: Array<number | string | VNode>): VNode;
  export function h(tag: string | vnodeFunction, data?: VNodeData, ...children: Array<number | string | VNode >): VNode;

  export function app<State, ActionsInterface extends Actions<State> | undefined, EventsInterface extends Partial<Events<State, ActionsInterface>> | undefined>(props: Partial<Application<State, ActionsInterface, EventsInterface>>): emitFunction<any>;

}
