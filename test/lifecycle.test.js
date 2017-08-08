import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("oncreate", done => {
  app({
    view: () =>
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
  })
})

test("onupdate", done => {
  app({
    view: (state, actions) =>
      h(
        "div",
        {
          class: state.value,
          oncreate() {
            actions.repaint()
          },
          onupdate(element, oldProps) {
            //
            // onupdate fires after the element's data is updated and
            // the element is patched. Note that we call this event
            // even if the element's data didn't change.
            //
            expect(element.textContent).toBe("foo")
            expect(oldProps.class).toBe("foo")
            done()
          }
        },
        state.value
      ),
    state: { value: "foo" },
    actions: {
      repaint(state) {
        return state
      }
    }
  })
})

test("onremove", done => {
  app({
    view: (state, actions) =>
      state.value
        ? h(
            "ul",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe(
                  "<ul><li></li><li></li></ul>"
                )
                actions.toggle()
              }
            },
            [
              h("li"),
              h("li", {
                onremove(element) {
                  //
                  // Be sure to remove the element inside this event.
                  //
                  element.parentNode.removeChild(element)
                  expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                  done()
                }
              })
            ]
          )
        : h("ul", {}, [h("li")]),
    state: {
      value: true
    },
    actions: {
      toggle(state) {
        return {
          value: !state.value
        }
      }
    }
  })
})

test("event bubling", done => {
  let count = 0

  app({
    state: {
      value: true
    },
    view: (state, actions) =>
      h(
        "main",
        {
          oncreate() {
            expect(count++).toBe(3)
            actions.update()
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
      ),
    actions: {
      update(state) {
        return { value: !state.value }
      }
    }
  })
})
