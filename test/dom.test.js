import { createNode, app } from "../src"

function testTreeSegue(name, trees) {
  test(name, done => {
    const state = {
      index: 0
    }

    const actions = {
      up: () => state => ({ index: state.index + 1 }),
      next: () => (state, actions) => {
        expect(document.body.innerHTML).toBe(
          `<main>${trees[state.index].html.replace(/\s{2,}/g, "")}</main>`
        )

        if (state.index === trees.length - 1) {
          return done()
        }

        actions.up()
      }
    }

    const view = (state, actions) =>
      createNode(
        "main",
        {
          oncreate: actions.next,
          onupdate: actions.next
        },
        [trees[state.index].tree]
      )

    app(state, actions, view, document.body)
  })
}

beforeEach(() => {
  document.body.innerHTML = ""
})

testTreeSegue("replace element", [
  {
    tree: createNode("main", {}),
    html: `<main></main>`
  },
  {
    tree: createNode("div", {}),
    html: `<div></div>`
  }
])

testTreeSegue("replace child", [
  {
    tree: createNode("main", {}, [createNode("div", {}, "foo")]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  },
  {
    tree: createNode("main", {}, [createNode("main", {}, "bar")]),
    html: `
        <main>
          <main>bar</main>
        </main>
      `
  }
])

testTreeSegue("insert children on top", [
  {
    tree: createNode("main", {}, [
      createNode(
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
    tree: createNode("main", {}, [
      createNode(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      createNode("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    tree: createNode("main", {}, [
      createNode(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      createNode("div", { key: "b" }, "B"),
      createNode("div", { key: "a" }, "A")
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
    tree: createNode("main", {}, [
      createNode(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      createNode("div", { key: "c" }, "C"),
      createNode("div", { key: "b" }, "B"),
      createNode("div", { key: "a" }, "A")
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

testTreeSegue("remove text node", [
  {
    tree: createNode("main", {}, [createNode("div", {}, ["foo"]), "bar"]),
    html: `
        <main>
          <div>foo</div>
          bar
        </main>
      `
  },
  {
    tree: createNode("main", {}, [createNode("div", {}, ["foo"])]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  }
])

testTreeSegue("replace keyed", [
  {
    tree: createNode("main", {}, [
      createNode(
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
    tree: createNode("main", {}, [
      createNode(
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

testTreeSegue("reorder keyed", [
  {
    tree: createNode("main", {}, [
      createNode(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      createNode(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      createNode(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      createNode(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      createNode(
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
    tree: createNode("main", {}, [
      createNode("div", { key: "e" }, "E"),
      createNode("div", { key: "a" }, "A"),
      createNode("div", { key: "b" }, "B"),
      createNode("div", { key: "c" }, "C"),
      createNode("div", { key: "d" }, "D")
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
    tree: createNode("main", {}, [
      createNode("div", { key: "e" }, "E"),
      createNode("div", { key: "d" }, "D"),
      createNode("div", { key: "a" }, "A"),
      createNode("div", { key: "c" }, "C"),
      createNode("div", { key: "b" }, "B")
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
    tree: createNode("main", {}, [
      createNode("div", { key: "c" }, "C"),
      createNode("div", { key: "e" }, "E"),
      createNode("div", { key: "b" }, "B"),
      createNode("div", { key: "a" }, "A"),
      createNode("div", { key: "d" }, "D")
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

testTreeSegue("grow/shrink keyed", [
  {
    tree: createNode("main", {}, [
      createNode(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      createNode(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      createNode(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      createNode(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      createNode(
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
    tree: createNode("main", {}, [
      createNode("div", { key: "a" }, "A"),
      createNode("div", { key: "c" }, "C"),
      createNode("div", { key: "d" }, "D")
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
    tree: createNode("main", {}, [createNode("div", { key: "d" }, "D")]),
    html: `
        <main>
          <div id="d">D</div>
        </main>
      `
  },
  {
    tree: createNode("main", {}, [
      createNode(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      createNode(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      createNode(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      createNode("div", { key: "d" }, "D"),
      createNode(
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
    tree: createNode("main", {}, [
      createNode("div", { key: "d" }, "D"),
      createNode("div", { key: "c" }, "C"),
      createNode("div", { key: "b" }, "B"),
      createNode("div", { key: "a" }, "A")
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

testTreeSegue("mixed keyed/non-keyed", [
  {
    tree: createNode("main", {}, [
      createNode(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      createNode("div", {}, "B"),
      createNode("div", {}, "C"),
      createNode(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      createNode(
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
    tree: createNode("main", {}, [
      createNode("div", { key: "e" }, "E"),
      createNode("div", {}, "C"),
      createNode("div", {}, "B"),
      createNode("div", { key: "d" }, "D"),
      createNode("div", { key: "a" }, "A")
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
    tree: createNode("main", {}, [
      createNode("div", {}, "C"),
      createNode("div", { key: "d" }, "D"),
      createNode("div", { key: "a" }, "A"),
      createNode("div", { key: "e" }, "E"),
      createNode("div", {}, "B")
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
    tree: createNode("main", {}, [
      createNode("div", { key: "e" }, "E"),
      createNode("div", { key: "d" }, "D"),
      createNode("div", {}, "B"),
      createNode("div", {}, "C")
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

testTreeSegue("styles", [
  {
    tree: createNode("div"),
    html: `<div></div>`
  },
  {
    tree: createNode("div", { style: { color: "red", fontSize: "1em" } }),
    html: `<div style="color: red; font-size: 1em;"></div>`
  },
  {
    tree: createNode("div", { style: { color: "blue", float: "left" } }),
    html: `<div style="color: blue; float: left;"></div>`
  },
  {
    tree: createNode("div"),
    html: `<div style=""></div>`
  }
])

testTreeSegue("update element data", [
  {
    tree: createNode("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    tree: createNode("div", { id: "foo", class: "baz" }),
    html: `<div id="foo" class="baz"></div>`
  }
])

testTreeSegue("removeAttribute", [
  {
    tree: createNode("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    tree: createNode("div"),
    html: `<div></div>`
  }
])

testTreeSegue("skip setAttribute for functions", [
  {
    tree: createNode("div", {
      onclick() {}
    }),
    html: `<div></div>`
  }
])

testTreeSegue("setAttribute true", [
  {
    tree: createNode("div", {
      enabled: true
    }),
    html: `<div enabled="true"></div>`
  }
])

testTreeSegue("update element with dynamic props", [
  {
    tree: createNode("input", {
      type: "text",
      value: "foo",
      oncreate(element) {
        expect(element.value).toBe("foo")
      }
    }),
    html: `<input type="text">`
  },
  {
    tree: createNode("input", {
      type: "text",
      value: "bar",
      onupdate(element) {
        expect(element.value).toBe("bar")
      }
    }),
    html: `<input type="text">`
  }
])

testTreeSegue("don't touch textnodes if equal", [
  {
    tree: createNode(
      "main",
      {
        oncreate(element) {
          element.childNodes[0].textContent = "foobar"
        }
      },
      "foo"
    ),
    html: `<main>foobar</main>`
  },
  {
    tree: createNode("main", {}, "foobar"),
    html: `<main>foobar</main>`
  }
])

testTreeSegue("a list with empty text nodes", [
  {
    tree: createNode("ul", {}, [
      createNode("li", {}, ""),
      createNode("div", {}, "foo")
    ]),
    html: `<ul><li></li><div>foo</div></ul>`
  },
  {
    tree: createNode("ul", {}, [
      createNode("li", {}, ""),
      createNode("li", {}, ""),
      createNode("div", {}, "foo")
    ]),
    html: `<ul><li></li><li></li><div>foo</div></ul>`
  },
  {
    tree: createNode("ul", {}, [
      createNode("li", {}, ""),
      createNode("li", {}, ""),
      createNode("li", {}, ""),
      createNode("div", {}, "foo")
    ]),
    html: `<ul><li></li><li></li><li></li><div>foo</div></ul>`
  }
])

testTreeSegue("elements with falsey values", [
  {
    tree: createNode("div", {
      "data-test": "foo"
    }),
    html: `<div data-test="foo"></div>`
  },
  {
    tree: createNode("div", {
      "data-test": "0"
    }),
    html: `<div data-test="0"></div>`
  },
  {
    tree: createNode("div", {
      "data-test": 0
    }),
    html: `<div data-test="0"></div>`
  },
  {
    tree: createNode("div", {
      "data-test": null
    }),
    html: `<div></div>`
  },
  {
    tree: createNode("div", {
      "data-test": false
    }),
    html: `<div></div>`
  },
  {
    tree: createNode("div", {
      "data-test": undefined
    }),
    html: `<div></div>`
  }
])

testTreeSegue("input list attribute", [
  {
    tree: createNode("input", {
      list: "foobar"
    }),
    html: `<input list="foobar">`
  }
])
