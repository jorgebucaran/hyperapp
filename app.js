var patch = require("snabbdom").init([
    require("snabbdom/modules/class"),
    require("snabbdom/modules/props"),
    require("snabbdom/modules/style"),
    require("snabbdom/modules/attributes"),
    require("snabbdom/modules/eventlisteners")
])

module.exports = function app(options) {
    var model = options.model,
        view = options.view || Function.prototype,
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

    //
    // only if there are routes. dispatch.setLocation is a wrapper for pushState
    // that causes the result view to be render. also intercept all anchor clicks
    // and make them call setLocation with anchor's pathname.
    //
    if (routes) {
        view = route(routes, location.pathname)

        dispatch.setLocation = function (data) {
            render(model, view = route(routes, data), node)
            history.pushState({}, "", data)
        }

        window.onpopstate = function () {
            render(model, view = route(routes, location.pathname), node)
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
    }

    //
    // this is how we wrap dispatch("action", data) to dispatch.action(data).
    //
    for (var name in merge(merge({}, reducers), effects)) {
        if (reducers[name] && effects[name]) {
            throw TypeError(name + " already defined as reducer or effect")
        }
        //
        // wrap name in a closure, so we don't end up dispatching the same action
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


    //
    // ready calls cb when the dom is loaded. Should work in >=IE8.
    //
    function ready(cb) {
        document.addEventListener
            ? document.addEventListener("DOMContentLoaded", cb)
            : window.attachEvent("onload", cb)
    }


    //
    // merge extends target with source properties. if the given source is a string or a number
    // literal, then returns the source as is. this lets you use a single number or string as
    // the initial model.
    //
    function merge(target, source) {
        for (var key in source) {
            target[key] = source[key]
        }
        return typeof source === "string" || typeof source === "number" ? source : target
    }


    //
    // render updates the DOM calling patch with the view. also mutates the current
    // node to the new one.
    //
    function render(model, view, lastNode) {
        patch(lastNode, node = view(model, dispatch))
    }


    //
    // dispatch calls an effect or reducer, aka sending an action. you can either use
    // dispatch("action", data) or dispatch.action(data). the latter looks better so
    // it's the style favored in the docs. sending an action updates the model and
    // renders the result node if the action corresponds to a reducer.
    //
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


    //
    // route returns a params-wrapped view function whose key matches the given path.
    //
    //      Default: *
    //      Regexp: /users?/:name -> /user/foo | /users/foo and params -> { name: "foo" }
    //
    // the current solution consists in transforming each key to a regular expression, e.g,
    //
    //      /users?/:name -> /^\/users?\/:([A-Za-z0-9_]+)/?$/
    //
    // and use a stack to collect slugs that match each group capture..
    //
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

