import { Subscription, Effect, Action, Dispatchable } from "hyperapp";

type GeneratorFunction<R> = (value: number) => R;
type TupleGeneratorResult<T extends any[]> = { [K in keyof T]: GeneratorFunction<T[K]> };

export declare function generate<S, R extends any[]>(action: Dispatchable<S>, generator: TupleGeneratorResult<R>): Effect<S>;
export declare function generate<S, R>(action: Dispatchable<S>, generator: GeneratorFunction<R>): Effect<S>;