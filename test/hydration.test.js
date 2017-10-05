import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("hydrate without explicit root", done => {
  const body = `<main><p>foo</p></main>`

  document.body.innerHTML = body

  app({
    view: state =>
      h(
        "main",
        {
          onupdate() {
            expect(document.body.innerHTML).toBe(body)
            done()
          }
        },
        [h("p", {}, "foo")]
      )
  })
})

test("hydrate with root", done => {
  const body = `<div id="app"><main><p>foo</p></main></div>`

  document.body.innerHTML = body

  app({
    root: document.getElementById("app"),
    view: state =>
      h(
        "main",
        {
          onupdate() {
            expect(document.body.innerHTML).toBe(body)
            done()
          }
        },
        [h("p", {}, "foo")]
      )
  })
})
