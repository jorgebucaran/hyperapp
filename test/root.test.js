import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("no root", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe("<div>foo</div>")
            done()
          }
        },
        "foo"
      )
  })
})

test("given root", done => {
  document.body.innerHTML = "<main></main>"

  app({
    root: document.body.firstChild,
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe("<div>foo</div>")
            done()
          }
        },
        "foo"
      )
  })
})

test("root as document.body", done => {
  document.body.innerHTML = "<div></div>"

  app({
    root: document.body,
    view: state =>
      h(
        "body",
        {
          id: "foo",
          oncreate() {
            expect(document.body.id).toBe("foo")
            expect(document.body.innerHTML).toBe("<main>foo</main>")
            done()
          }
        },
        [h("main", {}, "foo")]
      )
  })
})

test("root nested inside another element", done => {
  document.body.innerHTML = "<main><section></section><div></div></main>"

  app({
    root: document.body.firstChild.lastChild,
    view: state =>
      h(
        "p",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(
              `<main><section></section><p>foo</p></main>`
            )
            done()
          }
        },
        "foo"
      )
  })
})

test("root with mutated host", done => {
  document.body.innerHTML = "<main><div></div></main>"

  const host = document.body.firstChild
  const root = host.firstChild

  app({
    root,
    view: (state, actions) =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(`<main><div>foo</div></main>`)
            //
            // We should be able to patch the root even if the host is mutated.
            //
            host.insertBefore(document.createElement("header"), host.firstChild)
            host.appendChild(document.createElement("footer"))

            actions.bar()
          },
          onupdate() {
            expect(document.body.innerHTML).toBe(
              `<main><header></header><div>bar</div><footer></footer></main>`
            )
            done()
          }
        },
        state.value
      ),
    state: {
      value: "foo"
    },
    actions: {
      bar(state) {
        return {
          value: "bar"
        }
      }
    }
  })
})
