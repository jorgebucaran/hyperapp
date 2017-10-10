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
  function B(app) {
    function enhancedApp(props) {
      return app(
        Object.assign({}, props, {
          state: Object.assign(props.state, {
            value: props.state.value + 1
          })
        })
      )
    }

    return props =>
      typeof props === "function" ? props(enhancedApp) : enhancedApp(props)
  }

  function A(app) {
    function enhancedApp(props) {
      return app(
        Object.assign({}, props, {
          state: Object.assign(props.state, {
            value: props.state.value + 1
          })
        })
      )
    }

    return props =>
      typeof props === "function" ? props(enhancedApp) : enhancedApp(props)
  }

  app(A)(B)({
    state: {
      value: 0
    },
    init(state) {
      expect(state).toEqual({
        value: 2
      })

      done()
    }
  })
})
