import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

test("update the state sync", () => {
  app({
    state: 1,
    view: state => <div>{state}</div>,
    actions: {
      add: state => state + 1
    },
    events: {
      loaded: (state, actions) => {
        actions.add()

        expectHTMLToBe`
          <div>
            2
          </div>
        `
      }
    }
  })
})

test("update the state async", done => {
  app({
    state: 1,
    view: state => <div>{state}</div>,
    actions: {
      change: (state, data) => state + data,
      delayAndChange: (state, data, actions) => {
        setTimeout(_ => {
          actions.change(data)

          expectHTMLToBe`
            <div>
              ${state + data}
            </div>
          `

          done()
        }, 5)
      }
    },
    events: {
      loaded: (state, actions) =>
        actions.delayAndChange(Number.MAX_SAFE_INTEGER)
    }
  })
})

test("update the state async by promise", done => {
  app({
    state: 1,
    view: state => <div>{state}</div>,
    actions: {
      delay: state => new Promise(resolve => setTimeout(_ => resolve(), 20)),
      change: (state, data) => state + data,
      delayAndChange: (state, data, actions) => {
        actions.delay().then(_ => {
          actions.change(data)

          expectHTMLToBe`
            <div>
              ${state + data}
            </div>
          `

          done()
        })
      }
    },
    events: {
      loaded: (state, actions) => actions.delayAndChange(Number.MAX_SAFE_INTEGER)
    }
  })
})

test("namespaced/nested actions", () => {
  app({
    state: true,
    actions: {
      foo: {
        bar: {
          baz: (state, data) => {
            expect(state).toBe(true)
            expect(data).toBe("foo.bar.baz")
          }
        }
      }
    },
    events: {
      loaded: (state, actions) => actions.foo.bar.baz("foo.bar.baz")
    },
    view: state => ""
  })
})
