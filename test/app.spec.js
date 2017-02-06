/* global describe, test, expect */

const app = require("../src/app.js")
const html = require("../src/html.js")

describe("App", _ => {

	test("boots with no bugs", _ => {
		app({model: {}, view: _ => (html`<div>Hi</div>`)})
	})

	test("renders a model", _ => {
		const model = {
			world: "world"
		}

		const view = (model) => html`<div id="test-me">${model.world}</div>`

		app({model, view})

		expect(document.getElementById("test-me").innerHTML).toEqual(model.world)
	})

	test("renders a model with a loop", _ => {
		const model = {
			loop: [
				"string1",
				"string2"
			]
		}

		const view = (model) => html`<div>${model.loop.map(value => (html`<p>${value}</p>`))}</div>`

		app({model, view})

		expect(document.getElementsByTagName("p").length).toEqual(model.loop.length)
	})
})