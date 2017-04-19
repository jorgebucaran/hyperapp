import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

test("extend the state", () => {
  const Mixin = app => ({
    state: {
      bar: app.state.foo
    }
  })

  app({
    state: {
      foo: true
    },
    view: state => "",
    events: {
      loaded: state => {
        expect(state).toEqual({
          foo: true,
          bar: true
        })
      }
    },
    mixins: [Mixin]
  })
})

test("extend events", () => {
  let count = 0

  const A = _ => ({
    events: {
      loaded: _ => expect(++count).toBe(2)
    }
  })

  const B = _ => ({
    events: {
      loaded: _ => expect(++count).toBe(3)
    }
  })

  app({
    view: state => "",
    events: {
      loaded: _ => expect(++count).toBe(1)
    },
    mixins: [A, B]
  })
})

test("extend actions", () => {
  const Mixin = app => ({
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
    view: state => h("div", {}, `${state}`),
    events: {
      loaded: (_, actions) => {
        expectHTMLToBe`
          <div>
            true
          </div>
        `

        actions.foo.bar.baz.toggle()

        expectHTMLToBe`
          <div>
            false
          </div>
        `
      }
    },
    mixins: [Mixin]
  })
})

test("don't overwrite actions in the same namespace", () => {
  const Mixin = app => ({
    actions: {
      foo: {
        bar: {
          baz: (state, data) => {
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
          qux: (state, data) => {
            expect(state).toBe(true)
            expect(data).toBe("foo.bar.qux")
          }
        }
      }
    },
    events: {
      loaded: [
        (state, actions) => actions.foo.bar.baz("foo.bar.baz"),
        (state, actions) => actions.foo.bar.qux("foo.bar.qux")
      ]
    },
    mixins: [Mixin]
  })
})
