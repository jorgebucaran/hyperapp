module.exports = function (options) {
	var model = options.model
	var view = options.view

	var actions = {}
	var effects = options.effects || {}
	var reducers = options.update || {}

	var subs = options.subscriptions

	var router = options.router || Function.prototype

	var node
	var root

	var hooks = merge({
		// onRoute?
		onAction: Function.prototype,
		onUpdate: Function.prototype,
		onError: function (err) {
			throw err
		}
	}, options.hooks)

	for (var name in merge(reducers, effects)) {
		(function (name) {
			actions[name] = function (data) {
				hooks.onAction(name, data)

				var effect = effects[name]
				if (effect) {
					return effect(model, actions, data, hooks.onError)
				}

				var update = reducers[name], _model = model
				render(model = merge(model, update(model, data)), view, node)

				hooks.onUpdate(_model, model, data)
			}
		}(name))
	}

	ready(function () {
		for (var key in subs) {
			subs[key](model, actions, hooks.onError)
		}

		root = options.root || document.body.appendChild(document.createElement("div"))

		if (typeof view === "function") {
			render(model, view)
		}

		router(merge(options, {
			render: function (newView) {
				render(model, view = newView ? newView : view, node)
			}
		}))
	})

	function ready(cb) {
		if (document.readyState !== "loading") {
			cb()
		} else {
			document.addEventListener("DOMContentLoaded", cb)
		}
	}

	function render(model, view, lastNode) {
		patch(root, node = view(model, actions), lastNode, 0)
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
				element.appendChild(createElementFrom(node.children[i]))
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

		} else if (name.substr(0, 2) === "on") {
			var event = name.substr(2).toLowerCase()
			element.removeEventListener(event, oldValue)
			element.addEventListener(event, value)

		} else {
			if (value === "false" || value === false) {
				element.removeAttribute(name)
				element[name] = false
			} else {
				element.setAttribute(name, value)
				element[name] = value
			}
		}
	}

	function updateElementData(element, data, oldData) {
		for (var name in merge(oldData, data)) {
			var value = data[name], oldValue = oldData[name]

			if (value === undefined) {
				removeElementData(element, name, oldValue)

			} else if (value !== oldValue) {
				name === "onupdate"
					? defer(value, element)
					: setElementData(element, name, value, oldValue)
			}
		}
	}

	function patch(parent, node, oldNode, index) {
		if (oldNode === undefined) {
			parent.appendChild(createElementFrom(node))

		} else if (node === undefined) {
			while (index > 0 && !parent.childNodes[index]) {
				index--
			}

			if (index >= 0) {
				var element = parent.childNodes[index]

				if (oldNode && oldNode.data) {
					var hook = oldNode.data.onremove
					if (hook) {
						defer(hook, element)
					}
				}

				parent.removeChild(element)
			}

		} else if (shouldUpdate(node, oldNode)) {
			parent.replaceChild(createElementFrom(node), parent.childNodes[index])

		} else if (node.tag) {
			var element = parent.childNodes[index]

			updateElementData(element, node.data, oldNode.data)

			var len = node.children.length, oldLen = oldNode.children.length

			for (var i = 0; i < len || i < oldLen; i++) {
				patch(element, node.children[i], oldNode.children[i], i)
			}
		}
	}
}