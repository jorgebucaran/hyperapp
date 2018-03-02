import { h, app } from "../src"

test("recycle markup", done => {
  const SSR_BODY = `<div id="app"><main><p id="foo">foo</p></main></div>`

  document.body.innerHTML = SSR_BODY

  const view = state =>
    h("main", {}, [
      h(
        "p",
        {
          oncreate(element) {
            expect(element.id).toBe("foo")
            expect(document.body.innerHTML).toBe(SSR_BODY)
            done()
          }
        },
        "foo"
      )
    ])

  app({}, {}, view, document.getElementById("app"))
})

test("recycle markup against keyed vdom", done => {
  const SSR_BODY = `<div id="app"><main><p id="foo">foo</p></main></div>`

  document.body.innerHTML = SSR_BODY

  const view = state =>
    h("main", {}, [
      h(
        "p",
        {
          key: "key",
          oncreate(element) {
            expect(element.id).toBe("foo")
            expect(document.body.innerHTML).toBe(SSR_BODY)
            done()
          }
        },
        "foo"
      )
    ])

  app({}, {}, view, document.getElementById("app"))
})
