/* global beforeEach, describe, it, expect */

import { app, h } from "../src"
import hyperx from "hyperx"
const html = hyperx(h)

function fireDOMLoaded() {
	const event = document.createEvent("Event")
	event.initEvent("DOMContentLoaded", true, true)
	window.document.dispatchEvent(event)
}

beforeEach(() => {
	document.body.innerHTML = ""
})

describe("App", () => {
	it("boots with no bugs", () => {
		app({ model: {}, view: () => (html`<div>Hi</div>`) })
	})

	it("allows optional options", () => {
		app({})
	})

	it("renders a model", () => {
		const model = {
			world: "world"
		}

		const view = (model) => html`<div id="test-me">${model.world}</div>`

		app({ model, view })

		expect(document.getElementById("test-me").innerHTML).toEqual(model.world)
	})

	it("renders a model with a loop", () => {
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

	it("renders svg", () => {
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

	it("renders the view when the model changes", () => {
		const firstValue = 'first-value'
		const secondValue = 'second-value'

		const model = firstValue

		const view = (model, update) =>
			html`<div><input oninput=${e =>
				update.fire(e.target.value)} value=${model}/><p>${model}</p></div>`

		const update = { fire: (_, value) => value }

		app({ model, view, update })

		const input = document.getElementsByTagName('input')[0];

		expect(input.value).toEqual(firstValue)

		const evnt = new Event('input', { bubbles: true });
		input.value = secondValue;
		input.dispatchEvent(evnt);

		expect(input.value).toEqual(secondValue)
		expect(document.getElementsByTagName('p')[0].innerHTML).toEqual(secondValue)
	});

	it("boots application on domcontentloaded", done => {
		Object.defineProperty(document, "readyState", {
			writable: true
		})

		window.document.readyState = "loading"

		const model = "foo"

		app({
			model,
			subscriptions: [_ => {
				expect(model).toEqual("foo")
				done()
			}]
		})

		window.document.readyState = "complete"

		fireDOMLoaded()

	})


	it("does not render bools (true)", () => {
		app({
			view: _ => html`<div id="foo">${true}</div>`
		})
		expect(document.getElementById("foo").innerHTML).toEqual("")
	})

	// this is a bug in hyperx, that converts false values to strings
	// making it impossible for our vdom to know whether the user meant
	// the string "false" or the primitive value false
	it.skip("does not render bools (false)", () => {
		app({
			view: _ => html`<div id="foo">${false}</div>`
		})
		expect(document.getElementById("foo").innerHTML).toEqual("")
	})
})

describe("Namespaces", () => {
	it("", () => {
		app({
			model: true,
			reducers: {
				foo: {
					bar: {
						baz: (model, data) => {
							expect(model).toBe(true)
							expect(data).toBe("foo.bar.baz")
						}
					}
				}
			},
			subscriptions: [
				(_, actions) => actions.foo.bar.baz("foo.bar.baz")
			],
			view: _ => h("div", {}, "")
		})
	})

	it("", () => {
		app({
			model: true,
			effects: {
				foo: {
					bar: {
						qux: (model, actions, data) => {
							expect(model).toBe(true)
							expect(data).toBe("foo.bar.qux")
						}
					}
				}
			},
			reducers: {
				foo: {
					bar: {
						baz: (model, data) => {
							expect(model).toBe(true)
							expect(data).toBe("foo.bar.baz")
							return model
						}
					}
				}
			},
			subscriptions: [
				(_, actions) => actions.foo.bar.baz("foo.bar.baz"),
				(_, actions) => actions.foo.bar.qux("foo.bar.qux"),
			],
			view: _ => h("div", {}, "")
		})
	})
})

describe("Views", () => {
	it("allows inline styles as object with properties in camelCase", () => {
		const view = (model) => html`<div id="red" style=${{
			backgroundColor: "red",
			padding: "10px"
		}}>I'm red</div>`

		app({ view })
		var el = document.getElementById("red")
		expect(el).not.toBe(null)
		expect(el.style["background-color"]).toEqual("red")
		expect(el.style["padding"]).toEqual("10px")
	})

	it("allows the views to be defined directly with h", () => {
		const view = (model) => h("div", { id: "test" }, "inside div")
		app({ view })
		var el = document.getElementById("test")

		expect(el).not.toBe(null)
		expect(el.innerHTML).toEqual("inside div")
	})

	it("allows data to be null", () => {
		const view = (model) => h("div", undefined, "inside div")
		app({ view })
		var el = document.getElementsByTagName("div")[0]

		expect(el).not.toBe(null)
		expect(el.innerHTML).toEqual("<div>inside div</div>")
	})

	it("allows tag to be a function", () => {
		const view = (model) => h(_ => h("div", { id: "test" }, "component"), undefined)
		app({ view })
		var el = document.getElementById("test")

		expect(el).not.toBe(null)
		expect(el.innerHTML).toEqual("component")
	})

	it("sets bool attributes", () => {
		const view = (model) => h("div", { id: "test", dummy: false }, "inside div")
		app({ view })
		var el = document.getElementById("test")

		expect(el).not.toBe(null)
		expect(el.dummy).toEqual(false)
	})

	it("handles nulls and bools", () => {
		app({
			model: 0,
			reducers: {
				add: model => model + 1,
				sub: model => model - 1
			},
			view: (model, actions) =>
				h("div", {}, [
					h("div", { id: "test" }, model > 0 && h("h1", {}, model)),
					h("button", {
						id: "btn-add",
						onclick: actions.add
					}),
					h("button", {
						id: "btn-sub",
						onclick: actions.sub
					}),
					h("div", {}, null)
				])
		})

		const btnAdd = document.getElementById("btn-add")
		const btnSub = document.getElementById("btn-sub")

		const ev = new Event("click", { bubbles: true })
		btnAdd.dispatchEvent(ev)

		var el = document.getElementById("test")

		expect(el).not.toBe(null)
		expect(el.innerHTML).toEqual("<h1>1</h1>")

		btnSub.dispatchEvent(ev)
		expect(el.innerHTML).toEqual("")
	})

	it("handles bool props", () => {
		const items = ["test-10", "test-20", "test-30", "test-40", "test-50"]
		const newItem = (selected, id) => ({ selected, id })
		const newList = items => items.map(i => newItem(true, i))

		app({
			model: {
				items: newList(items)
			},
			view: (model, actions) =>
				h("div", {}, [
					h("button", { onclick: actions.shift }, "Shift"),
					h("button", { onclick: actions.reset }, "Reset"),
					h("ul", {}, model.items.map(i =>
						h("li", {
							id: i.id,
						}, [
								h("label", {}, h(
									"input", {
										id: "input-" + i.id,
										onchange: e => {

											actions.select({
												id: i.id, value: e.target.checked
											})

										},
										type: "checkbox",
										checked: i.selected
									}),
									i.id + "/" + i.selected)
							])
					))
				]),
			reducers: {
				select: (model, { id, value }) => ({
					items: model.items.map(i => i.id === id ? newItem(value, id) : i)
				}),
				reset: model => ({ items: newList(items) }),
				shift: model => ({ items: model.items.slice(1) })
			}
		})

		function simulateClick(id) {
			var event = new MouseEvent("click", {
				"view": window,
				"bubbles": true,
				"cancelable": true
			})
			document.getElementById(id).dispatchEvent(event)
		}

		const sndItem = document.getElementById("test-20")
		const sndInputEl = document.getElementById("input-test-20")

		expect(sndItem).not.toBe(null)
		expect(sndInputEl).not.toBe(null)

		expect(sndInputEl.checked).toEqual(true)

		simulateClick("input-test-20")
		expect(sndInputEl.checked).toEqual(false)

		simulateClick("input-test-20")
		expect(sndInputEl.checked).toEqual(true)
	})

	it("removes element data", () => {
		const model = 0
		const update = {
			add: (model, data) => model + data
		}
		const subscriptions = [(_, msg) => msg.add(2)]

		const view = model => h("div", model === 0 ?
			({
				id: "test",
				className: "foo",
				style: { color: "red" },
				foo: true
			}) :
			({
				id: "test"
			})
			, "...")

		app({ model, view, update, subscriptions })

		var el = document.getElementById("test")

		expect(el).not.toBe(null)
		expect(el.style.color).toBe("")
	})
})

describe("Subscriptions", () => {
	it("fires all subscriptions when DOM is ready", () => {
		const check = {}

		app({
			view: () => html`<div>View</div>`,
			subscriptions: [
				() => { check["one"] = true },
				() => { check["two"] = true }
			]
		})

		fireDOMLoaded()

		expect(check["one"]).toBe(true)
		expect(check["two"]).toBe(true)
	})
})

describe("Hooks", () => {
	const model = 0

	const view = (model) => html`<div>${model}</div>`

	const update = { add: (model, data) => model + data }

	const subscriptions = [(_, msg) => msg.add(2)]

	it("fires onUpdate when the model is updated", () => {
		let guard = null

		const hooks = {
			onUpdate: (prev, model) => { guard = { prev, model } }
		}

		app({ model, view, update, subscriptions, hooks })

		fireDOMLoaded()

		expect(guard).toEqual({ model: 2, prev: 0 })
	})

	it("fires onAction when a reducer is dispatched", () => {
		let guard = null

		const hooks = {
			onAction: (name, data) => { guard = { name, data } }
		}

		app({ model, view, update, subscriptions, hooks })

		fireDOMLoaded()

		expect(guard).toEqual({ name: "add", data: 2 })
	})

	it("fires onAction when an effect is dispatched", () => {
		let guard = null

		let effectDone = false

		const hooks = {
			onAction: (name, data) => { guard = { name, data } }
		}

		const effects = {
			add: () => { effectDone = true }
		}

		app({ model, view, effects, subscriptions, hooks })

		fireDOMLoaded()

		expect(effectDone).toBe(true)
		expect(guard).toEqual({ name: "add", data: 2 })
	})

	it("fires onError when a effect fails", () => {
		let guard = null

		const hooks = {
			onError: (err) => { guard = err }
		}

		const effects = {
			add: (model, msg, data, error) => { error("effect error") }
		}

		app({ model, view, effects, subscriptions, hooks })

		fireDOMLoaded()

		expect(guard).toEqual("effect error")
	})

	it("throws when onError handler is not given", () => {
		const effects = {
			add: (model, msg, data, error) => {
				try {
					error("no error handler")
				} catch (e) {
					expect(e).toEqual("no error handler")
				}
			}
		}

		app({ model, view, effects, subscriptions })

		fireDOMLoaded()
	})

})

describe("Lifecycle methods", () => {
	const model = 0
	const update = {
		add: (model, data) => model + data
	}
	const subscriptions = [(_, msg) => msg.add(2)]

	it("fires oncreate", done => {
		let guard = null

		app({
			model: {},
			view: () => (html`<div oncreate=${e => guard = e}></div>`)
		})

		setTimeout(() => {
			expect(guard).not.toEqual(null)
			done()
		}, 1)
	})

	it("fires onupdate", done => {
		let guard = null

		const view = (model) => html`<div onupdate=${e => guard = e}></div>`

		app({ model, update, subscriptions, view })

		fireDOMLoaded()

		setTimeout(() => {
			expect(guard).not.toEqual(null)
			done()
		})

	})

	it("fires onremove", done => {
		let guard = null

		const a = html`
            <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li onremove=${e => guard = e}>foo</li>
            </ul>`

		const b = html`
            <ul>
                <li>foo</li>
                <li>bar</li>
            </ul>`

		const view = model => html`${model === 0 ? a : b}`

		app({ model, view, update, subscriptions })

		fireDOMLoaded()

		setTimeout(() => {
			expect(guard).not.toEqual(null)
			done()
		})
	})
})

describe("Router API", () => {
	it("calls router with object.render(view)", () => {
		const model = "beep"

		app({
			model: "beep",
			router: render => {
				render(model => html`<h1 id="test">${model}</h1>`)
			}
		})

		var el = document.getElementById("test")

		expect(el).not.toBe(null)
		expect(el.innerHTML).toBe(model)
	})

	it("calls router with object.render(view) #2", () => {
		const model = "beep"

		app({
			view: model => html`<h1 id="test">${model}</h1>`,
			model: "beep",
			router: render => render(undefined)
		})

		var el = document.getElementById("test")

		expect(el).not.toBe(null)
		expect(el.innerHTML).toBe(model)
	})
})
