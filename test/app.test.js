import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("debouncing", done => {
  const model = {
    state: {
      value: 1
    },
    actions: {
      up: () => state => ({ value: state.value + 1 }),
      fire: () => (state, actions) => {
        actions.up()
        actions.up()
        actions.up()
        actions.up()
      }
    }
  }

  const view = ({ state }) =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe("<div>5</div>")
          done()
        }
      },
      state.value
    )

  const { actions } = app(model, view)

  actions.fire()
})

test("actions in the view", done => {
  const model = {
    state: {
      value: 0
    },
    actions: {
      up: () => state => ({ value: state.value + 1 })
    }
  }

  const view = ({ state, actions }) => {
    if (state.value < 1) {
      return actions.up()
    }

    setTimeout(() => {
      expect(document.body.innerHTML).toBe("<div>1</div>")
      done()
    })

    return h("div", {}, state.value)
  }

  app(model, view)
})
