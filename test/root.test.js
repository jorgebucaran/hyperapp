import { h, app } from "../src"

window.requestAnimationFrame = cb => cb()

beforeEach(() => (document.body.innerHTML = ""))

test("document.body is the default root", () => {
  app({
    view: state => h("div", null, "foo")
  })

  expect(document.body.innerHTML).toBe("<div>foo</div>")
})

test("root", () => {
  app({
    view: state => h("div", null, "foo"),
    root: document.body.appendChild(document.createElement("main"))
  })

  expect(document.body.innerHTML).toBe(`<main><div>foo</div></main>`)
})

test("non-empty root", () => {
  const main = document.createElement("main")
  main.appendChild(document.createElement("span"))

  app({
    view: state => h("div", null, "foo"),
    root: document.body.appendChild(main)
  })

  expect(document.body.innerHTML).toBe(
    `<main><span></span><div>foo</div></main>`
  )
})

test("mutated root", () => {
  const main = document.createElement("main")

  app({
    state: "foo",
    view: state => h("div", null, state),
    root: document.body.appendChild(main),
    actions: {
      bar: state => "bar"
    },
    events: {
      loaded(state, actions) {
        expect(document.body.innerHTML).toBe(`<main><div>foo</div></main>`)

        main.insertBefore(document.createElement("header"), main.firstChild)
        main.appendChild(document.createElement("footer"))

        actions.bar()

        expect(document.body.innerHTML).toBe(
          `<main><header></header><div>bar</div><footer></footer></main>`
        )
      }
    }
  })
})
