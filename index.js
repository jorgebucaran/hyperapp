var patch = require("snabbdom").init([
    require("snabbdom/modules/class"),
    require("snabbdom/modules/props"),
    require("snabbdom/modules/style"),
    require("snabbdom/modules/attributes"),
    require("snabbdom/modules/eventlisteners")
])

module.exports = function app(options) {
    var model = options.model,
        view = options.view,
        reducers = options.reducers || options.update || {},
        subs = options.subscriptions || {},
        effects = options.effects || {},
        hooks = options.hooks || {},
        root = options.root || document.body.appendChild(document.createElement("div"))

    var update = function (model, name, data) {
        var reduce = reducers[name]
        if (typeof reduce !== "function") {
            throw TypeError(name + " is not a reducer or effect")
        }
        return reduce(model, data)
    }

    Object
        .keys(reducers)
        .concat(Object.keys(effects))
        .forEach(function (name) {
            if (reducers[name] !== undefined && effects[name] !== undefined) {
                throw TypeError(name + " is already defined as a reducer or effect")
            }
            dispatch[name] = function (data) {
                dispatch(name, data)
            }
        })

    document.addEventListener("DOMContentLoaded", function () {
        Object.keys(subs).forEach(function (key) {
            subs[key](dispatch, model, error)
        })
    })

    render(model, view, update, root)

    function render(model, view, update, lastNode) {
        if (view === undefined) {
            return
        }
        patch(lastNode, root = view(model, dispatch))
    }

    function error(err) {
        if (hooks.onError === undefined) {
            throw err
        }
        hooks.onError(err)
    }

    function dispatch(name, data) {
        if (hooks.onAction !== undefined) {
            hooks.onAction(name, data)
        }
        var effect = effects[name]
        if (typeof effect === "function") {
            effect(model, dispatch, error)
        } else {
            var lastModel = model
            render(model = update(model, name, data), view, update, root)
            if (hooks.onUpdate !== undefined) {
                hooks.onUpdate(lastModel, model, data)
            }
        }
    }
}




