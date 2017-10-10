import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("modules", done => {
  const foo = {
    init(state) {
      expect(state).toEqual({
        value: 0,
        bar: {
          text: "hello"
        }
      })
    },
    state: {
      value: 0
    },
    actions: {
      up(state) {
        return { value: state.value + 1 }
      }
    },
    modules: {
      bar: {
        init(state) {
          expect(state).toEqual({
            text: "hello"
          })
        },
        state: {
          text: "hello"
        },
        actions: {
          change(state) {
            return { text: "hola" }
          }
        }
      }
    }
  }

  app({
    init(state, actions) {
      expect(state).toEqual({
        foo: {
          value: 0,
          bar: {
            text: "hello"
          }
        }
      })

      expect(actions.foo.up()).toEqual({
        foo: {
          value: 1,
          bar: {
            text: "hello"
          }
        }
      })

      expect(actions.foo.bar.change()).toEqual({
        foo: {
          value: 1,
          bar: {
            text: "hola"
          }
        }
      })

      done()
    },
    modules: { foo }
  })
})
