import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("slices", done => {
  const bar = {
    value: true,
    toggle: () => model => ({ value: !model.value })
  }

  const foo = {
    bar,
    value: true,
    toggle: () => model => ({ value: !model.value })
  }

  const model = { foo, bar }

  const store = app(model)

  expect(store.foo.value).toEqual(true)
  expect(store.foo.bar.value).toEqual(true)

  expect(store.foo.toggle()).toEqual({ value: false })
  expect(store.foo.bar.toggle()).toEqual({ value: false })

  done()
})
