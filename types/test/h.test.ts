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
h("", {})           // $ExpectType VDOM<unknown>
h("hi", {})         // $ExpectType VDOM<unknown>
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
h("p", {})           // $ExpectType VDOM<unknown>
h("p", new Set())    // $ExpectError
h("p", [])           // $ExpectError
h("p", Symbol())     // $ExpectError
h("p", () => {})     // $ExpectError
h("p", null)         // $ExpectError
h("p", undefined)    // $ExpectError

h("p", {}, true)         // $ExpectError
h("p", {}, false)        // $ExpectType VDOM<unknown>
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
h("p", {}, [])           // $ExpectType VDOM<unknown>
h("p", {}, Symbol())     // $ExpectError
h("p", {}, () => {})     // $ExpectError
h("p", {}, null)         // $ExpectType VDOM<unknown>
h("p", {}, undefined)    // $ExpectType VDOM<unknown>

// -----------------------------------------------------------------------------

h("p", { class: true })         // $ExpectError
h("p", { class: false })        // $ExpectType VDOM<unknown>
h("p", { class: 0 })            // $ExpectError
h("p", { class: 2424 })         // $ExpectError
h("p", { class: -123 })         // $ExpectError
h("p", { class: -Infinity })    // $ExpectError
h("p", { class: Infinity })     // $ExpectError
h("p", { class: NaN })          // $ExpectError
h("p", { class: "" })           // $ExpectType VDOM<unknown>
h("p", { class: "hi" })         // $ExpectType VDOM<unknown>
h("p", { class: {} })           // $ExpectType VDOM<unknown>
h("p", { class: new Set() })    // $ExpectError
h("p", { class: [] })           // $ExpectType VDOM<unknown>
h("p", { class: Symbol() })     // $ExpectError
h("p", { class: () => {} })     // $ExpectError
h("p", { class: null })         // $ExpectError
h("p", { class: undefined })    // $ExpectType VDOM<unknown>

h("p", { class: { a: true } })         // $ExpectType VDOM<unknown>
h("p", { class: { a: false } })        // $ExpectType VDOM<unknown>
h("p", { class: { a: 0 } })            // $ExpectError
h("p", { class: { a: 2424 } })         // $ExpectError
h("p", { class: { a: -123 } })         // $ExpectError
h("p", { class: { a: -Infinity } })    // $ExpectError
h("p", { class: { a: Infinity } })     // $ExpectError
h("p", { class: { a: NaN } })          // $ExpectError
h("p", { class: { a: "" } })           // $ExpectError
h("p", { class: { a: "hi" } })         // $ExpectError
h("p", { class: { a: {} } })           // $ExpectError
h("p", { class: { a: new Set() } })    // $ExpectError
h("p", { class: { a: [] } })           // $ExpectError
h("p", { class: { a: Symbol() } })     // $ExpectError
h("p", { class: { a: () => {} } })     // $ExpectError
h("p", { class: { a: null } })         // $ExpectError
h("p", { class: { a: undefined } })    // $ExpectError

h("p", { class: [true] })         // $ExpectError
h("p", { class: [false] })        // $ExpectType VDOM<unknown>
h("p", { class: [0] })            // $ExpectError
h("p", { class: [2424] })         // $ExpectError
h("p", { class: [-123] })         // $ExpectError
h("p", { class: [-Infinity] })    // $ExpectError
h("p", { class: [Infinity] })     // $ExpectError
h("p", { class: [NaN] })          // $ExpectError
h("p", { class: [""] })           // $ExpectType VDOM<unknown>
h("p", { class: ["hi"] })         // $ExpectType VDOM<unknown>
h("p", { class: [{}] })           // $ExpectType VDOM<unknown>
h("p", { class: [new Set()] })    // $ExpectError
h("p", { class: [[]] })           // $ExpectType VDOM<unknown>
h("p", { class: [Symbol()] })     // $ExpectError
h("p", { class: [() => {}] })     // $ExpectError
h("p", { class: [null] })         // $ExpectError
h("p", { class: [undefined] })    // $ExpectError

h("p", { class: [{}] })              // $ExpectType VDOM<unknown>
h("p", { class: [{ a: true }] })     // $ExpectType VDOM<unknown>
h("p", { class: [{ a: false }] })    // $ExpectType VDOM<unknown>

h("p", { class: [false && "foo"] })    // $ExpectType VDOM<unknown>

// -----------------------------------------------------------------------------

