import { createNode, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("oncreate", done => {
  const view = () =>
    createNode(
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

  app({}, {}, view, document.body)
})

test("onupdate", done => {
  const state = { value: "foo" }
  const actions = {
    setValue: value => ({ value })
  }

  const view = (state, actions) =>
    createNode(
      "div",
      {
        class: state.value,
        oncreate() {
          actions.setValue("bar")
        },
        onupdate(element, oldProps) {
          expect(element.textContent).toBe("bar")
          expect(oldProps.class).toBe("foo")
          done()
        }
      },
      state.value
    )

  app(state, actions, view, document.body)
})

test("onremove", done => {
  const state = {
    value: true
  }

  const actions = {
    toggle: () => state => ({ value: !state.value })
  }

  const view = (state, actions) =>
    state.value
      ? createNode(
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
            createNode("li"),
            createNode("li", {
              onremove(element, remove) {
                remove()
                expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                done()
              }
            })
          ]
        )
      : createNode("ul", {}, [createNode("li")])

  app(state, actions, view, document.body)
})

test("ondestroy", done => {
  let removed = false

  const state = {
    value: true
  }

  const actions = {
    toggle: () => state => ({ value: !state.value })
  }

  const view = (state, actions) =>
    state.value
      ? createNode(
          "ul",
          {
            oncreate: () => actions.toggle()
          },
          [
            createNode("li"),
            createNode("li", {}, [
              createNode("span", {
                ondestroy() {
                  expect(removed).toBe(false)
                  done()
                }
              })
            ])
          ]
        )
      : createNode("ul", {}, [createNode("li")])

  app(state, actions, view, document.body)
})

test("onremove/ondestroy", done => {
  let detached = false

  const state = {
    value: true
  }

  const actions = {
    toggle: () => state => ({ value: !state.value })
  }

  const view = (state, actions) =>
    state.value
      ? createNode(
          "ul",
          {
            oncreate() {
              actions.toggle()
            }
          },
          [
            createNode("li"),
            createNode("li", {
              ondestroy() {
                detached = true
              },
              onremove(element, remove) {
                expect(detached).toBe(false)
                remove()
                expect(detached).toBe(true)
                done()
              }
            })
          ]
        )
      : createNode("ul", {}, [createNode("li")])

  app(state, actions, view, document.body)
})

test("event bubbling", done => {
  let count = 0

  const state = {
    value: true
  }

  const actions = {
    toggle: () => state => ({ value: !state.value })
  }

  const view = (state, actions) =>
    createNode(
      "main",
      {
        oncreate() {
          expect(count++).toBe(3)
          actions.toggle()
        },
        onupdate() {
          expect(count++).toBe(7)
          done()
        }
      },
      [
        createNode("p", {
          oncreate() {
            expect(count++).toBe(2)
          },
          onupdate() {
            expect(count++).toBe(6)
          }
        }),
        createNode("p", {
          oncreate() {
            expect(count++).toBe(1)
          },
          onupdate() {
            expect(count++).toBe(5)
          }
        }),
        createNode("p", {
          oncreate() {
            expect(count++).toBe(0)
          },
          onupdate() {
            expect(count++).toBe(4)
          }
        })
      ]
    )

  app(state, actions, view, document.body)
})
