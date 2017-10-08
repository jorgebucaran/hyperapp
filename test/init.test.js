import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("init", done => {
  app({
    init(state, actions) {
      expect(actions.up().value).toBe(2)
      done()
    },
    state: {
      value: 1
    },
    actions: {
      up(state) {
        return {
          value: state.value + 1
        }
      }
    }
  })
})
