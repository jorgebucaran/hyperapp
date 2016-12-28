var patch = require("snabbdom").init([
    require("snabbdom/modules/class"),
    require("snabbdom/modules/props"),
    require("snabbdom/modules/style"),
    require("snabbdom/modules/attributes"),
    require("snabbdom/modules/eventlisteners")
])

var html = require("hyperx")((function (h) {
    return function (tagName, attrs, children) {
        var data = {
            class: {},
            props: {},
            style: {},
            attrs: {},
            on: {},
            hook: {}
        }

        for (var key in attrs) {
            if (key === undefined || !attrs.hasOwnProperty(key)) {
                continue
            }
            var value = attrs[key]

            if (key === "className") {
                var cls = value.split(" ")
                for (var i = 0; i < cls.length; i++) {
                    data.class[cls[i]] = true
                }
            } else if (key === "style") {
                data.style = value

            } else if ("on" === key.substr(0, 2)) {
                data.on[key.substr(2)] = value

            } else if ("data-hook-" === key.substr(0, 10)) {
                data.hook[key.substr(10)] = value

            } else {
                data.props[key] = data.attrs[key] = value === "true"
                    ? true : value === "false" ? false : value
            }
        }

        return h(tagName, data, children ? [].concat.apply([], children) : children)
    }
} (require("snabbdom/h"))))

function app(options) {
    var model = options.model,
        view = options.view,
        reducers = options.reducers || options.update || {},
        subs = options.subs || options.subscriptions || {},
        effects = options.effects || {},
        hooks = options.hooks || {},
        root = options.root || document.body.appendChild(document.createElement("div"))

    var update = typeof reducers === "function"
        ? reducers
        : function (model, name, data) {
            var reduce = reducers[name]
            if (typeof reduce !== "function") {
                throw TypeError(name + " is not a reducer or effect (function)")
            }
            return reduce(model, data)
        }

    Object
        .keys(reducers)
        .concat(Object.keys(effects))
        .forEach(function (name) {
            if (reducers[name] !== undefined && effects[name] !== undefined) {
                throw TypeError(name + " is already defined as a reducer and/or an effect, use a different name")
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

module.exports = { html: html, app: app }


