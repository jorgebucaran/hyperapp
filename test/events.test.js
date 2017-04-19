import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

test("loaded", () => {
  app({
    view: state => "",
    state: 1,
    actions: {
      step: state => state + 1
    },
    events: {
      loaded: [
        (state, actions) => actions.step(),
        (state, actions) => actions.step(),
        state => expect(state).toBe(3)
      ]
    }
  })
})

test("loaded / DOMContentLoaded", done => {
  Object.defineProperty(document, "readyState", {
    writable: true
  })

  document.readyState = "loading"

  app({
    view: state => "",
    events: {
      loaded: state => done()
    }
  })

  document.readyState = "complete"

  const event = document.createEvent("Event")
  event.initEvent("DOMContentLoaded", true, true)
  document.dispatchEvent(event)
})

test("action", () => {
  app({
    state: "",
    view: state => h("div", {}, state),
    actions: {
      set: (state, actions, data) => data
    },
    events: {
      loaded: (state, actions) => {
        actions.set("foo")
        expectHTMLToBe`
          <div>
            bar
          </div>
        `
      },
      action: (state, actions, { name, data }) => {
        if (name === "set") {
          return { data: "bar" }
        }
      }
    }
  })
})

test("update", () => {
  app({
    state: 1,
    view: state => h("div", {}, state),
    actions: {
      add: state => state + 1
    },
    events: {
      loaded: (state, actions) => {
        actions.add()
        expectHTMLToBe`
          <div>
            20
          </div>
        `
      },
      update: (state, actions, data) => data * 10
    }
  })
})

test("render", () => {
  app({
    state: 1,
    view: state => h("div", {}, state),
    events: {
      loaded: (state, actions) => {
        expectHTMLToBe`
          <main>
            <div>
              1
            </div>
          </main>
        `
      },
      render: (state, actions, view) => state =>
        h("main", {}, view(state, actions))
    }
  })
})

test("custom event", () => {
  app({
    view: state => "",
    events: {
      loaded: (state, actions, _, emit) => emit("foo", "foo"),
      foo: (state, actions, data) => expect("foo").toBe(data)
    }
  })
})

test("nested action name", () => {
  app({
    view: state => "",
    state: "",
    actions: {
      foo: {
        bar: {
          set: (state, actions, data) => data
        }
      }
    },
    events: {
      loaded: (_, actions) => actions.foo.bar.set("foobar"),
      action: (state, actions, { name, data }) => {
        expect(name).toBe("foo.bar.set")
        expect(data).toBe("foobar")
      }
    }
  })
})
