import { memo } from "hyperapp"

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
memo(() => {})     // $ExpectError
memo(null)         // $ExpectError
memo(undefined)    // $ExpectError

// TODO:
// export var memo = (tag, memo) => ({ tag, memo })
// // The `memo` function stores a view along with properties for it.
// function memo<S, D = unknown>(view: View<S, D>, props: PropList<S, D>): Partial<VDOM<S, D>>
