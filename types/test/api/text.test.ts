import { text } from "hyperapp"

text()             // $ExpectError
text(true)         // $ExpectType VDOM<unknown>
text(false)        // $ExpectType VDOM<unknown>
text(0)            // $ExpectType VDOM<unknown>
text(2424)         // $ExpectType VDOM<unknown>
text(-123)         // $ExpectType VDOM<unknown>
text(-Infinity)    // $ExpectType VDOM<unknown>
text(Infinity)     // $ExpectType VDOM<unknown>
text(NaN)          // $ExpectType VDOM<unknown>
text("")           // $ExpectType VDOM<unknown>
text("hi")         // $ExpectType VDOM<unknown>
text({})           // $ExpectType VDOM<unknown>
text(new Set())    // $ExpectType VDOM<unknown>
text([])           // $ExpectType VDOM<unknown>
text(Symbol())     // $ExpectError
text(() => { })    // $ExpectError
text(null)         // $ExpectType VDOM<unknown>
text(undefined)    // $ExpectType VDOM<unknown>
