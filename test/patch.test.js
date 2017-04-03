import { app, h } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

const TreeTest = trees => app({
  model: 0,
  view: model => trees[model].tree,
  actions: {
    next: model => (model + 1) % trees.length
  },
  subscriptions: [
    (_, actions) => {
      trees.forEach(tree => {
        expectHTMLToBe(tree.html)
        actions.next()
      })
    }
  ]
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
    },
  ])
})

test("replace child", () => {
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", {}, "foo")
      ]),
      html: `
        <main>
          <div>foo</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("main", {}, "bar")
      ]),
      html: `
        <main>
          <main>bar</main>
        </main>
      `
    },
  ])
})

test("insert children on top", () => {
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", onCreate: e => e.id = "a" }, "A")
      ]),
      html: `
        <main>
          <div id="a">A</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "b", onCreate: e => e.id = "b" }, "B"),
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
        h("div", { key: "c", onCreate: e => e.id = "c" }, "C"),
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
        h("div", { key: "d", onCreate: e => e.id = "d" }, "D"),
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
        h("div", { key: "a", onCreate: e => e.id = "a" }, "A"),
      ]),
      html: `
        <main>
          <div id="a">A</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "b", onCreate: e => e.id = "b" }, "B"),
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
        h("div", { key: "a", onCreate: e => e.id = "a" }, "A"),
        h("div", { key: "b", onCreate: e => e.id = "b" }, "B"),
        h("div", { key: "c", onCreate: e => e.id = "c" }, "C"),
        h("div", { key: "d", onCreate: e => e.id = "d" }, "D"),
        h("div", { key: "e", onCreate: e => e.id = "e" }, "E"),
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
        h("div", { key: "d" }, "D"),

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
        h("div", { key: "a", onCreate: e => e.id = "a" }, "A"),
        h("div", { key: "b", onCreate: e => e.id = "b" }, "B"),
        h("div", { key: "c", onCreate: e => e.id = "c" }, "C"),
        h("div", { key: "d", onCreate: e => e.id = "d" }, "D"),
        h("div", { key: "e", onCreate: e => e.id = "e" }, "E"),
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
      tree: h("main", {}, [
        h("div", { key: "d" }, "D")
      ]),
      html: `
        <main>
          <div id="d">D</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "a", onCreate: e => e.id = "a" }, "A"),
        h("div", { key: "b", onCreate: e => e.id = "b" }, "B"),
        h("div", { key: "c", onCreate: e => e.id = "c" }, "C"),
        h("div", { key: "d" }, "D"),
        h("div", { key: "e", onCreate: e => e.id = "e" }, "E"),
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
    },
  ])
})


test("mixed keyed/non-keyed", () => {
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", onCreate: e => e.id = "a" }, "A"),
        h("div", {}, "B"),
        h("div", {}, "C"),
        h("div", { key: "d", onCreate: e => e.id = "d" }, "D"),
        h("div", { key: "e", onCreate: e => e.id = "e" }, "E"),
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
        h("div", { key: "a" }, "A"),
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
        h("div", {}, "B"),
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
        h("div", {}, "C"),
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



// test("", () => {
//   app({
//     model: true,
//     actions: {
//       toggle: model => !model
//     },
//     subscriptions: [
//       (_, actions) => {
//         expectHTMLToBe(`
//           <main></main>
//         `)

//         actions.toggle()

//         expectHTMLToBe(`
//           <main>
//             <p id="foo">A</p>
//             <p>B</p>
//             <p>C</p>
//           </main>
//         `)
//       }
//     ],
//     view: model => model
//       ?
//       h("main", {}, [])
//       :
//       h("main", {}, [
//         h("p", { key: "a", onCreate: e => e.id = "foo" }, "A"),
//         h("p", { key: "b" }, "B"),
//         h("p", { key: "c" }, "C")
//       ]),
//   })
// })



