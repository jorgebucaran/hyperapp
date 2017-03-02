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
	it("extends model and actions with router props and methods", () => {
		const r = Router({})
		expect(Object.keys(r)).toEqual([
			"model", "effects", "reducers", "subscriptions", "hooks"
		])

		expect(r.model.router.location).toBe("/")
		expect(typeof r.effects.router.go).toBe("function")
		expect(typeof r.reducers.router.setLocation).toBe("function")
		expect(typeof r.hooks.onRender).toBe("function")
		expect(r.subscriptions.length).toBe(1)
	})

	it("selects the index route", () => {
		app({
			view: {
				"/": model => h("div", {}, "foo")
			},
			plugins: [Router]
		})

		expectHTMLToBe(`
			<div>
				<div>foo</div>
			</div>
		`)
	})

	it("selects a matching route", () => {
		window.location.pathname = "/foo/bar/baz"

		app({
			view: {
				"/foo/bar/baz": model => h("div", {}, "foo", "bar", "baz")
			},
			plugins: [Router]
		})

		expectHTMLToBe(`
			<div>
				<div>foobarbaz</div>
			</div>
		`)
	})

	it("matches route :key/s", () => {
		window.location.pathname = "/FOO/BAR/BAZ"

		app({
			view: {
				"/:foo/:bar/:baz": (model, _, params) =>
					h("ul", {}, Object.keys(params).map(key =>
						h("li", {}, params[key])))
			},
			plugins: [Router]
		})

		expectHTMLToBe(`
			<div>
				<ul>
					<li>FOO</li>
					<li>BAR</li>
					<li>BAZ</li>
				</ul>
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
				<div>foo</div>
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
								<div>foo</div>
							</div>
						`)

						actions.router.go("/bar")
						expectHTMLToBe(`
							<div>
								<div>bar</div>
							</div>
						`)

						actions.router.go("/baz")
						expectHTMLToBe(`
							<div>
								<div>baz</div>
							</div>
						`)
					}
				]
			})
		})
	})
})
