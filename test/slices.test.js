import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

// test("state", done => {
//   const actions = app({
//     view: state =>
//       h(
//         "div",
//         {
//           oncreate() {
//             expect(document.body.innerHTML).toBe(`<div>fizzbuzz</div>`)
//             done()
//           }
//         },
//         state.fizz.buzz.value
//       ),
//     actions: {
//       fizz: {
//         buzz: {
//           fizzbuzz: () => ({ value: "fizzbuzz" })
//         }
//       }
//     }
//   })

//   actions.fizz.buzz.fizzbuzz()
// })

test("modules", done => {
  const bar = {
    value: true,
    toggle: () => state => ({ value: !state.value })
  }

  const foo = {
    bar,
    value: true,
    toggle: () => state => ({ value: !state.value })
  }

  const model = { foo, bar, getState: () => state => state }

  const store = app(model)

  expect(store.foo.value).toEqual(true)
  expect(store.foo.bar.value).toEqual(true)

  expect(store.foo.toggle()).toEqual({ value: false })
  expect(store.foo.bar.toggle()).toEqual({ value: false })

  done()
})
