/* global describe, test, expect */

const { app, html } = require("../src/")

describe("App", () => {

	test("boots with no bugs", () => {
		app({ model: {}, view: () => (html`<div>Hi</div>`) })
	})

	test("renders a model", () => {
		const model = {
			world: "world"
		}

		const view = (model) => html`<div id="test-me">${model.world}</div>`

		app({ model, view })

		expect(document.getElementById("test-me").innerHTML).toEqual(model.world)
	})

	test("renders a model with a loop", () => {
		const model = {
			loop: [
				"string1",
				"string2"
			]
		}

		const view = (model) => html`<div>${model.loop.map(value => (html`<p>${value}</p>`))}</div>`

		app({ model, view })

		expect(document.getElementsByTagName("p").length).toEqual(model.loop.length)
	})
})