import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("debouncing", done => {
  const state = {
    value: 1
  }

  const actions = {
    up: () => state => ({ value: state.value + 1 }),
    fire: () => (state, actions) => {
      actions.up()
      actions.up()
      actions.up()
      actions.up()
    }
  }

  const view = state =>
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

  const main = app(state, actions, view, document.body)

  main.fire()
})

test("actions in the view", done => {
  const state = {
    value: 0
  }

  const actions = {
    up: () => state => ({ value: state.value + 1 })
  }

  const view = (state, actions) => {
    if (state.value < 1) {
      return actions.up()
    }

    setTimeout(() => {
      expect(document.body.innerHTML).toBe("<div>1</div>")
      done()
    })

    return h("div", {}, state.value)
  }

  app(state, actions, view, document.body)
})
