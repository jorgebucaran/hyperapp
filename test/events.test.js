import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => (document.body.innerHTML = ""))

test("init", () => {
  app({
    view: state => "",
    state: 1,
    actions: {
      step: state => state + 1
    },
    events: {
      init: [
        (state, actions) => actions.step(),
        (state, actions) => actions.step(),
        state => expect(state).toBe(3)
      ]
    }
  })
})

test("loaded", done => {
  app({
    state: "foo",
    view: state => h("div", null, state),
    events: {
      init: () => {
        expect(document.body.innerHTML).toBe("")
      },
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<div>foo</div>`)
        done()
      }
    }
  })
})

test("action", done => {
  app({
    state: "",
    view: state => h("div", null, state),
    actions: {
      set: (state, actions, data) => data
    },
    events: {
      init: (state, actions) => {
        actions.set("foo")
      },
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<div>bar</div>`)
        done()
      },
      action: (state, actions, { name, data }) => {
        if (name === "set") {
          return { data: "bar" }
        }
      }
    }
  })
})

test("update", done => {
  app({
    state: 1,
    view: state => h("div", null, state),
    actions: {
      add: state => state + 1
    },
    events: {
      init: (state, actions) => actions.add(),
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<div>20</div>`)
        done()
      },
      update: (state, actions, data) => data * 10
    }
  })
})

test("render", done => {
  app({
    state: 1,
    view: state => h("div", null, state),
    events: {
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<main><div>1</div></main>`)
        done()
      },
      render: (state, actions, view) => state =>
        h("main", null, view(state, actions))
    }
  })
})

test("custom event", () => {
  const emit = app({
    view: state => "",
    events: {
      foo: (state, actions, data) => expect("foo").toBe(data)
    }
  })

  emit("foo", "foo")
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
      init: (state, actions) => actions.foo.bar.set("foobar"),
      action: (state, actions, { name, data }) => {
        expect(name).toBe("foo.bar.set")
        expect(data).toBe("foobar")
      }
    }
  })
})
