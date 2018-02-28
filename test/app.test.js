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


test("lazy components", done => {
  const state = { value: "foo" }
  const actions = {
    update: () => ({ value: "bar" })
  }

  const Component = () => (state, actions) =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe("<div>foo</div>")
          actions.update()
        },
        onupdate() {
          expect(document.body.innerHTML).toBe("<div>bar</div>")
          done()
        }
      },
      state.value
    )

  const view = () => h(Component)

  app(state, actions, view, document.body)
})
