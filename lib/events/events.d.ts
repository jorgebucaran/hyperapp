import { Subscription, Effect, Action, Dispatchable, ActionWithEffects } from "hyperapp";

type EventArgument<E extends keyof GlobalEventHandlers> = Parameters<NonNullable<GlobalEventHandlers[E]>>[0];

declare function onMouseEnter<S>(action: Dispatchable<S, EventArgument<'onmouseenter'>>): Subscription<S>;
declare function onMouseLeave<S>(action: Dispatchable<S, EventArgument<'onmouseleave'>>): Subscription<S>;
declare function onMouseMove<S>(action: Dispatchable<S, EventArgument<'onmousemove'>>): Subscription<S>;
declare function onMouseOut<S>(action: Dispatchable<S, EventArgument<'onmouseout'>>): Subscription<S>;
declare function onMouseOver<S>(action: Dispatchable<S, EventArgument<'onmouseover'>>): Subscription<S>;
declare function onMouseUp<S>(action: Dispatchable<S, EventArgument<'onmouseup'>>): Subscription<S>;
declare function onTouchStart<S>(action: Dispatchable<S, EventArgument<'ontouchstart'>>): Subscription<S>;
declare function onTouchMove<S>(action: Dispatchable<S, EventArgument<'ontouchmove'>>): Subscription<S>;
declare function onTouchEnd<S>(action: Dispatchable<S, EventArgument<'ontouchend'>>): Subscription<S>;
declare function onKeyDown<S>(action: Dispatchable<S, EventArgument<'onkeydown'>>): Subscription<S>;
declare function onKeyUp<S>(action: Dispatchable<S, EventArgument<'onkeyup'>>): Subscription<S>;
declare function onFocus<S>(action: Dispatchable<S, EventArgument<'onfocus'>>): Subscription<S>;
declare function onBlur<S>(action: Dispatchable<S, EventArgument<'onblur'>>): Subscription<S>;

declare function eventKey(e: Event): any;
declare function targetChecked(e: Event): any;
declare function targetValue(e: Event): any;

declare function eventOptions<S>(props: { preventDefault?: boolean, stopPropagation?: boolean, action?: Dispatchable<S, Event> }): Effect<S, Event>;
declare function preventDefault<S, CPayload>(action: Dispatchable<S, Event>): ActionWithEffects<S, CPayload, Event>;
declare function stopPropagation<S, CPayload>(action: Dispatchable<S, Event>): ActionWithEffects<S, CPayload, Event>;