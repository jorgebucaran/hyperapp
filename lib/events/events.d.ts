type EventArgument<E extends keyof GlobalEventHandlers> = Parameters<NonNullable<GlobalEventHandlers[E]>>[0];

export declare function onMouseEnter<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseenter'>>): hyperappSubset.Subscription<S>;
export declare function onMouseLeave<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseleave'>>): hyperappSubset.Subscription<S>;
export declare function onMouseMove<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmousemove'>>): hyperappSubset.Subscription<S>;
export declare function onMouseOut<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseout'>>): hyperappSubset.Subscription<S>;
export declare function onMouseOver<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseover'>>): hyperappSubset.Subscription<S>;
export declare function onMouseUp<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseup'>>): hyperappSubset.Subscription<S>;
export declare function onTouchStart<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'ontouchstart'>>): hyperappSubset.Subscription<S>;
export declare function onTouchMove<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'ontouchmove'>>): hyperappSubset.Subscription<S>;
export declare function onTouchEnd<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'ontouchend'>>): hyperappSubset.Subscription<S>;
export declare function onKeyDown<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onkeydown'>>): hyperappSubset.Subscription<S>;
export declare function onKeyUp<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onkeyup'>>): hyperappSubset.Subscription<S>;
export declare function onFocus<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onfocus'>>): hyperappSubset.Subscription<S>;
export declare function onBlur<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, EventArgument<'onblur'>>): hyperappSubset.Subscription<S>;

export declare function onAnimationFrame<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, DOMHighResTimeStamp>): hyperappSubset.Subscription<S>;

export declare function eventKey(e: Event): any;
export declare function eventDetail(e: Event): any;
export declare function targetChecked(e: Event): any;
export declare function targetValue(e: Event): any;

export declare function eventOptions<S extends hyperappSubset.AnyState>(props: { preventDefault?: boolean, stopPropagation?: boolean, action?: hyperappSubset.Dispatchable<S, Event> }): hyperappSubset.Effect<S>;
export declare function preventDefault<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, Event>): hyperappSubset.Action<S, Event>;
export declare function stopPropagation<S extends hyperappSubset.AnyState>(action: hyperappSubset.Dispatchable<S, Event>): hyperappSubset.Action<S, Event>;

export declare function dispatchCustomEvent(props: {name: string}): hyperappSubset.Action<any>;
export declare function createOnCustomEvent(eventName: string): hyperappSubset.Subscription<any>;

declare namespace hyperappSubset {
    type AnyState = boolean | string | number | object | symbol | null | undefined;

    type PayloadCreator<DPayload, CPayload> = ((data: DPayload) => CPayload);

    type Dispatchable<State extends AnyState, DPayload = void, CPayload = any> = (
        State
        | [State, ...Effect<State>[]]
        | ([Action<State, CPayload>, PayloadCreator<DPayload, CPayload>])
        | ([Action<State, CPayload>, CPayload])
        | Action<State, void>      // (state) => ({ ... }) | (state) => ([{ ... }, effect1, ...])
        | Action<State, DPayload>  // (state, data) => ({ ... })  | (state, data) => ([{ ... }, effect1, ...])
    );

    type Dispatch<State extends AnyState, NextPayload> = (obj: Dispatchable<State, NextPayload>, data: NextPayload) => State;

    interface EffectRunner<State extends AnyState = AnyState, NextPayload = void, Props = void> {
        (dispatch: Dispatch<State, NextPayload>, props: Props): void;
    }
    
    type Effect<State extends AnyState = AnyState> = [EffectRunner<State, any, any>, any] | [EffectRunner<State, any, void>];

    interface SubscriptionRunner<State extends AnyState = AnyState, NextPayload = void, Props = void> {
        (dispatch: Dispatch<State, NextPayload>, props: Props): (() => void);
    }
    
    type Subscription<State extends AnyState = AnyState> = [SubscriptionRunner<State, any, any>, any] | [SubscriptionRunner<State, any, void>];

    interface Action<State extends AnyState, Payload = void> {
        (state: State, data: Payload): Dispatchable<State>;
    }
}