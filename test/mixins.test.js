import { h, app } from "../src"

window.requestAnimationFrame = f => f()

beforeEach(() => (document.body.innerHTML = ""))

test("extend the state", () => {
  const mixin = () => ({
    state: {
      bar: true
    }
  })

  app({
    state: {
      foo: true
    },
    view: state => "",
    events: {
      init: state => {
        expect(state).toEqual({
          foo: true,
          bar: true
        })
      }
    },
    mixins: [mixin]
  })
})

test("extend events", () => {
  let count = 0

  const mixinFoo = () => ({
    events: {
      init: () => expect(++count).toBe(2)
    }
  })

  const mixinBar = () => ({
    events: {
      init: () => expect(++count).toBe(3)
    }
  })

  app({
    view: state => "",
    events: {
      init: () => expect(++count).toBe(1)
    },
    mixins: [mixinFoo, mixinBar]
  })
})

test("extend actions", () => {
  const mixin = () => ({
    actions: {
      foo: {
        bar: {
          baz: {
            toggle: state => state.toUpperCase()
          }
        }
      }
    }
  })

  app({
    state: "foo",
    view: state => h("div", null, state),
    events: {
      loaded: (state, actions) => {
        expect(document.body.innerHTML).toBe(`<div>foo</div>`)

        actions.foo.bar.baz.toggle()

        expect(document.body.innerHTML).toBe(`<div>FOO</div>`)
      }
    },
    mixins: [mixin]
  })
})

test("don't overwrite actions in the same namespace", () => {
  const mixin = () => ({
    actions: {
      foo: {
        bar: {
          baz: (state, actions, data) => {
            expect(state).toBe(true)
            expect(data).toBe("foo.bar.baz")
            return state
          }
        }
      }
    }
  })

  app({
    state: true,
    view: state => "",
    actions: {
      foo: {
        bar: {
          qux: (state, actions, data) => {
            expect(state).toBe(true)
            expect(data).toBe("foo.bar.qux")
          }
        }
      }
    },
    events: {
      init: [
        (state, actions) => actions.foo.bar.baz("foo.bar.baz"),
        (state, actions) => actions.foo.bar.qux("foo.bar.qux")
      ]
    },
    mixins: [mixin]
  })
})

test("presets", () => {
  const mixinFoo = () => ({
    state: {
      foo: 1
    }
  })

  const mixinBar = () => ({
    state: {
      bar: 2
    }
  })

  const mixinFoobar = () => ({
    mixins: [mixinFoo, mixinBar]
  })

  app({
    view: () => "",
    events: {
      init(state) {
        expect(state.bar).toBe(2)
        expect(state.foo).toBe(1)
      }
    },
    mixins: [mixinFoobar]
  })
})

test("receive emit function", done => {
  app({
    mixins: [
      emit => ({
        events: {
          init: () => emit("foo")
        }
      })
    ],
    view: () => "",
    events: {
      foo: done
    }
  })
})
