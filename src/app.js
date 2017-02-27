export default function (options) {
	var model = options.model
	var view = options.view

	var actions = {}
	var effects = options.effects || {}
	var reducers = options.reducers || options.update || {}
	var subs = options.subscriptions

	var router = options.router || Function.prototype

	var node
	var root
	var batch = []

	var hooks = merge({
		onAction: Function.prototype,
		onUpdate: Function.prototype,
		onError: function (err) {
			throw err
		}
	}, options.hooks)

	createActions(false, effects, actions)
	createActions(true, reducers, actions)

	ready(function () {
		root = options.root || document.body.appendChild(document.createElement("div"))

		if (typeof view === "function") {
			render(model, view)
		}

		router(function (newView) {
			render(model, view = newView ? newView : view, node)
		}, options)

		for (var key in subs) {
			subs[key](model, actions, hooks.onError)
		}
	})

	function createActions(isReducer, collection, container, name) {
		Object.keys(collection).forEach(function (namespace) {
			if (!container[namespace]) {
				container[namespace] = {}
			}

			var action = collection[namespace]

			if (typeof action === "function") {
				name = name ? name + "." + namespace : namespace

				container[namespace] = function (data) {
					hooks.onAction(name, data)

					if (isReducer) {
						hooks.onUpdate(model, model = merge(model, action(model, data)), data)
						render(model, view, node)
						return actions
					} else {
						return action(model, actions, data, hooks.onError)
					}
				}
			} else {
				createActions(isReducer, action, container[namespace], name)
			}
		})
	}

	function ready(cb) {
		if (document.readyState !== "loading") {
			cb()
		} else {
			document.addEventListener("DOMContentLoaded", cb)
		}
	}

	function render(model, view, lastNode) {
		patch(root, node = view(model, actions), lastNode, 0)

		for (var i = 0; i < batch.length; i++) {
			batch[i]()
		}

		batch = []
	}

	function merge(a, b) {
		var obj = {}, key

		if (isPrimitive(typeof b) || Array.isArray(b)) {
			return b
		}

		for (key in a) {
			obj[key] = a[key]
		}
		for (key in b) {
			obj[key] = b[key]
		}

		return obj
	}

	function isPrimitive(type) {
		return type === "string" || type === "number" || type === "boolean"
	}

	function defer(fn, data) {
		setTimeout(function () {
			fn(data)
		}, 0)
	}

	function shouldUpdate(a, b) {
		return a.tag !== b.tag
			|| typeof a !== typeof b
			|| isPrimitive(typeof a) && a !== b
	}

	function createElementFrom(node) {
		var element

		if (isPrimitive(typeof node)) {
			element = document.createTextNode(node)

		} else {
			element = node.data && node.data.ns
				? document.createElementNS(node.data.ns, node.tag)
				: document.createElement(node.tag)

			for (var name in node.data) {
				if (name === "oncreate") {
					defer(node.data[name], element)
				} else {
					setElementData(element, name, node.data[name])
				}
			}

			for (var i = 0; i < node.children.length; i++) {
				var childNode = node.children[i]

				if (childNode !== undefined && typeof childNode !== "boolean" && childNode !== null) {
					element.appendChild(createElementFrom(childNode))
				}
			}
		}

		return element
	}

	function removeElementData(element, name, value) {
		element.removeAttribute(name === "className" ? "class" : name)

		if (typeof value === "boolean" || value === "true" || value === "false") {
			element[name] = false
		}
	}

	function setElementData(element, name, value, oldValue) {
		if (name === "style") {
			for (var i in value) {
				element.style[i] = value[i]
			}

		} else if (name[0] === "o" && name[1] === "n") {
			var event = name.substr(2)
			element.removeEventListener(event, oldValue)
			element.addEventListener(event, value)

		} else {
			if (value === "false" || value === false) {
				element.removeAttribute(name)
				element[name] = false
			} else {
				element.setAttribute(name, value)
				if (element.nsURI !== "http://www.w3.org/2000/svg") {
					element[name] = value
				}
			}
		}
	}

	function updateElementData(element, data, oldData) {
		for (var name in merge(oldData, data)) {
			var value = data[name]
			var oldValue = oldData[name]
			var realValue = element[name]

			if (value === undefined) {
				removeElementData(element, name, oldValue)

			} else if (name === "onupdate") {
				defer(value, element)

			} else if (value !== oldValue
				|| typeof realValue === "boolean" && realValue !== value) {
				setElementData(element, name, value, oldValue)
			}
		}
	}

	function patch(parent, node, oldNode, index) {
		if (oldNode === undefined) {
			parent.appendChild(createElementFrom(node))

		} else if (node === undefined) {
			var element = parent.childNodes[index]
			batch.push(parent.removeChild.bind(parent, element))

			if (oldNode && oldNode.data && oldNode.data.onremove) {
				defer(oldNode.data.onremove, element)
			}

		} else if (shouldUpdate(node, oldNode)) {
			var element = parent.childNodes[index]
			if (typeof node === "boolean") {
				parent.removeChild(element)

			} else {
				var newElement = createElementFrom(node)
				if (element === undefined) {
					parent.appendChild(newElement)
				} else {
					parent.replaceChild(newElement, element)
				}
			}

		} else if (node.tag) {
			var element = parent.childNodes[index]
			updateElementData(element, node.data, oldNode.data)

			var len = node.children.length, oldLen = oldNode.children.length

			for (var i = 0; i < len || i < oldLen; i++) {
				var child = node.children[i]
				if (child !== null) {
					patch(element, child, oldNode.children[i], i)
				}
			}
		}
	}
}
