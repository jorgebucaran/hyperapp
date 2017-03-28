import { app, h } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

test("DOMContentLoaded", done => {
  Object.defineProperty(document, "readyState", {
    writable: true
  })

  window.document.readyState = "loading"

  app({
    subscriptions: [done]
  })

  window.document.readyState = "complete"

  const event = document.createEvent("Event")
  event.initEvent("DOMContentLoaded", true, true)
  window.document.dispatchEvent(event)
})

test("render a model", () => {
  app({
    model: "foo",
    view: model => h("div", {}, model)
  })

  expectHTMLToBe(`
    <div>
      foo
    </div>
  `)
})

test("render a model with a loop", () => {
  app({
    model: ["foo", "bar", "baz"],
    view: model => h("ul", {}, model.map(i => h("li", {}, i)))
  })

  expectHTMLToBe(`
    <ul>
      <li>foo</li>
      <li>bar</li>
      <li>baz</li>
    </ul>
  `)
})

test("render an svg element", () => {
  app({
    view: _ => h("svg", { id: "foo" }, "bar")
  })

  const elm = document.getElementById("foo")
  expect(elm.namespaceURI).toBe("http://www.w3.org/2000/svg")
})

test("render svg elements recursively", () => {
  const SVG_NS = "http://www.w3.org/2000/svg"

  app({
    view: _ => h("div", {}, [
      h("p", { id: "foo" }, "foo"),
      h("svg", { id: "bar" }, [
        h("quux", {}, [
          h("beep", {}, [
            h("ping", {}),
            h("pong", {})
          ]),
          h("bop", {}),
          h("boop", {}, [
            h("ping", {}),
            h("pong", {})
          ])
        ]),
        h("xuuq", {}, [
          h("beep", {}),
          h("bop", {}, [
            h("ping", {}),
            h("pong", {})
          ]),
          h("boop", {})
        ])
      ]),
      h("p", { id: "baz" }, "baz")
    ])
  })

  expect(document.getElementById("foo").namespaceURI).not.toBe(SVG_NS)
  expect(document.getElementById("baz").namespaceURI).not.toBe(SVG_NS)

  const svg = document.getElementById("bar")
  expect(svg.namespaceURI).toBe(SVG_NS)
  expectChildren(svg)

  function expectChildren(svgElement) {
    Array.from(svgElement.childNodes).forEach(node =>
      expectChildren(node, expect(node.namespaceURI).toBe(SVG_NS)))
  }
})

test("null or undefined data is safe", () => {
  app({
    view: model => h("div", null, [
      h("div", undefined, "foo")
    ])
  })

  expectHTMLToBe(`
    <div>
      <div>
        foo
      </div>
    </div>
  `)
})

test("toggle class attributes", () => {
  app({
    model: true,
    view: model => h("div", model ? { class: "foo" } : {}, "bar"),
    actions: {
      toggle: model => !model
    },
    subscriptions: [
      (_, actions) => {
        expectHTMLToBe(`
          <div class="foo">
            bar
          </div>
        `)

        actions.toggle()

        expectHTMLToBe(`
          <div>
            bar
          </div>
        `)
      }
    ]
  })
})

test("update/remove element data", () => {
  app({
    model: false,
    actions: {
      toggle: model => !model
    },
    view: model => h("div", model
      ?
      {
        id: "xuuq",
        foo: true,
        style: {
          width: "100px",
          height: "200px"
        }
      }
      :
      {
        id: "quux",
        class: "foo",
        style: {
          color: "red",
          height: "100px"
        },
        foo: true,
        baz: false
      }, "bar"
    ),
    subscriptions: [
      (_, actions) => {
        expectHTMLToBe(`
          <div id="quux" class="foo" style="color: red; height: 100px;" foo="true">
            bar
          </div>
        `)

        actions.toggle()

        expectHTMLToBe(`
          <div id="xuuq" style="height: 200px; width: 100px;" foo="true">
            bar
          </div>
        `)
      }
    ]
  })
})

test("sync selectionStart/selectionEnd in text inputs after update", () => {
  app({
    model: "foo",
    actions: {
      setText: model => "bar"
    },
    view: model => h("input", { id: "foo", value: model }),
    subscriptions: [
      (_, actions) => {
        const input = document.getElementById("foo")

        expect(input.selectionStart).toBe(0)
        expect(input.selectionEnd).toBe(0)

        input.setSelectionRange(2, 2)

        actions.setText()

        expect(input.selectionStart).toBe(2)
        expect(input.selectionEnd).toBe(2)
      }
    ]
  })
})

