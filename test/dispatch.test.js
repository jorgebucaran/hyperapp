import { app } from ".."
import { deepEqual } from "testmatrix"

const dispatch = action => {
  let state
  app({
    init: action,
    subscriptions: s => (state = s, [])
  })
  return state
}

export default {
  "dispatch state(object)": [
    {
      test: "sets new app state",
      assert: deepEqual,
      actual: dispatch({ state: true }),
      expected: { state: true }
    }
  ],
  "dispatch action(function)": [
    {
      test: "returns new app state(object) to dispatch",
      assert: deepEqual,
      actual: dispatch(state => ({
        ...state, property: true
      })),
      expected: { property: true }
    },
    {
      test: "returns action(function) to dispatch",
      assert: deepEqual,
      actual: dispatch(state => function action(state){
        return { ...state, action: true }
      }),
      expected: { action: true }
    },
    {
      test: "returns parameterized action(tuple) to dispatch",
      assert: deepEqual,
      actual: dispatch(state => [
        function action(state){
          return { ...state, actionTuple: true }
        }
      ]),
      expected: { actionTuple: true }
    },
    {
      test: "returns effect(tuple) to dispatch",
      assert: deepEqual,
      actual: done => dispatch(state => [
        { ...state },
        [function effect(){ done({ effect: true }) }, {}]
      ]),
      expected: { effect: true }
    }
  ],
  "dispatch parameterized action(tuple)": [
    {
      test: "payload is passed into action",
      assert: deepEqual,
      actual: dispatch([
        function action(state, payload){
          return { ...state, ...payload }
        },
        { params: true }
      ]),
      expected: { params: true }
    },
    {
      test: "payload is decoded",
      assert: deepEqual,
      actual: dispatch([
        function action(state, payload){
          return { ...state, ...payload }
        },
        function decoder(){
          return { decoded: true }
        }
      ]),
      expected: { decoded: true }
    },
    {
      test: "chaining payload decoders",
      assert: deepEqual,
      actual: dispatch([
        [
          [
            function action(state, payload){
              return { ...state, ...payload }
            },
            function decoderC(obj){
              return { ...obj, C: true }
            }
          ],
          function decoderB(obj){
            return { ...obj, B: true }
          }
        ],
        function decoderA(){
          return { A: true }
        }
      ]),
      expected: { A: true, B: true, C: true }
    },
  ],
  "dispatch effect(tuple)": [
    {
      test: "returns new app state",
      assert: deepEqual,
      actual: dispatch([
        { effect: true },
        [function effect(){}, {}]
      ]),
      expected: { effect: true }
    },
    {
      test: "runs effect with params",
      assert: deepEqual,
      actual: dispatch([
        { effect: true },
        [function effect(dispatch, props){
          dispatch(state => ({ ...state, ...props}))
        }, { params: true }]
      ]),
      expected: { effect: true, params: true }
    }
  ]
}