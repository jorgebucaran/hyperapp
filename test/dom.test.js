import { h, app } from "../src"

const testVdomToHtml = (name, trees) => {
  test(name, done => {
    const state = { index: 0 }

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

    const view = (state, actions) => (
      <main oncreate={actions.next} onupdate={actions.next}>
        {trees[state.index].vdom}
      </main>
    )

    app(state, actions, view, document.body)
  })
}

const setIdToKey = key => element => {
  element.id = key
}

beforeEach(() => {
  document.body.innerHTML = ""
})

testVdomToHtml("replace element", [
  {
    vdom: <main />,
    html: `<main></main>`
  },
  {
    vdom: <div />,
    html: `<div></div>`
  }
])

testVdomToHtml("replace child", [
  {
    vdom: (
      <main>
        <div>foo</div>
      </main>
    ),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  },
  {
    vdom: (
      <main>
        <main>bar</main>
      </main>
    ),
    html: `
        <main>
          <main>bar</main>
        </main>
      `
  }
])

testVdomToHtml("insert children on top", [
  {
    vdom: (
      <main>
        <div key="a" oncreate={setIdToKey("a")}>
          A
        </div>
      </main>
    ),
    html: `
        <main>
          <div id="a">A</div>
        </main>
      `
  },
  {
    vdom: (
      <main>
        <div key="b" oncreate={setIdToKey("b")}>
          B
        </div>
        <div key="a">A</div>
      </main>
    ),
    html: `
        <main>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    vdom: (
      <main>
        <div key="c" oncreate={setIdToKey("c")}>
          C
        </div>
        <div key="b">B</div>
        <div key="a">A</div>
      </main>
    ),
    html: `
        <main>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  }
])

testVdomToHtml("remove text node", [
  {
    vdom: (
      <main>
        <div>foo</div>
        bar
      </main>
    ),
    html: `
        <main>
          <div>foo</div>
          bar
        </main>
      `
  },
  {
    vdom: (
      <main>
        <div>foo</div>
      </main>
    ),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  }
])

testVdomToHtml("replace keyed", [
  {
    vdom: (
      <main>
        <div key="a" oncreate={setIdToKey("a")}>
          A
        </div>
      </main>
    ),
    html: `
        <main>
          <div id="a">A</div>
        </main>
      `
  },
  {
    vdom: (
      <main>
        <div key="b" oncreate={setIdToKey("b")}>
          B
        </div>
      </main>
    ),
    html: `
        <main>
          <div id="b">B</div>
        </main>
      `
  }
])

