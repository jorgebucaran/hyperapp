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
    subscriptions: [
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
    subscriptions: [
      done
    ]
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