import { Subscription, Effect, Action, Dispatchable } from "hyperapp";

declare function onMouseEnter<S>(action: Dispatchable<S, Event>): Subscription<S>;
declare function onMouseLeave<S>(action: Dispatchable<S, Event>): Subscription<S>;
declare function onMouseMove<S>(action: Dispatchable<S, Event>): Subscription<S>;
declare function onMouseOut<S>(action: Dispatchable<S, Event>): Subscription<S>;
declare function onMouseOver<S>(action: Dispatchable<S, Event>): Subscription<S>;
declare function onMouseUp<S>(action: Dispatchable<S, Event>): Subscription<S>;

declare var preventDefault: Effect<any, Event>;
declare var stopPropagation: Effect<any, Event>;