testVdomToHtml("reorder keyed", [
  {
    vdom: (
      <main>
        <div key="a" oncreate={setIdToKey("a")}>
          A
        </div>
        <div key="b" oncreate={setIdToKey("b")}>
          B
        </div>
        <div key="c" oncreate={setIdToKey("c")}>
          C
        </div>
        <div key="d" oncreate={setIdToKey("d")}>
          D
        </div>
        <div key="e" oncreate={setIdToKey("e")}>
          E
        </div>
      </main>
    ),
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
    vdom: (
      <main>
        <div key="e">E</div>
        <div key="a">A</div>
        <div key="b">B</div>
        <div key="c">C</div>
        <div key="d">D</div>
      </main>
    ),
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
    vdom: (
      <main>
        <div key="e">E</div>
        <div key="d">D</div>
        <div key="a">A</div>
        <div key="c">C</div>
        <div key="b">B</div>
      </main>
    ),
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
    vdom: (
      <main>
        <div key="c">C</div>
        <div key="e">E</div>
        <div key="b">B</div>
        <div key="a">A</div>
        <div key="d">D</div>
      </main>
    ),
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

testVdomToHtml("grow/shrink keyed", [
  {
    vdom: (
      <main>
        <div key="a" oncreate={setIdToKey("a")}>
          A
        </div>
        <div key="b" oncreate={setIdToKey("b")}>
          B
        </div>
        <div key="c" oncreate={setIdToKey("c")}>
          C
        </div>
        <div key="d" oncreate={setIdToKey("d")}>
          D
        </div>
        <div key="e" oncreate={setIdToKey("e")}>
          E
        </div>
      </main>
    ),
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
    vdom: (
      <main>
        <div key="a">A</div>
        <div key="c">C</div>
        <div key="d">D</div>
      </main>
    ),
    html: `
        <main>
          <div id="a">A</div>
          <div id="c">C</div>
          <div id="d">D</div>
        </main>
      `
  },
  {
    vdom: (
      <main>
        <div key="d">D</div>
      </main>
    ),
    html: `
        <main>
          <div id="d">D</div>
        </main>
      `
  },
  {
    vdom: (
      <main>
        <div key="a" oncreate={setIdToKey("a")}>
          A
        </div>
        <div key="b" oncreate={setIdToKey("b")}>
          B
        </div>
        <div key="c" oncreate={setIdToKey("c")}>
          C
        </div>
        <div key="d" oncreate={setIdToKey("d")}>
          D
        </div>
        <div key="e" oncreate={setIdToKey("e")}>
          E
        </div>
      </main>
    ),
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
    vdom: (
      <main>
        <div key="d">D</div>
        <div key="c">C</div>
        <div key="b">B</div>
        <div key="a">A</div>
      </main>
    ),
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

testVdomToHtml("mixed keyed/non-keyed", [
  {
    vdom: (
      <main>
        <div key="a" oncreate={setIdToKey("a")}>
          A
        </div>
        <div>B</div>
        <div>C</div>
        <div key="d" oncreate={setIdToKey("d")}>
          D
        </div>
        <div key="e" oncreate={setIdToKey("e")}>
          E
        </div>
      </main>
    ),
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
    vdom: (
      <main>
        <div key="e">E</div>
        <div>C</div>
        <div>B</div>
        <div key="d">D</div>
        <div key="a">A</div>
      </main>
    ),
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
    vdom: (
      <main>
        <div>C</div>
        <div key="d">D</div>
        <div key="a">A</div>
        <div key="e">E</div>
        <div>B</div>
      </main>
    ),
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
    vdom: (
      <main>
        <div key="e">E</div>
        <div key="d">D</div>
        <div>B</div>
        <div>C</div>
      </main>
    ),
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

testVdomToHtml("styles", [
  {
    vdom: <div />,
    html: `<div></div>`
  },
  {
    vdom: <div style={{ color: "red", fontSize: "1em", "--foo": "red" }} />,
    html: `<div style="color: red; font-size: 1em;"></div>`
  },
  {
    vdom: <div style={{ color: "blue", float: "left", "--foo": "blue" }} />,
    html: `<div style="color: blue; float: left;"></div>`
  },
  {
    vdom: <div style="" />,
    html: `<div style=""></div>`
  }
])

testVdomToHtml("update element data", [
  {
    vdom: <div id="foo" class="bar" />,
    html: `<div id="foo" class="bar"></div>`
  },
  {
    vdom: <div id="foo" class="baz" />,
    html: `<div id="foo" class="baz"></div>`
  }
])

testVdomToHtml("removeAttribute", [
  {
    vdom: <div id="foo" class="bar" />,
    html: `<div id="foo" class="bar"></div>`
  },
  {
    vdom: <div />,
    html: `<div></div>`
  }
])

testVdomToHtml("skip setAttribute for functions", [
  {
    vdom: <div oncreate={() => {}} />,
    html: `<div></div>`
  }
])

testVdomToHtml("setAttribute true", [
  {
    vdom: <div enabled="true" />,
    html: `<div enabled="true"></div>`
  }
])

testVdomToHtml("a list with empty text nodes", [
  {
    vdom: (
      <ul>
        <li />
        <div>foo</div>
      </ul>
    ),
    html: `<ul><li></li><div>foo</div></ul>`
  },
  {
    vdom: (
      <ul>
        <li />
        <li />
        <div>foo</div>
      </ul>
    ),
    html: `<ul><li></li><li></li><div>foo</div></ul>`
  },
  {
    vdom: (
      <ul>
        <li />
        <li />
        <li />
        <div>foo</div>
      </ul>
    ),
    html: `<ul><li></li><li></li><li></li><div>foo</div></ul>`
  }
])

testVdomToHtml("elements with falsey values", [
  {
    vdom: <div data-test={"0"} />,
    html: `<div data-test="0"></div>`
  },
  {
    vdom: <div data-test={0} />,
    html: `<div data-test="0"></div>`
  },
  {
    vdom: <div data-test={null} />,
    html: `<div></div>`
  },
  {
    vdom: <div data-test={false} />,
    html: `<div></div>`
  },
  {
    vdom: <div data-test={undefined} />,
    html: `<div></div>`
  }
])

testVdomToHtml("update element with dynamic props", [
  {
    vdom: (
      <input
        type="text"
        value="foo"
        onupdate={element => {
          expect(element.value).toBe("foo")
        }}
      />
    ),
    html: `<input type="text">`
  },
  {
    vdom: (
      <input
        type="text"
        value="bar"
        onupdate={element => {
          expect(element.value).toBe("bar")
        }}
      />
    ),
    html: `<input type="text">`
  }
])

testVdomToHtml("don't touch textnodes if equal", [
  {
    vdom: (
      <main
        oncreate={e => {
          e.childNodes[0].textContent = "foobar"
        }}
      >
        foobar
      </main>
    ),
    html: `<main>foobar</main>`
  },
  {
    vdom: <main>foobar</main>,
    html: `<main>foobar</main>`
  }
])

testVdomToHtml("input list attribute", [
  {
    vdom: <input list="foobar" />,
    html: `<input list="foobar">`
  }
])

testVdomToHtml("events", [
  {
    vdom: (
      <button
        oncreate={element => element.dispatchEvent(new Event("click"))}
        onclick={event => {
          event.currentTarget.id = "clicked"
        }}
      />
    ),
    html: `<button id="clicked"></button>`
  }
])
