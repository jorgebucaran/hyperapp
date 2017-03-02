export default function (options) {
	var routes = options.view

	return {
		model: {
			router: {
				location: location.pathname
			}
		},
		effects: {
			router: {
				go: function (model, actions, data) {
					actions.router.setLocation(data)
					history.pushState({}, "", data)
				}
			}
		},
		reducers: {
			router: {
				setLocation: function (model, data) {
					model.router.location = data
					return model
				}
			}
		},
		subscriptions: [
			function (model, actions) {
				window.addEventListener("popstate", function () {
					actions.router.setLocation(location.pathname)
				})
			}
		],
		hooks: {
			onRender: function (model, view) {
				console.log(model.router.location)
				return match(routes, model.router.location)
			}
		}
	}

	function match(routes, path) {
		for (var route in routes) {
			var re = regexify(route), params = {}, match

			path.replace(new RegExp(re.re, "g"), function () {
				for (var i = 1; i < arguments.length - 2; i++) {
					params[re.keys.shift()] = arguments[i]
				}

				match = function (model, actions) {
					return routes[route](model, actions, params)
				}
			})

			if (match) {
				return match
			}
		}

		return routes["/"]
	}

	function regexify(path) {
		var keys = [], re = "^" + path
			.replace(/\//g, "\\/")
			.replace(/:([A-Za-z0-9_]+)/g, function (_, key) {
				keys.push(key)
				return "([A-Za-z0-9_]+)"
			}) + "/?$"

		return { re: re, keys: keys }
	}
}
