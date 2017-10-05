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
      },
      fire(state, actions) {
        actions.up()
        actions.up()
        actions.up()
        actions.up()
      }
    }
  }).fire()
})

test("hoa", done => {
  function foo(app) {
    return props =>
      app(
        Object.assign(props, {
          state: { value: 1 }
        })
      )
  }

  app(foo)({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe("<div>1</div>")
            done()
          }
        },
        state.value
      )
  })
})
