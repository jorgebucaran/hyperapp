import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

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

  const A = () => ({
    events: {
      init: () => expect(++count).toBe(2)
    }
  })

  const B = () => ({
    events: {
      init: () => expect(++count).toBe(3)
    }
  })

  app({
    view: state => "",
    events: {
      init: () => expect(++count).toBe(1)
    },
    mixins: [A, B]
  })
})

test("extend actions", () => {
  const mixin = app => ({
    actions: {
      foo: {
        bar: {
          baz: {
            toggle: state => !state
          }
        }
      }
    }
  })

  app({
    state: true,
    view: state => h("div", null, state),
    events: {
      loaded: (state, actions) => {
        expect(document.body.innerHTML).toBe(`<div>true</div>`)

        actions.foo.bar.baz.toggle()

        setTimeoout(() => {
          expect(document.body.innerHTML).toBe(`<div>false</div>`)
        })
      }
    },
    mixins: [mixin]
  })
})

test("don't overwrite actions in the same namespace", () => {
  const mixin = app => ({
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

test("mixin composition", () => {
  const A = () => ({
    state: {
      foo: 1
    }
  })

  const B = () => ({
    mixins: [A],
    state: {
      bar: 2
    }
  })

  app({
    mixins: [B],
    view: () => "",
    events: {
      init: state => {
        expect(state.bar).toBe(2)
        expect(state.foo).toBe(1)
      }
    }
  })
})

test("receive emit function", done => {
  app({
    mixins: [
      emit => ({
        events: { init: () => emit("foo") }
      })
    ],
    view: () => "",
    events: {
      foo: done
    }
  })
})
