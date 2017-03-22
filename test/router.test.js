/* global beforeEach, describe, it, expect */

import { h, app, Router } from "../src"
import { expectHTMLToBe } from "./util"

Object.defineProperty(window.location, "pathname", {
  writable: true
})

beforeEach(() => {
  window.location.pathname = "/"
  document.body.innerHTML = ""
})

describe("Router", () => {
  it("renders default route", () => {
    window.history.pushState = _ => _

    app({
      view: {
        "*": model => h("div", {}, "foo"),
      },
      plugins: [Router],
      subscriptions: [
        (_, actions) => {
          expectHTMLToBe(`
						<div>
							foo
						</div>
					`)

          actions.router.go("/bar")
          expectHTMLToBe(`
						<div>
							foo
						</div>
					`)

          actions.router.go("/baz")
          expectHTMLToBe(`
						<div>
							foo
						</div>
					`)
        }
      ]
    })
  })

  it("renders the index route", () => {
    app({
      view: {
        "/": model => h("div", {}, "foo")
      },
      plugins: [Router]
    })

    expectHTMLToBe(`
			<div>
				foo
			</div>
		`)
  })

  it("renders matched route", () => {
    window.location.pathname = "/foo/bar/baz"

    app({
      view: {
        "/foo/bar/baz": model => h("div", {}, "foo", "bar", "baz")
      },
      plugins: [Router]
    })

    expectHTMLToBe(`
			<div>
				foobarbaz
			</div>
		`)
  })

  it("collects matched route keys", () => {
    window.location.pathname = "/beep/bop/boop"

    app({
      view: {
        "/:foo/:bar/:baz": model =>
          h("ul", {}, Object.keys(model.router.params).map(key =>
            h("li", {}, `${key}:${model.router.params[key]}`)))
      },
      plugins: [Router]
    })

    expectHTMLToBe(`
      <ul>
        <li>foo:beep</li>
        <li>bar:bop</li>
        <li>baz:boop</li>
      </ul>
		`)
  })

  it("collects matched route keys separated with dash", () => {
    window.location.pathname = "/beep-bop-boop"

    app({
      view: {
        "/:foo-:bar-:baz": model =>
          h("ul", {}, Object.keys(model.router.params).map(key =>
            h("li", {}, `${key}:${model.router.params[key]}`)))
      },
      plugins: [Router]
    })

    expectHTMLToBe(`
      <ul>
        <li>foo:beep</li>
        <li>bar:bop</li>
        <li>baz:boop</li>
      </ul>
		`)
  })

  it("collects matched route key with dash", () => {
    window.location.pathname = "/beep-bop-boop"

    app({
      view: {
        "/:foo": model => h("div", {}, model.router.params.foo)
      },
      plugins: [Router]
    })

    expectHTMLToBe(`
      <div>
        beep-bop-boop
      </div>
		`)
  })

  it("listens to popstate", () => {
    function firePopstate() {
      const event = document.createEvent("Event")
      event.initEvent("popstate", true, true)
      window.document.dispatchEvent(event)
    }

    app({
      view: {
        "/": model => "",
        "/foo": model => h("div", {}, "foo")
      },
      plugins: [Router]
    })

    window.location.pathname = "/foo"

    firePopstate()

    expectHTMLToBe(`
			<div>
				foo
			</div>
		`)
  })

  describe("go", () => {
    it("navigates to the given route", () => {
      window.history.pushState = (_, __, data) =>
        expect(data).toMatch(/^\/(foo|bar|baz)$/)

      app({
        view: {
          "/": model => "",
          "/foo": model => h("div", {}, "foo"),
          "/bar": model => h("div", {}, "bar"),
          "/baz": model => h("div", {}, "baz")
        },
        plugins: [Router],
        subscriptions: [
          (_, actions) => {
            actions.router.go("/foo")
            expectHTMLToBe(`
							<div>
								foo
							</div>
						`)

            actions.router.go("/bar")
            expectHTMLToBe(`
							<div>
								bar
							</div>
						`)

            actions.router.go("/baz")
            expectHTMLToBe(`
							<div>
								baz
							</div>
						`)
          }
        ]
      })
    })
  })
})
