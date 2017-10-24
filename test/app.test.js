import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("throttling", done => {
  var count = 0

  app({
    view(state, actions) {
      if (0 >= count) {
        actions.fire()
      }

      count += 1

      return h("div", {}, state.value)
    },
    state: {
      value: "foo"
    },
    actions: {
      render(state) {
        return state
      },
      fire(state, actions) {
        actions.render()
        actions.render()
        actions.render()
      }
    }
  }).fire()

  setTimeout(() => {
    expect(count).toBe(2)
    done()
  }, 10)
})
