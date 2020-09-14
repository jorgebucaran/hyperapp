import { h, text } from "hyperapp"

h()             // $ExpectError
h(true)         // $ExpectError
h(false)        // $ExpectError
h(0)            // $ExpectError
h(2424)         // $ExpectError
h(-123)         // $ExpectError
h(-Infinity)    // $ExpectError
h(Infinity)     // $ExpectError
h(NaN)          // $ExpectError
h("")           // $ExpectError
h("hi")         // $ExpectError
h({})           // $ExpectError
h(new Set())    // $ExpectError
h([])           // $ExpectError
h(Symbol())     // $ExpectError
h(() => {})     // $ExpectError
h(null)         // $ExpectError
h(undefined)    // $ExpectError

h(true, {})         // $ExpectError
h(false, {})        // $ExpectError
h(0, {})            // $ExpectError
h(2424, {})         // $ExpectError
h(-123, {})         // $ExpectError
h(-Infinity, {})    // $ExpectError
h(Infinity, {})     // $ExpectError
h(NaN, {})          // $ExpectError
h("", {})           // $ExpectType VDOM<unknown, unknown>
h("hi", {})         // $ExpectType VDOM<unknown, unknown>
h({}, {})           // $ExpectError
h(new Set(), {})    // $ExpectError
h([], {})           // $ExpectError
h(Symbol(), {})     // $ExpectError
h(() => {}, {})     // $ExpectError
h(null, {})         // $ExpectError
h(undefined, {})    // $ExpectError

h("p", true)         // $ExpectError
h("p", false)        // $ExpectError
h("p", 0)            // $ExpectError
h("p", 2424)         // $ExpectError
h("p", -123)         // $ExpectError
h("p", -Infinity)    // $ExpectError
h("p", Infinity)     // $ExpectError
h("p", NaN)          // $ExpectError
h("p", "")           // $ExpectError
h("p", "hi")         // $ExpectError
h("p", {})           // $ExpectType VDOM<unknown, unknown>
h("p", new Set())    // $ExpectError
h("p", [])           // $ExpectError
h("p", Symbol())     // $ExpectError
h("p", () => {})     // $ExpectError
h("p", null)         // $ExpectError
h("p", undefined)    // $ExpectError

h("p", {}, true)         // $ExpectError
h("p", {}, false)        // $ExpectType VDOM<unknown, unknown>
h("p", {}, 0)            // $ExpectError
h("p", {}, 2424)         // $ExpectError
h("p", {}, -123)         // $ExpectError
h("p", {}, -Infinity)    // $ExpectError
h("p", {}, Infinity)     // $ExpectError
h("p", {}, NaN)          // $ExpectError
h("p", {}, "")           // $ExpectError
h("p", {}, "hi")         // $ExpectError
h("p", {}, {})           // $ExpectError
h("p", {}, new Set())    // $ExpectError
h("p", {}, [])           // $ExpectType VDOM<unknown, unknown>
h("p", {}, Symbol())     // $ExpectError
h("p", {}, () => {})     // $ExpectError
h("p", {}, null)         // $ExpectType VDOM<unknown, unknown>
h("p", {}, undefined)    // $ExpectType VDOM<unknown, unknown>

// -----------------------------------------------------------------------------

h("hr", { class: true })         // $ExpectError
h("hr", { class: false })        // $ExpectType VDOM<unknown, unknown>
h("hr", { class: 0 })            // $ExpectError
h("hr", { class: 2424 })         // $ExpectError
h("hr", { class: -123 })         // $ExpectError
h("hr", { class: -Infinity })    // $ExpectError
h("hr", { class: Infinity })     // $ExpectError
h("hr", { class: NaN })          // $ExpectError
h("hr", { class: "" })           // $ExpectType VDOM<unknown, unknown>
h("hr", { class: "hi" })         // $ExpectType VDOM<unknown, unknown>
h("hr", { class: {} })           // $ExpectType VDOM<unknown, unknown>
h("hr", { class: new Set() })    // $ExpectError
h("hr", { class: [] })           // $ExpectType VDOM<unknown, unknown>
h("hr", { class: Symbol() })     // $ExpectError
h("hr", { class: () => {} })     // $ExpectError
h("hr", { class: null })         // $ExpectError
h("hr", { class: undefined })    // $ExpectType VDOM<unknown, unknown>