h("p", { style: true })         // $ExpectError
h("p", { style: false })        // $ExpectError
h("p", { style: 0 })            // $ExpectError
h("p", { style: 2424 })         // $ExpectError
h("p", { style: -123 })         // $ExpectError
h("p", { style: -Infinity })    // $ExpectError
h("p", { style: Infinity })     // $ExpectError
h("p", { style: NaN })          // $ExpectError
h("p", { style: "" })           // $ExpectError
h("p", { style: "hi" })         // $ExpectError
h("p", { style: {} })           // $ExpectType VDOM<unknown>
h("p", { style: new Set() })    // $ExpectError
h("p", { style: [] })           // $ExpectError
h("p", { style: Symbol() })     // $ExpectError
h("p", { style: () => {} })     // $ExpectError
h("p", { style: null })         // $ExpectError
h("p", { style: undefined })    // $ExpectType VDOM<unknown>

h("p", { style: { color: true } })         // $ExpectError
h("p", { style: { color: false } })        // $ExpectError
h("p", { style: { color: 0 } })            // $ExpectError
h("p", { style: { color: 2424 } })         // $ExpectError
h("p", { style: { color: -123 } })         // $ExpectError
h("p", { style: { color: -Infinity } })    // $ExpectError
h("p", { style: { color: Infinity } })     // $ExpectError
h("p", { style: { color: NaN } })          // $ExpectError
h("p", { style: { color: "" } })           // $ExpectType VDOM<unknown>
h("p", { style: { color: "red" } })        // $ExpectType VDOM<unknown>
h("p", { style: { color: {} } })           // $ExpectError
h("p", { style: { color: new Set() } })    // $ExpectError
h("p", { style: { color: [] } })           // $ExpectError
h("p", { style: { color: Symbol() } })     // $ExpectError
h("p", { style: { color: () => {} } })     // $ExpectError
h("p", { style: { color: null } })         // $ExpectType VDOM<unknown>
h("p", { style: { color: undefined } })    // $ExpectType VDOM<unknown>
h("p", { style: { clor: null } })          // $ExpectError

h("p", { style: [true] })         // $ExpectError
h("p", { style: [false] })        // $ExpectError
h("p", { style: [0] })            // $ExpectError
h("p", { style: [2424] })         // $ExpectError
h("p", { style: [-123] })         // $ExpectError
h("p", { style: [-Infinity] })    // $ExpectError
h("p", { style: [Infinity] })     // $ExpectError
h("p", { style: [NaN] })          // $ExpectError
h("p", { style: [""] })           // $ExpectError
h("p", { style: ["hi"] })         // $ExpectError
h("p", { style: [{}] })           // $ExpectError
h("p", { style: [new Set()] })    // $ExpectError
h("p", { style: [[]] })           // $ExpectError
h("p", { style: [Symbol()] })     // $ExpectError
h("p", { style: [() => {}] })     // $ExpectError
h("p", { style: [null] })         // $ExpectError
h("p", { style: [undefined] })    // $ExpectError

// -----------------------------------------------------------------------------

// $ExpectType VDOM<unknown>
h("a", { id: "unique" }, [h("br", {})])

// $ExpectType VDOM<unknown>
h("a", { onclick: (state) => state }, [h("br", {})])

// $ExpectError
h("a", { onclick: (state) => ({ ...state }) }, [h("br", {})])

// $ExpectType VDOM<unknown>
h("a", { onclick: (state) => [state] }, [h("br", {})])

// $ExpectError
h("a", { onclick: (state) => [{ ...state }] }, [h("br", {})])

// $ExpectType VDOM<number>
h("a", { onclick: ((state: number) => state * 2) }, [h("br", {})])

// $ExpectType VDOM<number>
h<number>("a", { onclick: (state) => state * 2 }, [h("br", {})])

// -----------------------------------------------------------------------------

type Test = { bar?: number, foo: number }

// $ExpectType VDOM<Test>
h<Test>("button", {
  onclick: (state) => ({ ...state, bar: state.foo * 2 })
}, [text("clicky")])

// -----------------------------------------------------------------------------

h("p", {}, [true])         // $ExpectError
h("p", {}, [false])        // $ExpectType VDOM<unknown>
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
h("p", {}, [null])         // $ExpectType VDOM<unknown>
h("p", {}, [undefined])    // $ExpectType VDOM<unknown>

h("p", {}, h("br", {}))        // $ExpectType VDOM<unknown>
h("p", {}, [h("br", {})])      // $ExpectType VDOM<unknown>
h("p", {}, [text("hello")])    // $ExpectType VDOM<unknown>
