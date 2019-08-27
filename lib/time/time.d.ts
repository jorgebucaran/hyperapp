import { Subscription, Effect, Action, Dispatchable } from "hyperapp";

export declare function interval<S>(action: Dispatchable<S, number>, props: { delay: number }): Subscription<S>;

export declare function timeout<S>(action: Dispatchable<S>, props: { delay: number }): Effect<S>;