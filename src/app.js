module.exports = options => {
	const defer = (fn, data) => {
		setTimeout(_ => fn(data), 0)
	}

	const merge = (a, b) => {
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

	const isPrimitive = type => type === "string" || type === "number" || type === "boolean"

	const render = (model, view, lastNode) => {
		patch(root, node = view(model, msg), lastNode, 0)
	}

	const shouldUpdate = (a, b) => a.tag !== b.tag || typeof a !== typeof b || isPrimitive(typeof a) && a !== b

	const patch = (parent, node, oldNode, index) => {
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

			var len = node.tree.length, oldLen = oldNode.tree.length

			for (var i = 0; i < len || i < oldLen; i++) {
				patch(element, node.tree[i], oldNode.tree[i], i)
			}
		}
	}

	const createElementFrom = node => {
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

			for (var i = 0; i < node.tree.length; i++) {
				element.appendChild(createElementFrom(node.tree[i]))
			}
		}

		return element
	}

	const setElementData = (element, name, value, oldValue) => {
		if (name === "style") {
			for (var i in value) {
				element.style[i] = value[i]
			}

		} else if (name.substr(0, 2) === "on") {
			var event = name.substr(2)
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

	const removeElementData = (element, name, value) => {
		element.removeAttribute(name === "className" ? "class" : name)

		if (typeof value === "boolean" || value === "true" || value === "false") {
			element[name] = false
		}
	}

	const updateElementData = (element, data, oldData) => {
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

	const regexify = path => {
		var keys = [], re = "^" + path
			.replace(/\//g, "\\/")
			.replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
				keys.push(key)
				return "([A-Za-z0-9_]+)"
			}) + "/?$"

		return { re: re, keys: keys }
	}

	const route = (routes, path) => {
		for (var route in routes) {
			var re = regexify(route), params = {}, match

			path.replace(new RegExp(re.re, "g"), function() {
				for (var i = 1; i < arguments.length - 2; i++) {
					params[re.keys.shift()] = arguments[i]
				}
				match = (model, msg) => routes[route](model, msg, params)
			})

			if (match) {
				return match
			}
		}

		return routes["/"]
	}

	var msg = {}

	var model = options.model
	var reducers = options.update || {}
	var effects = options.effects || {}
	var subs = options.subs || {}

	var hooks = merge({
		onAction: Function.prototype,
		onUpdate: Function.prototype,
		onError: err => {
			throw err
		}
	}, options.hooks)

	var node
	var root = options.root || document.body.appendChild(document.createElement("div"))
	var view = options.view || (_ => root)
	var routes = typeof view === "function" ? undefined : view

	if (routes) {
		view = route(routes, location.pathname)

		msg.setLocation = data => {
			render(model, view = route(routes, data), node)
			history.pushState({}, "", data)
		}

		window.addEventListener("popstate", _ => {
			render(model, view = route(routes, location.pathname), node)
		})

		window.addEventListener("click", e => {
			if (e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) {
				return
			}

			var target = e.target

			while (target && target.localName !== "a") {
				target = target.parentNode
			}

			if (target && target.host === location.host
				&& !target.hasAttribute("data-no-routing")) {

				var element = target.hash === "" ? element : document.querySelector(target.hash)

				if (element) {
					element.scrollIntoView(true)
				} else {
					msg.setLocation(target.pathname)
					e.preventDefault()
				}
			}
		})
	}

	for (let name in merge(reducers, effects)) {
		msg[name] = data => {
			hooks.onAction(name, data)

			var effect = effects[name]
			if (effect) {
				return effect(model, msg, data, hooks.onError)
			}

			var update = reducers[name], _model = model
			render(model = merge(model, update(model, data)), view, node)

			hooks.onUpdate(_model, model, data)
		}
	}

	document.addEventListener("DOMContentLoaded", _ => {
		for (var sub in subs) {
			subs[sub](model, msg, hooks.onError)
		}
	})

	render(model, view)
}
