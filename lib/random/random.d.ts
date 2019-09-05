type GeneratorFunction<R> = (value: number) => R;
type TupleGeneratorResult<T extends any[]> = { [K in keyof T]: GeneratorFunction<T[K]> };

export declare function generate<S, R extends any[]>(action: hyperappSubset.Dispatchable<S, R>, generator: TupleGeneratorResult<R>): hyperappSubset.Effect<S>;
export declare function generate<S, R>(action: hyperappSubset.Dispatchable<S, R>, generator: GeneratorFunction<R>): hyperappSubset.Effect<S>;

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