import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

const walk = (node, map) => {
  return map(
    node,
    node
      ? Array.prototype.map
        .call(
        node.childNodes,
        node =>
          node.nodeType === Node.TEXT_NODE
            ? node.nodeValue.trim() && node.nodeValue
            : walk(node, map)
        )
        .filter(node => node)
      : node
  )
}

const hydrate = root => walk(root, (node, children) => ({
  tag: node.tagName.toLowerCase(),
  props: {},
  children
}))

beforeEach(() => {
  document.body.innerHTML = ""
})

test("hydrate from SSR matching view", done => {
  document.body.innerHTML = `<div id="ssr"><main><p>foo</p></main></div>`

  const root = document.getElementById("ssr");
  app({
    root,
    view: state =>
      h(
        "main",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(
              `<div id="ssr"><main><p>foo</p></main></div>`
            )
            done()
          }
        },
        [h("p", {}, "foo")]
      )
  }, hydrate(root))
})

test("hydrate from SSR with out-of-date node", done => {
  document.body.innerHTML = `<div id="ssr"><main><h1>foo</h1></main></div>`

  const root = document.getElementById("ssr");
  app({
    view: state =>
      h(
        "main",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(
              `<div id="ssr"><main><h1>bar</h1></main></div>`
            )
            done()
          }
        },
        [h("h1", {}, "bar")]
      ),
    root
  }, hydrate(root))
})

test("hydrate from incomplete SSR ", done => {
  document.body.innerHTML = `<div id="ssr"><main></main></div>`

  const root = document.getElementById("ssr");
  app({
    view: state =>
      h("main", {}, [
        h(
          "div",
          {
            oncreate() {
              expect(document.body.innerHTML).toBe(
                `<div id="ssr"><main><div>foo</div></main></div>`
              )
              done()
            }
          },
          "foo"
        )
      ]),
    root
  }, hydrate(root))
})
