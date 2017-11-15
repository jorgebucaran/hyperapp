import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("debouncing", done => {
  app({
    state: {
      value: 1
    },
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
    actions: {
      up: () => state => ({ value: state.value + 1 }),
      fire: () => state => actions => {
        actions.up()
        actions.up()
        actions.up()
        actions.up()
      }
    }
  }).fire()
})

test("actions in the view", done => {
  app({
    state: {
      value: 0
    },
    view: state => actions => {
      if (state.value < 1) {
        return actions.up()
      }

      setTimeout(() => {
        expect(document.body.innerHTML).toBe("<div>1</div>")
        done()
      })

      return h("div", {}, state.value)
    },
    actions: {
      up: () => state => ({ value: state.value + 1 })
    }
  })
})
