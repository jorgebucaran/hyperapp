var snabbdom = require("snabbdom")

var patch = snabbdom.init([
    require("snabbdom/modules/class"),
    require("snabbdom/modules/props"),
    require("snabbdom/modules/style"),
    require("snabbdom/modules/attributes"),
    require("snabbdom/modules/eventlisteners")
])

var h = require("snabbdom/h")

var html = require("hyperx")(function (tagName, attrs, children) {
    var keys = Object.keys(attrs), i = keys.length
    var data = {
        class: {},
        props: {},
        style: {},
        attrs: {},
        on: {}
    }

    while (~--i) {
        var key = keys[i], value = attrs[key]

        if (key === undefined) {
            continue
        }

        if (key === "className") {
            value.split(" ").forEach(function(cls) {
                data.class[cls] = true
            })
        } else if (key === "style") {
            data.style = value
        } else if (0 === key.indexOf("on")) {
            data.on[key.substr(2)] = value
        } else {
            data.props[key] = data.attrs[key] = value === "true"
                ? true : value === "false" ? false : value
        }
    }

    return h(tagName, data, children ? [].concat.apply([], children) : children)
})

function app(options) {
    var model = options.model,
        view = options.view,
        reducers = options.reducers || options.update || {},
        subs = options.subs || options.subscriptions || {},
        effects = options.effects || {},
        root = options.root || document.body.appendChild(document.createElement("div"))

    var update = typeof reducers === "function"
        ? reducers
        : function(model, name, data) {
            var reduce = reducers[name]
            if (typeof reduce !== "function") {
                throw TypeError(name + " is not a reducer or effect (function)")
            }
            return reduce(model, data)
        }

    Object
        .keys(reducers)
        .concat(Object.keys(effects))
        .forEach(function(name) {
            if (reducers[name] !== undefined && effects[name] !== undefined) {
                throw TypeError(name + " is already defined as a reducer and/or an effect, use a different name")
            }
            dispatch[name] = function(data) {
                dispatch(name, data)
            }
        })

    document.addEventListener("DOMContentLoaded", function () {
        Object.keys(subs).forEach(function (key) {
            subs[key](dispatch, model)
        })
    })

    render(model, view, update, root)

    function render(model, view, update, lastNode) {
        patch(lastNode, root = view(model, dispatch))
    }

    function dispatch(name, data) {
        var effect = effects[name]
        if (typeof effect === "function") {
            effect(model, dispatch)
        } else {
            render(model = update(model, name, data), view, update, root)
        }
    }
}

module.exports = { html: html, app: app }
