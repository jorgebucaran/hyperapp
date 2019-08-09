import { Subscription, Effect, Action, Dispatchable } from "hyperapp";

type GeneratorFunction<R> = (value: number) => R;
type TupleGeneratorResult<T extends any[]> = { [K in keyof T]: GeneratorFunction<T[K]> };

export declare function generate<S, R extends any[]>(action: Dispatchable<S, R>, generator: TupleGeneratorResult<R>): Effect<S>;
export declare function generate<S, R>(action: Dispatchable<S, R>, generator: GeneratorFunction<R>): Effect<S>;

export declare function generateTest<S, R extends any[]>(action: Dispatchable<S, R[]>, generator: TupleGeneratorResult<R>): {type: 1, S: S, R: R};
export declare function generateTest<S, R>(action: Dispatchable<S, R>, generator: GeneratorFunction<R>): {type: 2, S: S, R: R};