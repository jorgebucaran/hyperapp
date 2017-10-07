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

test("higher-order app", done => {
  const appEnhancer = prevApp => props => prevApp(Object.assign(props, {
    state: {
      value: 0
    },
    actions: {
      up: ({value}) => ({ value: value + 1})
    }
  }))
  app(appEnhancer)({
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
      ),
    subscriptions: [
      (state, actions) => {
        actions.up()
      }
    ]
  })
})