var patch = require("snabbdom").init([
    require("snabbdom/modules/class"),
    require("snabbdom/modules/props"),
    require("snabbdom/modules/style"),
    require("snabbdom/modules/attributes"),
    require("snabbdom/modules/eventlisteners")
])

module.exports = function app (options) {
    var model = options.model,
        view = options.view,
        reducers = options.update || {},
        effects = options.effects || {},
        subs = options.subs || {},
        hooks = options.hooks || {},
        root = options.root || document.body.appendChild(document.createElement("div"))

    var update = function (model, name, data) {
        var reduce = reducers[name]
        return reduce(model, data)
    }

    for (var name in reducers) {
        wrap(dispatch, name)
    }

    for (var name in effects) {
        if (dispatch[name] !== undefined) {
            throw TypeError(name + " is already defined as a reducer or effect")
        }
        wrap(dispatch, name)
    }

    document.addEventListener("DOMContentLoaded", function () {
        for (var key in subs) {
            subs[key](model, dispatch, error)
        }
    })

    render(model, view, update, root)

    function render (model, view, update, lastNode) {
        if (view !== undefined) {
            patch(lastNode, root = view(model, dispatch))
        }
    }

    function error (err) {
        if (hooks.onError === undefined) {
            throw err
        }
        hooks.onError(err)
    }

    function dispatch (name, data) {
        if (hooks.onAction !== undefined) {
            hooks.onAction(name, data)
        }

        var effect = effects[name]

        if (typeof effect === "function") {
            effect(model, dispatch, error)
        } else {
            var lastModel = model

            render(model = merge(model, update(model, name, data)), view, update, root)

            if (hooks.onUpdate !== undefined) {
                hooks.onUpdate(lastModel, model, data)
            }
        }
    }

    function merge (target, source) {
        if (typeof source === "string") {
            return source
        }

        for (var key in source) {
            target[key] = source[key]
        }

        return key === undefined ? source : target
    }

    function wrap (func, key) {
        func[key] = function (data) {
            func(key, data)
        }
    }
}
