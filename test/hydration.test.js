import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

testHydration(
  "hydrate without root",
  `<main><p>foo</p></main>`,
  [h("p", {}, "foo")],
  null
)

testHydration(
  "hydrate with root",
  `<div id="app"><main><p>foo</p></main></div>`,
  [h("p", {}, "foo")],
  "app"
)

function testHydration(name, ssrBody, children, withRoot) {
  test(name, done => {
    document.body.innerHTML = ssrBody

    app({
      root: withRoot && document.getElementById(withRoot),
      view: state =>
        h(
          "main",
          {
            onupdate() {
              expect(document.body.innerHTML).toBe(ssrBody)
              done()
            }
          },
          children
        )
    })
  })
}
