import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("container", done => {
  document.body.innerHTML = "<main></main>"
  const view = store =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe("<main><div>foo</div></main>")
          done()
        }
      },
      "foo"
    )
  app({}, view, document.body.firstChild)
})

test("nested container", done => {
  document.body.innerHTML = "<main><section></section><div></div></main>"

  const view = store =>
    h(
      "p",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(
            `<main><section></section><div><p>foo</p></div></main>`
          )
          done()
        }
      },
      "foo"
    )
  app({}, view, document.body.firstChild.lastChild)
})

test("container with mutated host", done => {
  document.body.innerHTML = "<main><div></div></main>"

  const host = document.body.firstChild
  const container = host.firstChild

  const model = {
    value: "foo",
    bar: () => ({ value: "bar" })
  }
  const view = store =>
    h(
      "p",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(
            `<main><div><p>foo</p></div></main>`
          )
          host.insertBefore(document.createElement("header"), host.firstChild)
          host.appendChild(document.createElement("footer"))

          store.bar()
        },
        onupdate() {
          expect(document.body.innerHTML).toBe(
            `<main><header></header><div><p>bar</p></div><footer></footer></main>`
          )
          done()
        }
      },
      store.value
    )
  app(model, view, container)
})
