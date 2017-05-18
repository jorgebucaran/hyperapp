import { h, app, Router } from "../src"
import { expectHTMLToBe } from "./util"

Object.defineProperty(window.location, "pathname", {
  writable: true
})

beforeEach(() => {
  document.body.innerHTML = ""
  location.pathname = "/"
  history.pushState = Function.prototype
})

test("/", () => {
  app({
    view: [
      { path: "/", view: state => h("div", {}, "foo")}
    ],
    plugins: [Router]
  })

  expectHTMLToBe`
    <div>
      foo
    </div>`
})

test("*", () => {
  app({
    view: [
      { path: "*", view: state => h("div", {}, "foo") }
    ],
    plugins: [Router],
    events: {
      loaded: (state, actions) => {
        actions.router.go("/bar")
        expectHTMLToBe`
          <div>
            foo
          </div>`

        actions.router.go("/baz")
        expectHTMLToBe`
          <div>
            foo
          </div>`

        actions.router.go("/")
        expectHTMLToBe`
          <div>
            foo
          </div>`
      }
    }
  })
})

test("routes", () => {
  window.location.pathname = "/foo/bar/baz"

  app({
    view: [
      { path: "/foo/bar/baz", view: state => h("div", {}, "foo", "bar", "baz") }
    ],
    plugins: [Router]
  })

  expectHTMLToBe`
    <div>
      foobarbaz
    </div>
  `
})

test("route params", () => {
  window.location.pathname = "/be_ep/bOp/b00p"

  app({
    view: [{
      path: "/:foo/:bar/:baz",
      view: state =>
        h(
          "ul",
          {},
          Object.keys(state.router.params).map(key =>
            h("li", {}, `${key}:${state.router.params[key]}`)
          )
        )
    }],
    plugins: [Router]
  })

  expectHTMLToBe`
    <ul>
      <li>foo:be_ep</li>
      <li>bar:bOp</li>
      <li>baz:b00p</li>
    </ul>
  `
})

test("route params separated by a dash", () => {
  window.location.pathname = "/beep-bop-boop"

  app({
    view: [{
      path: "/:foo-:bar-:baz",
      view: state =>
        h(
          "ul",
          {},
          Object.keys(state.router.params).map(key =>
            h("li", {}, `${key}:${state.router.params[key]}`)
          )
        )
    }],
    plugins: [Router]
  })

  expectHTMLToBe`
    <ul>
      <li>foo:beep</li>
      <li>bar:bop</li>
      <li>baz:boop</li>
    </ul>
  `
})

test("routes with dashes into a single param key", () => {
  window.location.pathname = "/beep-bop-boop"

  app({
    view: [{
      path: "/:foo",
      view: state => h("div", {}, state.router.params.foo)
    }],
    plugins: [Router]
  })

  expectHTMLToBe`
    <div>
      beep-bop-boop
    </div>
  `
})

test("popstate", () => {
  app({
    view: [{
      path: "/",
      view: state => "",
    }, {
      path: "/foo",
      view: state => h("div", {}, "foo")
    }],
    plugins: [Router]
  })

  window.location.pathname = "/foo"

  const event = document.createEvent("Event")
  event.initEvent("popstate", true, true)
  window.document.dispatchEvent(event)

  expectHTMLToBe`
    <div>
      foo
    </div>
  `
})

test("go", () => {
  window.history.pushState = (data, title, url) =>
    expect(url).toMatch(/^\/(foo|bar|baz)$/)

  app({
    view: [
      { path: "/", view: state => "" },
      { path: "/foo", view: state => h("div", {}, "foo") },
      { path: "/bar", view: state => h("div", {}, "bar") },
      { path: "/baz", view: state => h("div", {}, "baz") }
    ],
    plugins: [Router],
    events: {
      loaded: (state, actions) => {
        actions.router.go("/foo")
        expectHTMLToBe`
          <div>
            foo
          </div>
        `

        actions.router.go("/bar")
        expectHTMLToBe`
          <div>
            bar
          </div>
        `

        actions.router.go("/baz")
        expectHTMLToBe`
          <div>
            baz
          </div>
        `
      }
    }
  })
})
