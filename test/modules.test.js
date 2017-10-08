import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("modules", done => {
  const foo = {
    state: {
      value: 0
    },
    actions: {
      up(state, actions) {
        return { value: state.value + 1 }
      }
    }
  }

  app({
    init(state, actions) {
      expect(state.foo.value).toBe(0)
      expect(actions.foo.up().value).toBe(1)
      done()
    },
    modules: { foo }
  })
})
