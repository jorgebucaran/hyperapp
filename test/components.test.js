import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("components", done => {
  const Component = (props, children) => h("div", props, children)

  const view = () =>
    h(
      Component,
      {
        oncreate() {
          expect(document.body.innerHTML).toBe("<div>foo<div>bar</div></div>")
          done()
        }
      },
      ["foo", h(Component, {}, "bar")]
    )

  app({}, {}, view, document.body)
})

test("nested components", done => {
  const Child = (props, children) => h("div", props, children)
  const Parent = (props, children) => h(Child, props, children)

  const view = () =>
    h(
      Parent,
      {
        oncreate() {
          expect(document.body.innerHTML).toBe("<div>foo</div>")
          done()
        }
      },
      ["foo"]
    )

  app({}, {}, view, document.body)
})

test("component with no props adds default props", done => {
  const Component = ({ name = "world" }, children) =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe("<div>Hello world</div>")
          done()
        }
      },
      "Hello " + name
    )

  const view = () => h(Component)

  app({}, {}, view, document.body)
})
