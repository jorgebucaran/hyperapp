import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => (document.body.innerHTML = ""))

test("default root is document.body", () => {
  app({
    view: state => "foo"
  })

  expect(document.body.innerHTML).toBe("foo")
})

test("root", () => {
  app({
    view: state => h("div", {}, "foo"),
    root: document.body.appendChild(document.createElement("main"))
  })

  expectHTMLToBe`
    <main>
      <div>
        foo
      </div>
    </main>
  `
})

test("non-empty root", () => {
  const main = document.createElement("main")
  main.appendChild(document.createElement("span"))

  app({
    view: state => h("div", {}, "foo"),
    root: document.body.appendChild(main)
  })

  expectHTMLToBe`
    <main>
      <span>
      </span>
      <div>
        foo
      </div>
    </main>
  `
})

test("mutated root", () => {
  const main = document.createElement("main")

  app({
    state: "foo",
    view: state => h("div", {}, state),
    root: document.body.appendChild(main),
    actions: {
      bar: state => "bar"
    },
    events: {
      ready: (state, actions) => {
        expectHTMLToBe`
          <main>
            <div>
              foo
            </div>
          </main>
        `

        main.insertBefore(document.createElement("header"), main.firstChild)
        main.appendChild(document.createElement("footer"))

        actions.bar()

        expectHTMLToBe`
          <main>
            <header>
            </header>
            <div>
              bar
            </div>
            <footer>
            </footer>
          </main>
        `
      }
    }
  })
})
