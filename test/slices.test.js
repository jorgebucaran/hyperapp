import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("state", done => {
  const model = {
    actions: {
      fizz: {
        buzz: {
          fizzbuzz: () => ({ value: "fizzbuzz" })
        }
      }
    }
  }
  const view = state =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>fizzbuzz</div>`)
          done()
        }
      },
      state.fizz.buzz.value
    )
  const actions = app(model, view)

  actions.fizz.buzz.fizzbuzz()
})

test("models", done => {
  const bar = {
    state: {
      value: true
    },
    actions: {
      change: () => state => ({ value: !state.value })
    }
  }

  const foo = {
    state: {
      value: true,
      bar: bar.state
    },
    actions: {
      up: () => state => ({ value: !state.value }),
      bar: bar.actions
    }
  }

  const actions = app({
    state: { foo: foo.state },
    actions: {
      foo: foo.actions,
      getState: () => state => state
    }
  })

  expect(actions.getState()).toEqual({
    foo: {
      value: true,
      bar: {
        value: true
      }
    }
  })

  expect(actions.foo.up()).toEqual({ value: false })
  expect(actions.foo.bar.change()).toEqual({ value: false })

  done()
})
