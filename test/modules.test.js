import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("modules", done => {
  const foo = {
    init: state => {
      expect(state).toEqual({
        value: true,
        bar: {
          value: true
        }
      })
    },
    state: {
      value: true
    },
    actions: {
      up: state => ({ value: !state.value })
    },
    modules: {
      bar: {
        init: state => {
          expect(state).toEqual({ value: true })
        },
        state: {
          value: true
        },
        actions: {
          change: state => ({ value: !state.value })
        }
      }
    }
  }

  app({
    init: (state, actions) => {
      expect(state).toEqual({
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
    },
    modules: { foo }
  })
})
