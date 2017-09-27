import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("throttling", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe("<div>5</div>")
            done()
          }
        },
        state.value
      ),
    state: {
      value: 1
    },
    actions: {
      up(state) {
        return {
          value: state.value + 1
        }
      }
    },
    hooks: [
      (state, actions) => {
        actions.up()
        actions.up()
        actions.up()
        actions.up()
      }
    ]
  })
})

test("interop", done => {
  const appActions = app({
    actions: {
      foo(state, actions, data) {
        expect(data).toBe("bar")
        done()
      }
    }
  })
  appActions.foo("bar")
})

test("optional view", done => {
  app({
    hooks: [done]
  })
})
