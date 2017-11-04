import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("modules", done => {
  const foo = {
    state: {
      value: true
    },
    actions: {
      up: state => ({ value: !state.value })
    },
    modules: {
      bar: {
        state: {
          value: true
        },
        actions: {
          change: state => ({ value: !state.value })
        }
      }
    }
  }

  const actions = app({
    actions: {
      getState: state => state
    },
    modules: { foo }
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
