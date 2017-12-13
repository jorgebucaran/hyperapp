import { h, app } from "../src"

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
    state: { value: "foo" },

    view: state => actions =>
      h(
        "div",
        {
          class: state.value,
          oncreate() {
            actions.repaint()
          },
          onupdate(element, oldProps) {
            expect(element.textContent).toBe("foo")
            expect(oldProps.class).toBe("foo")
            done()
          }
        },
        state.value
      ),
    actions: {
      repaint: () => ({})
    }
  })
})

test("onremove", done => {
  app({
    state: {
      value: true
    },
    view: state => actions =>
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
                onremove(element, remove) {
                  remove()
                  expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                  done()
                }
              })
            ]
          )
        : h("ul", {}, [h("li")]),
    actions: {
      toggle: () => state => ({ value: !state.value })
    }
  })
})

test("ondestroy", done => {
  let destroyed = false
  app({
    state: {
      value: true
    },
    view: state => actions =>
      state.value
        ? h(
            "ul",
            {
              oncreate: () => actions.toggle()
            },
            [
              h("li"),
              h("li", {
                onremove(element, remove) {
                  expect(destroyed).toBe(false)
                  remove()
                  expect(destroyed).toBe(true)
                  done()
                },
                ondestroy() {
                  destroyed = true
                }
              })
            ]
          )
        : h("ul", {}, [h("li")]),
    actions: {
      toggle: () => state => ({ value: !state.value })
    }
  })
})

test("nested ondestroy", done => {
  let removed = false
  app({
    state: {
      value: true
    },
    view: state => actions =>
      state.value
        ? h(
            "ul",
            {
              oncreate: () => actions.toggle()
            },
            [
              h("li"),
              h("li", {}, [
                h("span", {
                  onremove(element, remove) {
                    removed = true
                    remove()
                  },
                  ondestroy() {
                    expect(removed).toBe(false)
                    done()
                  }
                })
              ])
            ]
          )
        : h("ul", {}, [h("li")]),
    actions: {
      toggle: () => state => ({ value: !state.value })
    }
  })
})

test("several nested ondestroy", done => {
  let childDestroyed = false
  app({
    state: {
      value: true
    },
    view: state => actions =>
      state.value
        ? h(
            "ul",
            {
              oncreate: () => actions.toggle()
            },
            [
              h("li"),
              h("li", {}, [
                h("span", {
                  ondestroy() {
                    expect(childDestroyed).toBe(true)
                    done()
                  }
                }, [
                  h("strong", {
                    ondestroy() {
                      childDestroyed = true
                    }
                  })
                ])
              ])
            ]
          )
        : h("ul", {}, [h("li")]),
    actions: {
      toggle: () => state => ({ value: !state.value })
    }
  })
})

test("event bubling", done => {
  let count = 0
  app({
    state: {
      value: true
    },
    view: state => actions =>
      h(
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
      toggle: () => state => ({ value: !state.value })
    }
  })
})
