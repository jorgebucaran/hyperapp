import { app, h } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

test("append view to document.body if no root is given", () => {
  app({
    view: _ => "foo"
  })

  expectHTMLToBe("foo")
})

test("append view to a given root", () => {
  app({
    root: document.body.appendChild(document.createElement("main")),
    view: _ => h("div", {}, "foo")
  })

  expectHTMLToBe(`
    <main>
      <div>
        foo
      </div>
    </main>
  `)
})

test("append view to a non-empty root", () => {
  const main = document.createElement("main")
  main.appendChild(document.createElement("span"))

  app({
    root: document.body.appendChild(main),
    view: _ => h("div", {}, "foo")
  })

  expectHTMLToBe(`
    <main>
      <span>
      </span>
      <div>
        foo
      </div>
    </main>
  `)
})

test("update view in a mutated root", () => {
  const main = document.createElement("main")

  app({
    root: document.body.appendChild(main),
    model: "foo",
    actions: {
      bar: model => "bar"
    },
    subscriptions: [
      (_, actions) => {
        expectHTMLToBe(`
          <main>
            <div>
              foo
            </div>
          </main>
        `)

        main.insertBefore(document.createElement("header"), main.firstChild)
        main.appendChild(document.createElement("footer"))

        actions.bar()

        expectHTMLToBe(`
          <main>
            <header>
            </header>
            <div>
              bar
            </div>
            <footer>
            </footer>
          </main>
        `)
      }
    ],
    view: model => h("div", {}, model)
  })
})
