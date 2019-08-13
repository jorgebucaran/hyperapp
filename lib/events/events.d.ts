import { Subscription, Effect, Action, Dispatchable, ActionWithEffects } from "hyperapp";

declare function onMouseEnter<S>(action: Dispatchable<S>): Subscription<S>;
declare function onMouseLeave<S>(action: Dispatchable<S>): Subscription<S>;
declare function onMouseMove<S>(action: Dispatchable<S>): Subscription<S>;
declare function onMouseOut<S>(action: Dispatchable<S>): Subscription<S>;
declare function onMouseOver<S>(action: Dispatchable<S>): Subscription<S>;
declare function onMouseUp<S>(action: Dispatchable<S>): Subscription<S>;
declare function onTouchStart<S>(action: Dispatchable<S>): Subscription<S>;
declare function onTouchMove<S>(action: Dispatchable<S>): Subscription<S>;
declare function onTouchEnd<S>(action: Dispatchable<S>): Subscription<S>;
declare function onKeyDown<S>(action: Dispatchable<S>): Subscription<S>;
declare function onKeyUp<S>(action: Dispatchable<S>): Subscription<S>;
declare function onFocus<S>(action: Dispatchable<S>): Subscription<S>;
declare function onBlur<S>(action: Dispatchable<S>): Subscription<S>;

declare function eventKey(e: Event): any;
declare function targetChecked(e: Event): any;
declare function targetValue(e: Event): any;

declare function eventOptions<S>(props: { preventDefault?: boolean, stopPropagation?: boolean, action?: Dispatchable<S, Event> }): Effect<S, Event>;
declare function preventDefault<S, DPayload, CPayload>(action: Dispatchable<S, DPayload>): ActionWithEffects<S, CPayload, DPayload>;
declare function stopPropagation<S, DPayload, CPayload>(action: Dispatchable<S, DPayload>): ActionWithEffects<S, CPayload, DPayload>;