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

test("insert child on top", () => {
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
        h("div", { key: "b", onCreate: e => e.id = "b" }, "B"),
        h("div", { key: "a" }, "A")
      ]),
      html: `
        <main>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
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




// test("remove old node/s if missing in the new tree", () => {
//   app({
//     model: true,
//     actions: {
//       toggle: model => !model
//     },
//     view: model => model
//       ? h("div", {}, h("h1", {}, "foo"), h("h2", {}, "bar"))
//       : h("div", {}, h("h1", {}, "foo")),
//     subscriptions: [(_, actions) => actions.toggle()]
//   })

//   expectHTMLToBe(`
//     <div>
//       <h1>foo</h1>
//     </div>
//   `)
// })
