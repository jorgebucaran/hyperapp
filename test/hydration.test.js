import { h, app } from "../src"

test("hydration", done => {
  const SSR_BODY = `<div id="app"><main><p>foo</p></main></div>`

  document.body.innerHTML = SSR_BODY

  const view = ({ state }) =>
    h(
      "main",
      {
        onupdate() {
          expect(document.body.innerHTML).toBe(SSR_BODY)
          done()
        }
      },
      [h("p", {}, "foo")]
    )

  app({}, view, document.getElementById("app"))
})
