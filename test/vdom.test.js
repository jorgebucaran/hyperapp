import { h, app } from "../src"

function testTrees(name, trees) {
  test(name, done => {
    app({
      root: document.body,
      view: (state, actions) =>
        h(
          "main",
          {
            oncreate: actions.next,
            onupdate: actions.next
          },
          [trees[state.index].tree]
        ),
      state: {
        index: 0
      },
      actions: {
        up(state) {
          return { index: state.index + 1 }
        },
        next(state, actions) {
          expect(document.body.innerHTML).toBe(
            `<main>${trees[state.index].html.replace(/\s{2,}/g, "")}</main>`
          )

          if (state.index === trees.length - 1) {
            return done()
          }

          actions.up()
        }
      }
    })
  })
}

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

testTrees("replace element", [
  {
    tree: h("main", {}),
    html: `<main></main>`
  },
  {
    tree: h("div", {}),
    html: `<div></div>`
  }
])

testTrees("replace child", [
  {
    tree: h("main", {}, [h("div", {}, "foo")]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [h("main", {}, "bar")]),
    html: `
        <main>
          <main>bar</main>
        </main>
      `
  }
])

testTrees("insert children on top", [
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="d">D</div>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  }
])

testTrees("remove text node", [
  {
    tree: h("main", {}, [h("div", {}, ["foo"]), "bar"]),
    html: `
        <main>
          <div>foo</div>
          bar
        </main>
      `
  },
  {
    tree: h("main", {}, [h("div", {}, ["foo"])]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  }
])

testTrees("replace keyed", [
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      )
    ]),
    html: `
        <main>
          <div id="b">B</div>
        </main>
      `
  }
])

testTrees("reorder keyed", [
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="d">D</div>
          <div id="a">A</div>
          <div id="c">C</div>
          <div id="b">B</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h("div", { key: "c" }, "C"),
      h("div", { key: "e" }, "E"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="c">C</div>
          <div id="e">E</div>
          <div id="b">B</div>
          <div id="a">A</div>
          <div id="d">D</div>
        </main>
      `
  }
])

testTrees("grow/shrink keyed", [
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h("div", { key: "a" }, "A"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="c">C</div>
          <div id="d">D</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [h("div", { key: "d" }, "D")]),
    html: `
        <main>
          <div id="d">D</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h("div", { key: "d" }, "D"),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h("div", { key: "d" }, "D"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="d">D</div>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  }
])

testTrees("mixed keyed/non-keyed", [
  {
    tree: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h("div", {}, "B"),
      h("div", {}, "C"),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div>B</div>
          <div>C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", {}, "C"),
      h("div", {}, "B"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div>C</div>
          <div>B</div>
          <div id="d">D</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h("div", {}, "C"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "e" }, "E"),
      h("div", {}, "B")
    ]),
    html: `
        <main>
          <div>C</div>
          <div id="d">D</div>
          <div id="a">A</div>
          <div id="e">E</div>
          <div>B</div>
        </main>
      `
  },
  {
    tree: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "d" }, "D"),
      h("div", {}, "B"),
      h("div", {}, "C")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="d">D</div>
          <div>B</div>
          <div>C</div>
        </main>
      `
  }
])

testTrees("styles", [
  {
    tree: h("div"),
    html: `<div></div>`
  },
  {
    tree: h("div", { style: { color: "red", fontSize: "1em" } }),
    html: `<div style="color: red; font-size: 1em;"></div>`
  },
  {
    tree: h("div", { style: { color: "blue", float: "left" } }),
    html: `<div style="color: blue; float: left;"></div>`
  },
  {
    tree: h("div"),
    html: `<div style=""></div>`
  }
])

testTrees("update element data", [
  {
    tree: h("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    tree: h("div", { id: "foo", class: "baz" }),
    html: `<div id="foo" class="baz"></div>`
  }
])

testTrees("removeAttribute", [
  {
    tree: h("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    tree: h("div"),
    html: `<div></div>`
  }
])

testTrees("skip setAttribute for functions", [
  {
    tree: h("div", {
      onclick() {
        /**/
      }
    }),
    html: `<div></div>`
  }
])

testTrees("update element with dynamic props", [
  {
    tree: h("input", {
      type: "text",
      oncreate(element) {
        element.value = "bar"
      },
      value: "foo"
    }),
    html: `<input type="text" value="foo">`
  },
  {
    tree: h("input", {
      type: "text",
      onupdate(element) {
        expect(element.value).toBe("foo")
      },
      value: "foo"
    }),
    html: `<input type="text" value="foo">`
  }
])

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
