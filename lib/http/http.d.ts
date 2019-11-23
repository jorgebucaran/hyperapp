export declare function request<S extends hyperappSubset.AnyState>(props: RequestProps<S>): hyperappSubset.Effect<S>;

type RequestProps<S extends hyperappSubset.AnyState> =
    JsonRequestProps<S> | TextRequestProps<S> | FormDataRequestProps<S> | BlobRequestProps<S> | ArrayBufferRequestProps<S>;

interface RequestPropsBase<S extends hyperappSubset.AnyState> {
    url: Parameters<typeof fetch>[0];
    options?: Parameters<typeof fetch>[1];
}

interface JsonRequestProps<S extends hyperappSubset.AnyState> extends RequestPropsBase<S> {
    expect?: 'json';
    action: hyperappSubset.Dispatchable<S, any>;
}
interface TextRequestProps<S extends hyperappSubset.AnyState> extends RequestPropsBase<S> {
    expect: 'text';
    action: hyperappSubset.Dispatchable<S, string>;
}
interface FormDataRequestProps<S extends hyperappSubset.AnyState> extends RequestPropsBase<S> {
    expect: 'formData';
    action: hyperappSubset.Dispatchable<S, FormData>;
}
interface BlobRequestProps<S extends hyperappSubset.AnyState> extends RequestPropsBase<S> {
    expect: 'blob';
    action: hyperappSubset.Dispatchable<S, Blob>;
}
interface ArrayBufferRequestProps<S extends hyperappSubset.AnyState> extends RequestPropsBase<S> {
    expect: 'arrayBuffer';
    action: hyperappSubset.Dispatchable<S, ArrayBuffer>;
}


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