import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("called on load", done => {
  app({
    view: state =>
    h(
      "div",
      {
        oncreate() {
          expect(state).toEqual({ value: "bar" })
          expect(document.body.innerHTML).toBe(`<div>bar</div>`)
          done()
        }
      },
      state.value
    ),
    state: {
      value: "foo"
    },
    actions: {
      set(state, actions, value) {
        return { value }
      }
    },
    subscriptions: [
      (state, actions) => {
        expect(state).toEqual({ value: "foo" })
        actions.set("bar")
      }
    ]
  })
})

test("action passed to curried return function", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(state).toEqual({ value: "bar" })
            expect(document.body.innerHTML).toBe(`<div>bar</div>`)
            done()
          }
        },
        state.value
      ),
    state: {
      value: "foo"
    },
    actions: {
      set(state, actions, value) {
        return { value }
      }
    },
    subscriptions: [
      (state, actions) => action => {
        expect(action.name).toBe("set")
        expect(action.data).toBe("bar")
      },
      (state, actions) => {
        actions.set("bar")
      }
    ]
  })
})

test("action result passed to curried return from curried action function", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(state).toEqual({ value: "bar" })
            expect(document.body.innerHTML).toBe(`<div>bar</div>`)
            done()
          }
        },
        state.value
      ),
    state: {
      value: "foo"
    },
    actions: {
      set(state, actions, data) {
        return `?value=bar`
      }
    },
    subscriptions: [
      (state, actions) => action => result => {
        if (typeof result === "string") {
          //
          // Query strings as a valid ActionResult.
          //
          const [key, value] = result.slice(1).split("=")
          return { [key]: value }
        }
      },
      (state, actions) => {
        actions.set("bar")
      }
    ]
  })
})

const validateStateUpdate = validate => (state, actions) => action => result => {
  if (typeof result === "function") {
    return update => result(nextResult => update(validate(state, nextResult)))
  }
  return validate(state, result)
}

test("validate sync and async state updates", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(state).toEqual({ value: "foo" })
            expect(document.body.innerHTML).toBe(`<div>foo</div>`)
            done()
          }
        },
        state.value
      ),
    state: {
      value: "foo"
    },
    actions: {
      set: (state, actions, value) => ({ value }),
      setAsync: (state, actions, value) => update => update({ value })
    },
    subscriptions: [
      validateStateUpdate((prevState, nextState) => {
        if (typeof nextState.value !== "string") {
          return prevState
        }
      }),
      (state, actions) => {
        actions.set(null)
        actions.setAsync(null)
      }
    ]
  })
})
