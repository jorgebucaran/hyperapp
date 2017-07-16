import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => (document.body.innerHTML = ""))

const TreeTest = trees => {
  return new Promise((resolve, reject) => {
    const NextTree = (index, up) => {
      if (trees.length === index) {
        resolve()
      }

      try {
        expect(document.body.innerHTML).toBe(
          trees[index].html.replace(/\s{2,}/g, "")
        )
      } catch (error) {
        reject(error)
      }

      setTimeout(NextTree, 0, up(), up)
    }

    app({
      state: 0,
      view: index => trees[index].tree,
      actions: {
        up: index => index + 1
      },
      events: {
        loaded: (index, { up }) => NextTree(index, up)
      }
    })
  })
}

test("replace element", () =>
  TreeTest([
    {
      tree: h("main"),
      html: `<main></main>`
    },
    {
      tree: h("div"),
      html: `<div></div>`
    }
  ]))

test("replace child", () =>
  TreeTest([
    {
      tree: h("main", null, [h("div", null, ["foo"])]),
      html: `
        <main>
          <div>foo</div>
        </main>
      `
    },
    {
      tree: h("main", null, [h("main", null, ["bar"])]),
      html: `
        <main>
          <main>bar</main>
        </main>
      `
    }
  ]))

test("insert children on top", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A")
      ]),
      html: `
        <main>
          <div id="a">A</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B"),
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
        h("div", { key: "c", oncreate: e => (e.id = "c") }, "C"),
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
        h("div", { key: "d", oncreate: e => (e.id = "d") }, "D"),
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
  ]))

test("remove text node", () =>
  TreeTest([
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
  ]))

test("replace keyed", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A")
      ]),
      html: `
        <main>
          <div id="a">A</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B")
      ]),
      html: `
        <main>
          <div id="b">B</div>
        </main>
      `
    }
  ]))

test("reorder keyed", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A"),
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B"),
        h("div", { key: "c", oncreate: e => (e.id = "c") }, "C"),
        h("div", { key: "d", oncreate: e => (e.id = "d") }, "D"),
        h("div", { key: "e", oncreate: e => (e.id = "e") }, "E")
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
  ]))

test("grow/shrink keyed", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A"),
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B"),
        h("div", { key: "c", oncreate: e => (e.id = "c") }, "C"),
        h("div", { key: "d", oncreate: e => (e.id = "d") }, "D"),
        h("div", { key: "e", oncreate: e => (e.id = "e") }, "E")
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
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A"),
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B"),
        h("div", { key: "c", oncreate: e => (e.id = "c") }, "C"),
        h("div", { key: "d" }, "D"),
        h("div", { key: "e", oncreate: e => (e.id = "e") }, "E")
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
  ]))

test("mixed keyed/non-keyed", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A"),
        h("div", {}, "B"),
        h("div", {}, "C"),
        h("div", { key: "d", oncreate: e => (e.id = "d") }, "D"),
        h("div", { key: "e", oncreate: e => (e.id = "e") }, "E")
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
  ]))

test("style", () =>
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
  ]))

test("update element data", () =>
  TreeTest([
    {
      tree: h("div", { id: "foo", class: "bar" }),
      html: `<div id="foo" class="bar"></div>`
    },
    {
      tree: h("div", { id: "foo", class: "baz" }),
      html: `<div id="foo" class="baz"></div>`
    }
  ]))
