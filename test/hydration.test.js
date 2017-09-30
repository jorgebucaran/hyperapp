import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

function hydrate(element) {
  return (
    element &&
    walk(element, (node, children) =>
      h(node.tagName.toLowerCase(), {}, children)
    )
  )
}

function walk(node, cb) {
  return cb(
    node,
    [].map.call(
      node.childNodes,
      node =>
        node.nodeType === Node.TEXT_NODE
          ? node.nodeValue.trim() ? node.nodeValue : null
          : walk(node, cb)
    )
  )
}

beforeEach(() => {
  document.body.innerHTML = ""
})

test("hydrate without explicit root", done => {
  const BODY = `
    <main>
      <p>foo</p>
    </main>
  `

  document.body.innerHTML = BODY

  app(
    {
      view: state =>
        h(
          "main",
          {
            onupdate() {
              expect(document.body.innerHTML).toBe(BODY)
              done()
            }
          },
          [h("p", {}, "foo")]
        )
    },
    hydrate
  )
})

test("hydrate with root", done => {
  const BODY = `
    <div id="ssr">
      <main>
        <p>foo</p>
      </main>
    </div>
  `

  document.body.innerHTML = BODY

  app(
    {
      root: document.getElementById("ssr"),
      view: state =>
        h(
          "main",
          {
            onupdate() {
              expect(document.body.innerHTML).toBe(BODY)
              done()
            }
          },
          [h("p", {}, "foo")]
        )
    },
    hydrate
  )
})

test("hydrate with out-of-date root", done => {
  const BODY = `
    <div id="ssr">
      <main>
        <h1>foo</h1>
      </main>
    </div>
  `

  document.body.innerHTML = BODY

  app(
    {
      root: document.getElementById("ssr"),
      view: state =>
        h(
          "main",
          {
            onupdate() {
              expect(document.body.innerHTML).toBe(BODY)
              done()
            }
          },
          [h("h1", {}, "bar")]
        )
    },
    hydrate
  )
})
