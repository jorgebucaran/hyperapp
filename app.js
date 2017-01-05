var patch = require("snabbdom").init([
    require("snabbdom/modules/class"),
    require("snabbdom/modules/props"),
    require("snabbdom/modules/style"),
    require("snabbdom/modules/attributes"),
    require("snabbdom/modules/eventlisteners")
])

module.exports = function app(options) {
    var model = options.model,
        view = options.view || function () { return document.body },
        routes = typeof view === "function" ? undefined : view,
        params = {},
        reducers = options.update || {},
        effects = options.effects || {},
        subs = options.subs || options.subscriptions || {},
        hooks = merge({
            onAction: Function.prototype,
            onUpdate: Function.prototype,
            onError: function (err) { throw err }
        }, options.hooks),
        node = options.root || document.body.appendChild(document.createElement("div"))

    if (routes) {
        view = route(routes, getHashOrPath())

        dispatch.setLocation = function (data) {
            if (history && history.pushState) {
                render(model, view = route(routes, data), node)
                history.pushState({}, "", data)
            } else {
                window.location.hash = data
            }
        }

        window[history && history.pushState ? "onpopstate" : "onhashchange"] = function () {
            render(model, view = route(routes, getHashOrPath()), node)
        }

        window.onclick = function (e) {
            if (e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) {
                return
            }

            var target = e.target

            while (target && target.localName !== "a") {
                target = target.parentNode
            }

            if (target && target.host === location.host && !target.hasAttribute("data-no-routing")) {
                dispatch.setLocation(e.target.pathname)
                e.preventDefault()
            }
        }

        function getHashOrPath() {
            return location.hash ? location.hash.substr(1) : location.pathname
        }
    }

    for (var name in merge(merge({}, reducers), effects)) {
        if (reducers[name] && effects[name]) {
            throw TypeError(name + " already defined as reducer or effect")
        }
        //
        // Wrap name in a closure, so we don't end up dispatching the same action
        // for all dispatch.action(data) calls.
        //
        (function(name) {
            dispatch[name] = function (data) {
                dispatch(name, data)
            }
        }(name))
    }

    ready(function () {
        for (var name in subs) {
            subs[name](model, dispatch, hooks.onError)
        }
    })

    render(model, view, node)

    function ready(cb) {
        document.addEventListener
            ? document.addEventListener("DOMContentLoaded", cb)
            : window.attachEvent("onload", cb)
    }

    function merge(target, source) {
        for (var key in source) {
            target[key] = source[key]
        }
        return typeof source === "string" || typeof source === "number" ? source : target
    }

    function render(model, view, lastNode) {
        patch(lastNode, node = view(model, dispatch))
    }

    function dispatch(name, data) {
        hooks.onAction(name, data)

        var effect = effects[name]
        if (typeof effect === "function") {
            effect(model, dispatch, data, hooks.onError)
            return
        }

        var update = reducers[name], lastModel = model
        if (update === undefined) {
            throw new TypeError(name + " is not a reducer or effect")
        }

        render(model = merge(model, update(model, data)), view, node)

        hooks.onUpdate(lastModel, model, data)
    }

    function route(routes, path) {
        for (var name in routes) {
            if (name === "*") {
                continue
            }

            var re = pathToRe(name), params = {}, match

            path.replace(new RegExp(re.exp, "g"), function () {
                for (var i = 1; i < arguments.length - 2; i++) {
                    params[re.slugs.shift()] = arguments[i]
                }

                match = function (model, dispatch) {
                    return routes[name](model, dispatch, params)
                }
            })

            if (match) {
                return match
            }
        }

        return routes["*"]

        //
        // Translate each route to a regex, e.g, /users?/:id -> /^\/users?\/:([A-Za-z0-9_]+)/?$/
        //
        function pathToRe(path) {
            var slugs = [], re = "^" + path
                .replace(/\//g, "\\/")
                .replace(/:([A-Za-z0-9_]+)/g, function (_, slug) {
                    slugs.push(slug)
                    return "([A-Za-z0-9_]+)"
                }) + "/?$"

            return { exp: re, slugs: slugs }
        }
    }
}

