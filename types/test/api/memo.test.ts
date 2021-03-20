import { h, text, memo } from "hyperapp"

memo()             // $ExpectError
memo(true)         // $ExpectError
memo(false)        // $ExpectError
memo(0)            // $ExpectError
memo(2424)         // $ExpectError
memo(-123)         // $ExpectError
memo(-Infinity)    // $ExpectError
memo(Infinity)     // $ExpectError
memo(NaN)          // $ExpectError
memo("")           // $ExpectError
memo("hi")         // $ExpectError
memo({})           // $ExpectError
memo(new Set())    // $ExpectError
memo([])           // $ExpectError
memo(Symbol())     // $ExpectError
memo(() => { })    // $ExpectError
memo(null)         // $ExpectError
memo(undefined)    // $ExpectError

memo(text("hi"))               // $ExpectError
memo(text("hi"), undefined)    // $ExpectError
memo(text("hi"), null)         // $ExpectError
memo(text("hi"), {})           // $ExpectError

memo(text, "hi")               // $ExpectType Partial<VDOM<unknown>>
memo(text, ["hi"])             // $ExpectType Partial<VDOM<unknown>>

// $ExpectType Partial<VDOM<unknown>>
memo((data) => h("div", {}, text(data)), "hi")
