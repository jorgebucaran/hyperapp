/* global describe, test, expect */

const { app, html } = require("../hx")

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

		const view = model =>
			html`<div>${model.loop.map(value => html`<p>${value}</p>`)}</div>`

		app({ model, view })

		expect(document.getElementsByTagName("p").length).toEqual(model.loop.length)
	})

	test("renders svg", () => {
		const model = {
			text: "zelda"
		}

		const view = model =>
			html`<svg><text>${model.text}</text></svg>`

		app({ model, view })

		expect(document.getElementsByTagName("svg").length).toEqual(1)
		expect(document.getElementsByTagName("svg")[0].namespaceURI).toEqual("http://www.w3.org/2000/svg")
		expect(document.getElementsByTagName("text")[0].innerHTML).toEqual(model.text)
	})
})