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

test("recycle custom-elements inner markup to support non-native shadowdom polyfills", done => {
  const SSR_HTML = `<div id="app"><main><custom-element>fake shadowdom</custom-element></main></div>`

  document.body.innerHTML = SSR_HTML

  app(
    null,
    null,
    state => (
      <main>
        <custom-element
          oncreate={element => {
            expect(element.innerHTML).toBe("fake shadowdom")
            expect(document.body.innerHTML).toBe(SSR_HTML)
            done()
          }}
        />
      </main>
    ),
    document.getElementById("app")
  )
})

test("hydrate custom elements children defined in the view", done => {
  const SSR_HTML = `<div id="app"><main><custom-element><hr id="foo"></custom-element></main></div>`

  document.body.innerHTML = SSR_HTML

  app(
    null,
    null,
    state => (
      <main>
        <custom-element>
          <hr
            id="foo"
            oncreate={element => {
              expect(element.id).toBe("foo")
              expect(document.body.innerHTML).toBe(SSR_HTML)
              done()
            }}
          />
        </custom-element>
      </main>
    ),
    document.getElementById("app")
  )
})