h("hr", { class: { a: true } })         // $ExpectType VDOM<unknown, unknown>
h("hr", { class: { a: false } })        // $ExpectType VDOM<unknown, unknown>
h("hr", { class: { a: 0 } })            // $ExpectError
h("hr", { class: { a: 2424 } })         // $ExpectError
h("hr", { class: { a: -123 } })         // $ExpectError
h("hr", { class: { a: -Infinity } })    // $ExpectError
h("hr", { class: { a: Infinity } })     // $ExpectError
h("hr", { class: { a: NaN } })          // $ExpectError
h("hr", { class: { a: "" } })           // $ExpectError
h("hr", { class: { a: "hi" } })         // $ExpectError
h("hr", { class: { a: {} } })           // $ExpectError
h("hr", { class: { a: new Set() } })    // $ExpectError
h("hr", { class: { a: [] } })           // $ExpectError
h("hr", { class: { a: Symbol() } })     // $ExpectError
h("hr", { class: { a: () => {} } })     // $ExpectError
h("hr", { class: { a: null } })         // $ExpectError
h("hr", { class: { a: undefined } })    // $ExpectError

h("hr", { class: [true] })         // $ExpectError
h("hr", { class: [false] })        // $ExpectType VDOM<unknown, unknown>
h("hr", { class: [0] })            // $ExpectError
h("hr", { class: [2424] })         // $ExpectError
h("hr", { class: [-123] })         // $ExpectError
h("hr", { class: [-Infinity] })    // $ExpectError
h("hr", { class: [Infinity] })     // $ExpectError
h("hr", { class: [NaN] })          // $ExpectError
h("hr", { class: [""] })           // $ExpectType VDOM<unknown, unknown>
h("hr", { class: ["hi"] })         // $ExpectType VDOM<unknown, unknown>
h("hr", { class: [{}] })           // $ExpectType VDOM<unknown, unknown>
h("hr", { class: [new Set()] })    // $ExpectError
h("hr", { class: [[]] })           // $ExpectType VDOM<unknown, unknown>
h("hr", { class: [Symbol()] })     // $ExpectError
h("hr", { class: [() => {}] })     // $ExpectError
h("hr", { class: [null] })         // $ExpectError
h("hr", { class: [undefined] })    // $ExpectError

h("hr", { class: [{}] })              // $ExpectType VDOM<unknown, unknown>
h("hr", { class: [{ a: true }] })     // $ExpectType VDOM<unknown, unknown>
h("hr", { class: [{ a: false }] })    // $ExpectType VDOM<unknown, unknown>

h("hr", { class: [false && "foo"] })    // $ExpectType VDOM<unknown, unknown>

// -----------------------------------------------------------------------------

// $ExpectType VDOM<unknown, unknown>
h("a", { id: "unique" }, [h("br", {})])

// $ExpectType VDOM<unknown, unknown>
h("a", { onclick: (state) => state }, [h("br", {})])

// $ExpectError
h("a", { onclick: (state) => ({ ...state }) }, [h("br", {})])

// $ExpectType VDOM<unknown, unknown>
h("a", { onclick: (state) => [state] }, [h("br", {})])

// $ExpectError
h("a", { onclick: (state) => [{ ...state }] }, [h("br", {})])

// $ExpectType VDOM<number, unknown>
h("a", { onclick: ((state: number) => state * 2) }, [h("br", {})])

// -----------------------------------------------------------------------------

// $ExpectType VDOM<number, unknown>
h<number>("a", { onclick: (state) => state * 2 }, [h("br", {})])

type Test = { bar?: number, foo: number }

// $ExpectType VDOM<Test, unknown>
h<Test>("button", {
  onclick: (state) => ({ ...state, bar: state.foo * 2 })
}, [text("clicky")])

// -----------------------------------------------------------------------------

h("p", {}, [true])         // $ExpectError
h("p", {}, [false])        // $ExpectType VDOM<unknown, unknown>
h("p", {}, [0])            // $ExpectError
h("p", {}, [2424])         // $ExpectError
h("p", {}, [-123])         // $ExpectError
h("p", {}, [-Infinity])    // $ExpectError
h("p", {}, [Infinity])     // $ExpectError
h("p", {}, [NaN])          // $ExpectError
h("p", {}, [""])           // $ExpectError
h("p", {}, ["hi"])         // $ExpectError
h("p", {}, [{}])           // $ExpectError
h("p", {}, [new Set()])    // $ExpectError
h("p", {}, [[]])           // $ExpectError
h("p", {}, [Symbol()])     // $ExpectError
h("p", {}, [() => {}])     // $ExpectError
h("p", {}, [null])         // $ExpectType VDOM<unknown, unknown>
h("p", {}, [undefined])    // $ExpectType VDOM<unknown, unknown>

h("p", {}, h("br", {}))        // $ExpectType VDOM<unknown, unknown>
h("p", {}, [h("br", {})])      // $ExpectType VDOM<unknown, unknown>
h("p", {}, [text("hello")])    // $ExpectType VDOM<unknown, unknown>
