import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => (document.body.innerHTML = ""))

test("extend the state", () => {
  const mixin = app => ({
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
    mixins: [mixin]
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
      loaded: [
        (state, actions) => actions.foo.bar.baz("foo.bar.baz"),
        (state, actions) => actions.foo.bar.qux("foo.bar.qux")
      ]
    },
    mixins: [mixin]
  })
})

test('mixin inside of a mixin', () => {
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
      loaded: (state) => {
        expect(state.bar).toBe(2)
        expect(state.foo).toBe(1)
      }
    }
  })
})
