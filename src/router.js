export default function (render, options) {
    var routes = options.view

    function setLocation(data) {
        render(match(routes, data))
        history.pushState({}, "", data)
    }

    window.addEventListener("popstate", function () {
        render(match(routes, location.pathname))
    })

    window.addEventListener("click", function (e) {
        if (e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) {
            return
        }

        var target = e.target

        while (target && target.localName !== "a") {
            target = target.parentNode
        }

        if (target && target.host === location.host
            && !target.hasAttribute("data-no-routing")) {

            var element = document.querySelector(target.hash === "" ? element : target.hash)

            if (element) {
                element.scrollIntoView(true)
            } else {
                e.preventDefault()
                setLocation(target.pathname)
            }
        }
    })

    render(match(routes, location.pathname))

    function match(routes, path) {
        for (var route in routes) {
            var re = regexify(route), params = {}, match

            if (route === "*") {
                continue
            }

            path.replace(new RegExp(re.re, "g"), function () {
                for (var i = 1; i < arguments.length - 2; i++) {
                    params[re.keys.shift()] = arguments[i]
                }

                match = function (model, actions) {
                    actions.setLocation = setLocation
                    return routes[route](model, actions, params)
                }
            })

            if (match) {
                return match
            }
        }

        return routes["*"] || function(m,a) { return "404 Not Found" }
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
