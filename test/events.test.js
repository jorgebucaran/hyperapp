import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("load", done => {
  app({
    state: {
      value: "foo"
    },
    actions: {
      set(state, actions, value) {
        return { value }
      }
    },
    events: {
      load(state, actions) {
        actions.set("bar")
      },
      update(state, actions, nextState) {
        expect(state.value).toBe("foo")
        expect(nextState.value).toBe("bar")
        done()
      }
    }
  })
})

test("render", done => {
  app({
    state: {
      value: "foo"
    },
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(`<main><div>foo</div></main>`)
            done()
          }
        },
        state.value
      ),
    events: {
      render(state, actions, view) {
        return state => h("main", {}, view(state, actions))
      }
    }
  })
})

test("action", done => {
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
    events: {
      load(state, actions) {
        actions.set("bar")
      },
      action(state, actions, { name, data }) {
        expect(name).toBe("set")
        expect(data).toBe("bar")
      }
    }
  })
})

test("resolve", done => {
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
    events: {
      load(state, actions) {
        actions.set("bar")
      },
      resolve(state, actions, result) {
        if (typeof result === "string") {
          //
          // Query strings as a valid ActionResult.
          //
          const [key, value] = result.slice(1).split("=")
          return { [key]: value }
        }
      }
    }
  })
})

test("update", done => {
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
      set(state, actions, value) {
        return { value }
      }
    },
    events: {
      load(state, actions) {
        actions.set(null)
      },
      update(state, actions, nextState) {
        if (typeof nextState.value !== "string") {
          return state
        }
      }
    }
  })
})

// test("ready", done => {
//   app({
//     view: state => h("div", {}, "foo"),
//     events: {
//       ready(state, actions, root) {
//         //
//         // This event fires after the view is rendered and attached
//         // to the DOM with your app top-level element / root.
//         //
//         root.appendChilde(document.createTextNode("bar"))
//         expect(document.body.innerHTML).toBe(`<div>foobar</div>`)
//         done()
//       }
//     }
//   })
// })
