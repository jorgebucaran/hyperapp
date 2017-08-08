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
