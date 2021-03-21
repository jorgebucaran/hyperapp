// @ts-check

// NOTE: JSDoc doesn't yet let you define type defaults for generics:
// https://github.com/microsoft/TypeScript/issues/29401

/**
 * @template S, P
 * @typedef { import("hyperapp").Action<S, P> } Action
 */

/**
 * @template S
 * @typedef { import("hyperapp").App<S> } App
 */

/**
 * @template S
 * @typedef { import("hyperapp").Dispatch<S> } Dispatch
 */

/**
 * @template S, D
 * @typedef { import("hyperapp").Effect<S, D> } Effect
 */

/**
 * @template S, D
 * @typedef { import("hyperapp").RunnerDescriptor<S, D> } RunnerDescriptor
 */

/**
 * @template S
 * @typedef { import("hyperapp").StateFormat<S> } StateFormat
 */

import { app, h, text } from "hyperapp"
import { delay } from "../../../packages/time/index.js"

// The following are erroneous:
//
// app()
// app(true)
// app(false)
// app(0)
// app(2424)
// app(-123)
// app(-Infinity)
// app(Infinity)
// app(NaN)
// app("")
// app("hi")
// app({})
// app(new Set())
// app([])
// app(Symbol())
// app(() => { })
// app(null)
// app(undefined)

// -----------------------------------------------------------------------------

/** @typedef {{ bar?: number, foo: number }} Test */
/** @typedef {(props: App<Test>) => void} AppTest */

/**
 * @template S
 * @param {Dispatch<S>} dispatch
 * @returns {void}
 */
const runTestFx = (dispatch) => console.log("test")

/** @type {Effect<Test, any>} */
const testFx = () => [runTestFx, undefined]

app({
  init: /** @type Test */({ foo: 2 }),
  view: (state) => h("p", {}, [text(state.bar ?? "")]),
  node: document.body
})

;/** @type {(props: App<Test>) => void} */
(app)({
  init: { foo: 2 },
  view: (state) => h("p", {}, [text(state.bar ?? "")]),
  node: document.body
})

app({
  init: [/** @type Test */({ foo: 2 })],
  view: (state) => h("p", {}, [text(state.bar ?? "")]),
  node: document.body
})

;/** @type {AppTest} */
(app)({
  init: [{ foo: 2 }],
  view: (state) => h("p", {}, [text(state.bar ?? "")]),
  node: document.body
})

;/** @type {AppTest} */
(app)({
  init: [{ foo: 2 }, testFx()],
  view: (state) => h("p", {}, [text(state.bar ?? "")]),
  node: document.body
})

;/** @type {AppTest} */
(app)({
  init: { foo: 2 },
  view: (state) => h("div", {}, [
    text(state.foo),
    text(state.bar ?? ""),
    h("button", {
      onclick: (state) => ({ ...state, bar: state.foo * 2 })
    }, [text("clicky")]),
  ]),
  node: document.body
})

;/** @type {AppTest} */
(app)({
  init: { foo: 2 },
  view: (state) => h("div", {}, [
    text(state.foo),
    text(state.bar ?? ""),
    h("button", {
      onclick: (state) => ({ ...state, bar: state.foo * 2 }),
      onchange: (state, event) => {
        if (!event) return state
        const target = /** @type {HTMLInputElement} */(event.target)
        return ({ ...state, bar: target.checked ? 20 : 10 })
      },
    }, [text("clicky")]),
  ]),
  node: document.body
})

// -----------------------------------------------------------------------------

;/** @type {AppTest} */
(app)({
  init: { foo: 2 },
  view: (state) => h("p", {}, [text(state.foo)]),
  node: document.body,
  middleware: (dispatch) => dispatch
})

;/** @type {AppTest} */
(app)({
  init: { foo: 2 },
  view: (state) => h("p", {}, [text(state.foo)]),
  node: document.body,
  middleware: (dispatch) => (action, props) => {
    console.log(action)
    console.log(props)
    dispatch(action, props)
  }
})

// -----------------------------------------------------------------------------

;/** @type {AppTest} */
(app)({
  init: [{ foo: 2 }, /** @type any */(delay)(2000, { foo: 3 })],
  view: (state) => h("main", {}, []),
  node: document.body,
})

// -----------------------------------------------------------------------------

/**
 * @template S
 * @param {Dispatch<S>} dispatch
 * @param {any} props
 * @returns {void}
 */
const myTimeout = (dispatch, props) => {
  setTimeout(() => dispatch(props.action), props.delay)
}

/**
 * @template S
 * @param {number} delay
 * @param {StateFormat<S> | Action<S, any>} action
 * @returns {RunnerDescriptor<S, any>}
 */
const myDelay = (delay, action) =>
  [myTimeout, { delay, action }]

/** @type {Action<Test, any>} */
const IncrementFoo = (state) =>
  ({ ...state, foo: state.foo + 1 })

;/** @type {AppTest} */
(app)({
  init: [{ foo: 2 }, myDelay(2000, { foo: 3 })],
  view: (state) => h("main", {}, []),
  node: document.body,
})

;/** @type {AppTest} */
(app)({
  init: [{ foo: 2 }, myDelay(2000, IncrementFoo)],
  view: (state) => h("main", {}, []),
  node: document.body,
})

;/** @type {AppTest} */
(app)({
  init: (state) => [{ foo: 2 }, myDelay(200, IncrementFoo)],
  view: (state) => h("main", {}, []),
  node: document.body,
})
