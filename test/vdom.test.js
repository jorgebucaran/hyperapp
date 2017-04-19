import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

const TreeTest = trees =>
  app({
    state: 0,
    view: state => trees[state].tree,
    actions: {
      next: state => (state + 1) % trees.length
    },
    events: {
      loaded: (state, actions) => {
        trees.map(tree => {
          expectHTMLToBe`${tree.html}`
          actions.next()
        })
      }
    }
  })

test("replace element", () => {
  TreeTest([
    {
      tree: h("main", {}),
      html: `<main></main>`
    },
    {
      tree: h("div", {}),
      html: `<div></div>`
    }
  ])
})

test("replace child", () => {
  TreeTest([
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
})

test("insert children on top", () => {
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => e.id = "a" }, "A")
      ]),
      html: `
        <main>
          <div id="a">A</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "b", oncreate: e => e.id = "b" }, "B"),
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
        h("div", { key: "c", oncreate: e => e.id = "c" }, "C"),
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
        h("div", { key: "d", oncreate: e => e.id = "d" }, "D"),
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
})

test("replace keyed", () => {
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => e.id = "a" }, "A")
      ]),
      html: `
        <main>
          <div id="a">A</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "b", oncreate: e => e.id = "b" }, "B")
      ]),
      html: `
        <main>
          <div id="b">B</div>
        </main>
      `
    }
  ])
})

test("reorder keyed", () => {
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => e.id = "a" }, "A"),
        h("div", { key: "b", oncreate: e => e.id = "b" }, "B"),
        h("div", { key: "c", oncreate: e => e.id = "c" }, "C"),
        h("div", { key: "d", oncreate: e => e.id = "d" }, "D"),
        h("div", { key: "e", oncreate: e => e.id = "e" }, "E")
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
})

test("grow/shrink keyed", () => {
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => e.id = "a" }, "A"),
        h("div", { key: "b", oncreate: e => e.id = "b" }, "B"),
        h("div", { key: "c", oncreate: e => e.id = "c" }, "C"),
        h("div", { key: "d", oncreate: e => e.id = "d" }, "D"),
        h("div", { key: "e", oncreate: e => e.id = "e" }, "E")
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
        h("div", { key: "a", oncreate: e => e.id = "a" }, "A"),
        h("div", { key: "b", oncreate: e => e.id = "b" }, "B"),
        h("div", { key: "c", oncreate: e => e.id = "c" }, "C"),
        h("div", { key: "d" }, "D"),
        h("div", { key: "e", oncreate: e => e.id = "e" }, "E")
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
})

test("mixed keyed/non-keyed", () => {
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => e.id = "a" }, "A"),
        h("div", {}, "B"),
        h("div", {}, "C"),
        h("div", { key: "d", oncreate: e => e.id = "d" }, "D"),
        h("div", { key: "e", oncreate: e => e.id = "e" }, "E")
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
})

test("svg", () => {
  const SVG_NS = "http://www.w3.org/2000/svg"

  app({
    view: _ =>
      h("div", {}, [
        h("p", { id: "foo" }, "foo"),
        h("svg", { id: "bar", viewBox: "0 0 10 10" }, [
          h("quux", {}, [
            h("beep", {}, [h("ping", {}), h("pong", {})]),
            h("bop", {}),
            h("boop", {}, [h("ping", {}), h("pong", {})])
          ]),
          h("xuuq", {}, [
            h("beep", {}),
            h("bop", {}, [h("ping", {}), h("pong", {})]),
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
  expect(svg.getAttribute("viewBox")).toBe("0 0 10 10")
  expectChildren(svg)

  function expectChildren(svgElement) {
    Array.from(svgElement.childNodes).forEach(node =>
      expectChildren(node, expect(node.namespaceURI).toBe(SVG_NS))
    )
  }
})

test("style", () => {
  TreeTest([
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
})

test("update element data", () => {
  TreeTest([
    {
      tree: h("div", { id: "foo", class: "bar" }),
      html: `<div id="foo" class="bar"></div>`
    },
    {
      tree: h("div", { id: "foo", class: "baz" }),
      html: `<div id="foo" class="baz"></div>`
    }
  ])
})
