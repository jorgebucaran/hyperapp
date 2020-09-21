import { text } from "hyperapp"

text()             // $ExpectError
text(true)         // $ExpectError
text(false)        // $ExpectError
text(0)            // $ExpectType VDOM<unknown>
text(2424)         // $ExpectType VDOM<unknown>
text(-123)         // $ExpectType VDOM<unknown>
text(-Infinity)    // $ExpectType VDOM<unknown>
text(Infinity)     // $ExpectType VDOM<unknown>
text(NaN)          // $ExpectType VDOM<unknown>
text("")           // $ExpectType VDOM<unknown>
text("hi")         // $ExpectType VDOM<unknown>
text({})           // $ExpectError
text(new Set())    // $ExpectError
text([])           // $ExpectError
text(Symbol())     // $ExpectError
text(() => {})     // $ExpectError
text(null)         // $ExpectError
text(undefined)    // $ExpectError
