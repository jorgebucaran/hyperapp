import { h, app } from "../src"

test("recycle markup", done => {
  const SSR_HTML = `<div id="app"><main><p id="foo">foo</p></main></div>`

  document.body.innerHTML = SSR_HTML

  app(
    null,
    null,
    state => (
      <main>
        <p
          oncreate={element => {
            expect(element.id).toBe("foo")
            expect(document.body.innerHTML).toBe(SSR_HTML)
            done()
          }}
        >
          foo
        </p>
      </main>
    ),
    document.getElementById("app")
  )
})

test("recycle markup against keyed vdom", done => {
  const SSR_HTML = `<div id="app"><main><p id="foo">foo</p></main></div>`

  document.body.innerHTML = SSR_HTML

  app(
    null,
    null,
    state => (
      <main>
        <p
          key="someKey"
          oncreate={element => {
            expect(element.id).toBe("foo")
            expect(document.body.innerHTML).toBe(SSR_HTML)
            done()
          }}
        >
          foo
        </p>
      </main>
    ),
    document.getElementById("app")
  )
})
