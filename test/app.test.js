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
    events: {
      load(state, actions) {
        actions.up()
        actions.up()
        actions.up()
        actions.up()
      },
      render(state) {
        //
        // Because renders are throttled this event is called only once.
        //
        expect(state).toEqual({ value: 5 })
      }
    }
  })
})

test("interop", done => {
  const emit = app({
    events: {
      foo(state, actions, data) {
        expect(data).toBe("bar")
        done()
      }
    }
  })
  emit("foo", "bar")
})

test("optional view", done => {
  app({
    events: {
      load() {
        done()
      }
    }
  })
})

test("view values update upon state change", done => {
  document.body.innerHTML = `<div id="app"></div>`
  const emit = app({
    root: document.getElementById("app"),
    state: { changeInput: false },
    view: state => h("input", { id: state.changeInput ? "foo" : "bar", "value" : state.changeInput ? "fizz" : "buzz" }),
    actions: {
      updateInput (app, state, actions) {
        state.changeInput = true
        return state
      }
    },
    events: {
      updateView (state, actions) {
        actions.updateInput()
      },
      load () {
        expect(document.body.innerHTML).toBe(
          `<div id="app"></div>`
        )
      }
    }
  })

  const firstRenderId = requestAnimationFrame(() => {
    expect(document.body.innerHTML).toBe(
      `<input id="bar" value="buzz">`
    )

    emit("updateView")

    const secondRenderId = requestAnimationFrame(() => {
      console.log(document.body.innerHTML)
      expect(document.body.innerHTML).toBe(
        `<input id="foo" value="fizz">`
      )
      done()
      cancelAnimationFrame(secondRenderId)
    })

    cancelAnimationFrame(firstRenderId)
  })
})
