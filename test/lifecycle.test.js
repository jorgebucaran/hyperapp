import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("oncreate", done => {
  const view = () =>
    h(
      "div",
      {
        oncreate(element) {
          element.className = "foo"
          expect(document.body.innerHTML).toBe(`<div class="foo">foo</div>`)
          done()
        }
      },
      "foo"
    )
  app({}, view)
})

test("onupdate", done => {
  const model = { value: "foo", repaint: () => ({}) }

  const view = store =>
    h(
      "div",
      {
        class: store.value,
        oncreate() {
          store.repaint()
        },
        onupdate(element, oldProps) {
          expect(element.textContent).toBe("foo")
          expect(oldProps.class).toBe("foo")
          done()
        }
      },
      store.value
    )

  app(model, view)
})

test("onremove", done => {
  const model = {
    value: true,
    toggle: () => store => ({ value: !store.value })
  }

  const view = store =>
    store.value
      ? h(
          "ul",
          {
            oncreate() {
              expect(document.body.innerHTML).toBe(
                "<ul><li></li><li></li></ul>"
              )
              store.toggle()
            }
          },
          [
            h("li"),
            h("li", {
              onremove(element, remove) {
                remove()
                expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                done()
              }
            })
          ]
        )
      : h("ul", {}, [h("li")])

  app(model, view)
})

test("event bubling", done => {
  let count = 0
  
  const model = {
    value: true,
    toggle: () => store => ({ value: !store.value })
  }

  const view = store =>
    h(
      "main",
      {
        oncreate() {
          expect(count++).toBe(3)
          store.toggle()
        },
        onupdate() {
          expect(count++).toBe(7)
          done()
        }
      },
      [
        h("p", {
          oncreate() {
            expect(count++).toBe(2)
          },
          onupdate() {
            expect(count++).toBe(6)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(1)
          },
          onupdate() {
            expect(count++).toBe(5)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(0)
          },
          onupdate() {
            expect(count++).toBe(4)
          }
        })
      ]
    )

  app(model, view)
})
