import { app, h } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

test("extend the model", () => {
  const Plugin = app => ({
    model: {
      "bar": app.model.foo
    }
  })

  app({
    model: {
      foo: true
    },
    plugins: [Plugin],
    subscriptions: [
      model => {
        expect(model).toEqual({
          foo: true,
          bar: true
        })
      }
    ]
  })
})

test("add subscriptions", () => {
  const Plugin = app => ({
    subscriptions: [
      (model, actions) => {
        actions.add()
        expectHTMLToBe(`
          <div>
            3
          </div>
        `)
      }
    ]
  })

  app({
    model: 1,
    view: model => h("div", {}, model),
    actions: {
      add: model => model + 1
    },
    subscriptions: [
      (_, actions) => {
        expectHTMLToBe(`
          <div>
            1
          </div>
        `)

        actions.add()

        expectHTMLToBe(`
          <div>
            2
          </div>
        `)
      }
    ],
    plugins: [Plugin]
  })
})

test("add actions", () => {
  const Plugin = app => ({
    actions: {
      foo: {
        bar: {
          baz: {
            toggle: model => !model
          }
        }
      }
    }
  })

  app({
    model: true,
    view: model => h("div", {}, `${model}`),
    subscriptions: [
      (_, actions) => {
        expectHTMLToBe(`
          <div>
            true
          </div>
        `)

        actions.foo.bar.baz.toggle()

        expectHTMLToBe(`
          <div>
            false
          </div>
        `)
      }
    ],
    plugins: [Plugin]
  })
})

test("hooks with multiple listeners", () => {
  const PluginFoo = app => ({
    hooks: {
      onRender: (model, view) => model => h("foo", {}, view(model))
    }
  })
  const PluginBar = app => ({
    hooks: {
      onRender: (model, view) => model => h("bar", {}, view(model))
    }
  })

  app({
    model: "foo",
    view: model => h("div", {}, model),
    plugins: [PluginFoo, PluginBar]
  })

  expectHTMLToBe(`
    <bar>
      <foo>
        <div>
          foo
        </div>
      </foo>
    </bar>
  `)
})

test("don't overwrite actions in the same namespace", () => {
  const Plugin = app => ({
    actions: {
      foo: {
        bar: {
          baz: (model, data) => {
            expect(model).toBe(true)
            expect(data).toBe("foo.bar.baz")
            return model
          }
        }
      }
    },
  })

  app({
    model: true,
    actions: {
      foo: {
        bar: {
          qux: (model, data) => {
            expect(model).toBe(true)
            expect(data).toBe("foo.bar.qux")
          }
        }
      }
    },
    subscriptions: [
      (_, actions) => actions.foo.bar.baz("foo.bar.baz"),
      (_, actions) => actions.foo.bar.qux("foo.bar.qux"),
    ],
    view: _ => h("div", {}, ""),
    plugins: [Plugin]
  })
})
