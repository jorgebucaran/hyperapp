import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => (document.body.innerHTML = ""))

test("document.body is the default root", done => {
  app({
    view: state => "foo",
    events: {
      loaded: () => {
        expect(document.body.innerHTML).toBe("foo")
        done()
      }
    }
  })
})

test("root", done => {
  app({
    view: state => h("div", null, "foo"),
    events: {
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<main><div>foo</div></main>`)
        done()
      }
    },
    root: document.body.appendChild(document.createElement("main"))
  })
})

test("non-empty root", done => {
  const main = document.createElement("main")
  main.appendChild(document.createElement("span"))

  app({
    view: state => h("div", null, "foo"),
    events: {
      loaded: () => {
        expect(document.body.innerHTML).toBe(
          `<main><span></span><div>foo</div></main>`
        )
        done()
      }
    },
    root: document.body.appendChild(main)
  })
})

test("mutated root", done => {
  const main = document.createElement("main")

  app({
    state: "foo",
    view: state => h("div", null, state),
    root: document.body.appendChild(main),
    actions: {
      bar: state => "bar"
    },
    events: {
      loaded: (state, actions) => {
        expect(document.body.innerHTML).toBe(`<main><div>foo</div></main>`)

        main.insertBefore(document.createElement("header"), main.firstChild)
        main.appendChild(document.createElement("footer"))

        actions.bar()

        setTimeout(() => {
          expect(document.body.innerHTML).toBe(
            `<main><header></header><div>bar</div><footer></footer></main>`
          )
          done()
        })
      }
    }
  })
})
