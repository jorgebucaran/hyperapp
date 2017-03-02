/* global beforeEach, describe, it, expect */

import { app, h } from "../src"

const expectHTMLToBe = body =>
	expect(document.body.innerHTML).toBe(body
		.replace(/\r?\n|\r|\t/g, "")
		.replace(/\s+</g, "<")
		.replace(/>\s+/g, ">"))

beforeEach(() => {
	document.body.innerHTML = ""
})

describe("app", () => {
	describe("architecture", () => {
		it("boots on DOMContentLoaded", done => {
			Object.defineProperty(document, "readyState", {
				writable: true
			})

			window.document.readyState = "loading"

			app({
				model: "foo",
				subscriptions: [
					model => {
						expect(model).toEqual("foo")
						done()
					}
				]
			})

			window.document.readyState = "complete"

			const event = document.createEvent("Event")
			event.initEvent("DOMContentLoaded", true, true)
			window.document.dispatchEvent(event)
		})

		it("creates an empty div if no view is given", () => {
			app({})
			expect(document.body.innerHTML).toBe("<div></div>")
		})

		it("toggles class attributes", () => {
			app({
				model: true,
				view: model => h("div", model ? { class: "foo" } : {}, "bar"),
				reducers: {
					toggle: model => !model
				},
				subscriptions: [
					(_, actions) => {
						expectHTMLToBe(`
							<div>
								<div class="foo">
									bar
								</div>
							</div>
						`)

						actions.toggle()

						expectHTMLToBe(`
							<div>
								<div>
									bar
								</div>
							</div>
						`)
					}
				]
			})
		})

		it("updates/removes element data", () => {
			app({
				model: false,
				view: model => h("div", model
					? { id: "xuuq", foo: true } : {
						id: "quux",
						class: "foo",
						style: {
							color: "red"
						},
						foo: true,
						baz: false
					}, "bar"
				),
				reducers: {
					toggle: model => !model
				},
				subscriptions: [
					(_, actions) => {
						expectHTMLToBe(`
							<div>
								<div id="quux" class="foo" style="color: red;" foo="true">
									bar
								</div>
							</div>
						`)

						actions.toggle()

						expectHTMLToBe(`
							<div>
								<div id="xuuq" foo="true">
									bar
								</div>
							</div>
						`)
					}
				]
			})
		})

		it("removes node/s when a container's number of children is different", () => {
			app({
				model: true,
				reducers: {
					toggle: model => !model
				},
				view: model => model
					? h("div", {}, h("h1", {}, "foo"), h("h2", {}, "bar"))
					: h("div", {}, h("h1", {}, "foo")),
				subscriptions: [(_, actions) => actions.toggle()]
			})

			expectHTMLToBe(`
				<div>
					<div>
						<h1>foo</h1>
					</div>
				</div>
			`)
		})

		describe("lifecycle methods", () => {
			it("fires oncreate", done => {
				app({
					model: 1,
					view: model => h("div", {
						oncreate: e => {
							expect(model).toBe(1)
							done()
						}
					})
				})
			})

			it("fires onupdate", done => {
				app({
					model: 1,
					view: model => h("div", {
						onupdate: e => {
							expect(model).toBe(2)
							done()
						}
					}),
					reducers: {
						add: model => model + 1
					},
					subscriptions: [
						(_, actions) => actions.add()
					]
				})
			})

			it("fires onremove", done => {
				const treeA = h("ul", {},
					h("li", {}, "foo"),
					h("li", {
						onremove: _ => {
							done()
						}
					}, "bar"))

				const treeB = h("ul", {}, h("li", {}, "foo"))

				app({
					model: true,
					view: _ => _ ? treeA : treeB,
					reducers: {
						toggle: model => !model
					},
					subscriptions: [
						(_, actions) => actions.toggle()
					]
				})
			})
		})
	})

	describe("root", () => {
		it("appends view to given root", () => {
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
	})

	describe("model", () => {
		it("renders a model", () => {
			app({
				model: "foo",
				view: model => h("div", {}, model)
			})

			expectHTMLToBe(`
				<div>
					<div>foo</div>
				</div>
			`)
		})

		it("renders a model with a loop", () => {
			app({
				model: ["foo", "bar", "baz"],
				view: model => h("ul", {}, model.map(i => h("li", {}, i)))
			})

			expectHTMLToBe(`
				<div>
					<ul>
						<li>foo</li>
						<li>bar</li>
						<li>baz</li>
					</ul>
				</div>
			`)
		})

		it("renders an svg tag", () => {
			app({
				view: _ => h("svg", {}, "foo")
			})

			expectHTMLToBe(`
				<div>
					<svg ns="http://www.w3.org/2000/svg">
						foo
					</svg>
				</div>
			`)
		})

		it("ignores children that are bool/null", () => {
			app({
				view: _ => h("div", {},
					h("h1", {}, true),
					h("h2", {}, false),
					h("h3", {}, null)
				)
			})

			expectHTMLToBe(`
				<div>
					<div>
						<h1></h1>
						<h2></h2>
						<h3></h3>
					</div>
				</div>
			`)
		})
	})

	describe("actions", () => {
		describe("reducers", () => {
			it("renders view when model changes", () => {
				app({
					model: 1,
					view: model => h("div", {}, model),
					reducers: {
						add: model => model + 1
					},
					subscriptions: [
						(_, actions) => actions.add()
					]
				})

				expectHTMLToBe(`
				<div>
					<div>2</div>
				</div>
			`)
			})
		})

		describe("effects", () => {
			it("can be called via actions", () => {
				app({
					model: "foo",
					effects: {
						bar: (model, actions, data, error) => {
							expect(model).toBe("foo")
							expect(data).toBe("baz")
							expect(actions.bar).not.toBe(null)

							try {
								error("quux")
							} catch (err) {
								expect(err).toBe("quux")
							}
						}
					},
					subscriptions: [
						(_, actions) => actions.bar("baz")
					]
				})
			})
		})

		describe("namespaces", () => {
			it("collects actions by namespace key", () => {
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

			it("does not overwrite actions when both reducers and effects use the same namespace", () => {
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
	})

	describe("hooks", () => {
		it("calls onAction/onUpdate/onRender", done => {
			app({
				view: model => h("div", {}, model),
				model: "foo",
				reducers: {
					set: (_, data) => data
				},
				subscriptions: [
					(_, actions) => actions.set("bar")
				],
				hooks: {
					onAction: (action, data) => {
						expect(action).toBe("set")
						expect(data).toBe("bar")
					},
					onUpdate: (oldModel, newModel, data) => {
						expect(oldModel).toBe("foo")
						expect(newModel).toBe("bar")
						expect(data).toBe("bar")
					},
					onRender: (model, view) => {
						if (model === "foo") {
							expect(view("bogus")).toEqual({
								tag: "div",
								data: {},
								children: ["bogus"]
							})
							return view
						} else {
							expect(model).toBe("bar")
							done()
						}


					}
				}
			})
		})

		it("calls onAction with full name for nested actions", done => {
			app({
				model: "foo",
				reducers: {
					foo: {
						bar: {
							baz: {
								set: (_, data) => data
							}
						}
					}
				},
				hooks: {
					onAction: (name, data) => {
						expect(name).toBe("foo.bar.baz.set")
						expect(data).toBe("baz")
						done()
					}
				},
				subscriptions: [
					(_, actions) => actions.foo.bar.baz.set("baz")
				]
			})
		})

		it("calls onError", done => {
			app({
				hooks: {
					onError: err => {
						expect(err).toBe("foo")
						done()
					}
				},
				subscriptions: [
					(model, actions, error) => {
						error("foo")
					}
				]
			})
		})

		it("throw if onError hook is not given when error is called", () => {
			app({
				subscriptions: [
					(model, actions, error) => {
						try {
							error("foo")
						} catch (err) {
							expect(err).toBe("foo")
						}
					}
				]
			})
		})
	})

	describe("subscriptions", () => {
		it("are called when the app starts", done => {
			app({
				subscriptions: [done]
			})
		})
	})

	describe("plugins", () => {
		it("don't spoil the model when undefined", () => {
			const Plugin = app => ({/*don't export model*/ })

			app({
				model: 1,
				view: model => h("div", {}, model),
				subscriptions: [
					model => {
						expect(model).toBe(1)
					}
				],
				plugins: [Plugin]
			})
		})

		it("can extend the model", () => {
			const Plugin = app => ({
				model: {
					"bar": app.model.foo
				}
			})

			app({
				model: {
					foo: true
				},
				plugins: [Plugin],
				subscriptions: [
					model => {
						expect(model).toEqual({
							foo: true,
							bar: true
						})
					}
				]
			})
		})

		it("can add new subscriptions", () => {
			const Plugin = app => ({
				subscriptions: [
					(model, actions) => {
						actions.add()
						expectHTMLToBe(`
							<div>
								<div>
									3
								</div>
							</div>
						`)
					}
				]
			})

			app({
				model: 1,
				view: model => h("div", {}, model),
				reducers: {
					add: model => model + 1
				},
				subscriptions: [
					(_, actions) => {
						expectHTMLToBe(`
							<div>
								<div>
									1
								</div>
							</div>
						`)

						actions.add()

						expectHTMLToBe(`
							<div>
								<div>
									2
								</div>
							</div>
						`)
					}
				],
				plugins: [Plugin]
			})

		})

		it("can add actions", () => {
			const Plugin = app => ({
				reducers: {
					foo: {
						bar: {
							baz: {
								toggle: model => !model
							}
						}
					}
				}
			})

			app({
				model: true,
				view: model => h("div", {}, `${model}`),
				subscriptions: [
					(_, actions) => {
						expectHTMLToBe(`
							<div>
								<div>
									true
								</div>
							</div>
						`)

						actions.foo.bar.baz.toggle()

						expectHTMLToBe(`
							<div>
								<div>
									false
								</div>
							</div>
						`)
					}
				],
				plugins: [Plugin]
			})
		})

		it("allow hooks to have multiple listeners", () => {
			const PluginFoo = app => ({
				hooks: {
					onRender: (model, view) => model => h("foo", {}, view(model))
				}
			})
			const PluginBar = app => ({
				hooks: {
					onRender: (model, view) => model => h("bar", {}, view(model))
				}
			})

			app({
				model: "foo",
				view: model => h("div", {}, model),
				plugins: [PluginFoo, PluginBar]
			})

			expectHTMLToBe(`
				<div>
					<bar>
						<foo>
							<div>
								foo
							</div>
						</foo>
					</bar>
				</div>
			`)
		})
	})
})



