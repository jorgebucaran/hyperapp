import { app, h } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

test("update the model to render the view", () => {
  app({
    model: 1,
    view: model => h("div", {}, model),
    actions: {
      add: model => model + 1
    },
    subscriptions: [
      (_, actions) => actions.add()
    ]
  })

  expectHTMLToBe(`
    <div>
      2
    </div>
  `)
})

test("update the model async", done => {
  app({
    model: 1,
    view: model => h("div", {}, model),
    actions: {
      change: (model, data) => model + data,
      delayAndChange: (model, data, actions) => {
        setTimeout(_ => {
          actions.change(data)

          expectHTMLToBe(`
            <div>
              ${model + data}
            </div>
          `)

          done()
        }, 20)
      }
    },
    subscriptions: [
      (_, actions) => actions.delayAndChange(10)
    ]
  })
})

test("return a promise", done => {
  app({
    model: 1,
    view: model => h("div", {}, model),
    actions: {
      change: (model, data) => model + data,
      delay: _ => new Promise(resolve => setTimeout(_ => resolve(), 20)),
      delayAndChange: (model, data, actions) => {
        actions.delay().then(_ => {
          actions.change(data)

          expectHTMLToBe(`
            <div>
              ${model + data}
            </div>
          `)

          done()
        })
      }
    },
    subscriptions: [
      (_, actions) => actions.delayAndChange(10)
    ]
  })
})

test("namespaces/nested actions", () => {
  app({
    model: true,
    actions: {
      foo: {
        bar: {
          baz: (model, data) => {
            expect(model).toBe(true)
            expect(data).toBe("foo.bar.baz")
          }
        }
      }
    },
    subscriptions: [
      (_, actions) => actions.foo.bar.baz("foo.bar.baz")
    ],
    view: _ => h("div", {}, "")
  })
})
