type EventArgument<E extends keyof GlobalEventHandlers> = Parameters<NonNullable<GlobalEventHandlers[E]>>[0];

declare function onMouseEnter<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseenter'>>): hyperappSubset.Subscription<S>;
declare function onMouseLeave<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseleave'>>): hyperappSubset.Subscription<S>;
declare function onMouseMove<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmousemove'>>): hyperappSubset.Subscription<S>;
declare function onMouseOut<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseout'>>): hyperappSubset.Subscription<S>;
declare function onMouseOver<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseover'>>): hyperappSubset.Subscription<S>;
declare function onMouseUp<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onmouseup'>>): hyperappSubset.Subscription<S>;
declare function onTouchStart<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'ontouchstart'>>): hyperappSubset.Subscription<S>;
declare function onTouchMove<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'ontouchmove'>>): hyperappSubset.Subscription<S>;
declare function onTouchEnd<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'ontouchend'>>): hyperappSubset.Subscription<S>;
declare function onKeyDown<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onkeydown'>>): hyperappSubset.Subscription<S>;
declare function onKeyUp<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onkeyup'>>): hyperappSubset.Subscription<S>;
declare function onFocus<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onfocus'>>): hyperappSubset.Subscription<S>;
declare function onBlur<S>(action: hyperappSubset.Dispatchable<S, EventArgument<'onblur'>>): hyperappSubset.Subscription<S>;

declare function eventKey(e: Event): any;
declare function targetChecked(e: Event): any;
declare function targetValue(e: Event): any;

declare function eventOptions<S>(props: { preventDefault?: boolean, stopPropagation?: boolean, action?: hyperappSubset.Dispatchable<S, Event> }): hyperappSubset.Effect<S>;
declare function preventDefault<S>(action: hyperappSubset.Dispatchable<S, Event>): hyperappSubset.Action<S, Event>;
declare function stopPropagation<S>(action: hyperappSubset.Dispatchable<S, Event>): hyperappSubset.Action<S, Event>;

declare namespace hyperappSubset {
    type PayloadCreator<DPayload, CPayload> = ((data: DPayload) => CPayload);

    type Dispatchable<State, DPayload = void, CPayload = any> = (
        ([Action<State, CPayload>, PayloadCreator<DPayload, CPayload>])
        | ([Action<State, CPayload>, CPayload])
        | Action<State, void>      // (state) => ({ ... }) | (state) => ([{ ... }, effect1, ...])
        | Action<State, DPayload>  // (state, data) => ({ ... })  | (state, data) => ([{ ... }, effect1, ...])
    );

    type Dispatch<State, NextPayload = void> = (obj: Dispatchable<State, NextPayload>, data: NextPayload) => State;

    interface EffectRunner<State, NextPayload, Props> {
        (dispatch: Dispatch<State, NextPayload>, props: Props): void;
    }

    type Effect<State = any> = [EffectRunner<State, any, any>, any];

    interface SubscriptionRunner<State, NextPayload, Props> {
        (dispatch: Dispatch<State, NextPayload>, props: Props): (() => void);
    }

    type Subscription<State = any> = [SubscriptionRunner<State, any, any>, any];

    type ActionResult<State> = (State | [State, ...Effect<State>[]] | Dispatchable<State>);

    interface Action<State, Payload = void> {
        (state: State, data: Payload): ActionResult<State>;
    }

    type SubscriptionsResult<State> = | (Subscription<State> | boolean)[] | Subscription<State> | boolean;

    type Subscriptions<State> = (state: State) => SubscriptionsResult<State>;
}