// lifecycle
test("onCreate", done => {
  app({
    model: 1,
    view: model => h("div", {
      onCreate: e => {
        expect(model).toBe(1)
        done()
      }
    })
  })
})

test("onUpdate", done => {
  app({
    model: 1,
    view: model => h("div", {
      onUpdate: e => {
        expect(model).toBe(2)
        done()
      }
    }),
    actions: {
      add: model => model + 1
    },
    subscriptions: [
      (_, actions) => actions.add()
    ]
  })
})

test("onRemove", done => {
  const treeA = h("ul", {},
    h("li", {}, "foo"),
    h("li", {
      onRemove: _ => {
        done()
      }
    }, "bar"))

  const treeB = h("ul", {}, h("li", {}, "foo"))

  app({
    model: true,
    view: _ => _ ? treeA : treeB,
    actions: {
      toggle: model => !model
    },
    subscriptions: [
      (_, actions) => actions.toggle()
    ]
  })
})


//subs
test("subscriptions run sequentially on load", () => {
  app({
    model: 1,
    actions: {
      step: model => model + 1
    },
    subscriptions: [
      (_, actions) => actions.step(),
      (_, actions) => actions.step(),
      model => expect(model).toBe(3)
    ]
  })
})

//hooks
test("onAction/onUpdate/onRender", done => {
  app({
    model: "foo",
    view: model => h("div", {}, model),
    actions: {
      set: (_, data) => data
    },
    subscriptions: [
      (_, actions) => actions.set("bar")
    ],
    hooks: {
      onAction: (action, data) => {
        expect(action).toBe("set")
        expect(data).toBe("bar")
      },
      onUpdate: (oldModel, newModel, data) => {
        expect(oldModel).toBe("foo")
        expect(newModel).toBe("bar")
        expect(data).toBe("bar")
      },
      onRender: (model, view) => {
        if (model === "foo") {
          expect(view("bogus")).toEqual({
            tag: "div",
            data: {},
            children: ["bogus"]
          })

          return view

        } else {
          expect(model).toBe("bar")
          done()

          return view
        }
      }
    }
  })
})

test("onAction and nested actions", done => {
  app({
    model: "foo",
    actions: {
      foo: {
        bar: {
          baz: {
            set: (_, data) => data
          }
        }
      }
    },
    hooks: {
      onAction: (name, data) => {
        expect(name).toBe("foo.bar.baz.set")
        expect(data).toBe("baz")
        done()
      }
    },
    subscriptions: [
      (_, actions) => actions.foo.bar.baz.set("baz")
    ]
  })
})

test("onError", done => {
  app({
    hooks: {
      onError: err => {
        expect(err).toBe("foo")
        done()
      }
    },
    subscriptions: [
      (model, actions, error) => {
        error("foo")
      }
    ]
  })
})

test("throw without onError", () => {
  app({
    subscriptions: [
      (model, actions, error) => {
        try {
          error("foo")
        } catch (err) {
          expect(err).toBe("foo")
        }
      }
    ]
  })
})

test("allow multiple listeners on the same hook", () => {
  let count = 0

  const PluginA = _ => ({
    hooks: {
      onAction: (action, data) => {
        expect(action).toBe("foo")
        expect(data).toBe("bar")
        expect(++count).toBe(2)
      },
      onUpdate: (oldModel, newModel) => {
        expect(oldModel).toBe("foo")
        expect(newModel).toBe("foobar")
        expect(++count).toBe(5)
      }
    }
  })

  const PluginB = _ => ({
    hooks: {
      onAction: (action, data) => {
        expect(action).toBe("foo")
        expect(data).toBe("bar")
        expect(++count).toBe(3)
      },
      onUpdate: (oldModel, newModel) => {
        expect(oldModel).toBe("foo")
        expect(newModel).toBe("foobar")
        expect(++count).toBe(6)
      }
    }
  })

  app({
    model: "foo",
    plugins: [PluginA, PluginB],
    actions: {
      foo: (model, data) => model + data
    },
    hooks: {
      onAction: (action, data) => {
        expect(action).toBe("foo")
        expect(data).toBe("bar")
        expect(++count).toBe(1)
      },
      onUpdate: (oldModel, newModel) => {
        expect(oldModel).toBe("foo")
        expect(newModel).toBe("foobar")
        expect(++count).toBe(4)
      }
    },
    subscriptions: [
      (_, actions) => actions.foo("bar")
    ]
  })
})

