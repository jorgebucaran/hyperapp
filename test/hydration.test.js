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

const Hydrator = () => ({
  events: {
    load(state, actions, root) {
      return walk(root, (node, children) => ({
        tag: node.tagName.toLowerCase(),
        props: {},
        children
      }))
    }
  }
})

beforeEach(() => {
  document.body.innerHTML = ""
})

test("hydrate from SSR", done => {
  document.body.innerHTML = `<div id="ssr"><main><p>foo</p></main></div>`

  app({
    root: document.getElementById("ssr"),
    view: state =>
      h(
        "main",
        {
          onupdate() {
            //
            // Careful: oncreate doesn't fire for rehydrated nodes!
            //
            expect(document.body.innerHTML).toBe(
              `<div id="ssr"><main><p>foo</p></main></div>`
            )
            done()
          }
        },
        [h("p", {}, "foo")]
      ),
    mixins: [Hydrator]
  })
})

test("hydrate from SSR with out-of-date node", done => {
  document.body.innerHTML = `<div id="ssr"><main><h1>foo</h1></main></div>`

  app({
    view: state =>
      h(
        "main",
        {
          onupdate() {
            expect(document.body.innerHTML).toBe(
              `<div id="ssr"><main><h1>bar</h1></main></div>`
            )
            done()
          }
        },
        [h("h1", {}, "bar")]
      ),
    root: document.getElementById("ssr"),
    mixins: [Hydrator]
  })
})

test("hydrate from SSR ", done => {
  document.body.innerHTML = `<div id="ssr"><main></main></div>`

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
    root: document.getElementById("ssr"),
    mixins: [Hydrator]
  })
})
