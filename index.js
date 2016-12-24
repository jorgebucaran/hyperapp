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

function app(model, view, reducers, subs, effects, container) {
    if (view === undefined) {
        view = model.view
        reducers = model.reducers || model.update
        subs = model.subs || model.subscriptions
        effects = model.effects
        container = model.container
        model = model.model
    }

    subs = subs || {}
    reducers = reducers || {}
    effects = effects || {}

    var update = typeof reducers === "function"
        ? reducers
        : function(model, msg, data) {
            var reduce = reducers[msg]
            if (typeof reduce !== "function") {
                throw TypeError(msg + " is not a reducer or effect (function)")
            }
            return reduce(model, data)
        }

    function dispatch(msg, data) {
        var effect = effects[msg]
        if (typeof effect === "function") {
            effect(model, dispatch)
            return
        }
        render(model = update(model, msg, data), view, update, container)
        return model
    }

    Object
        .keys(reducers)
        .concat(Object.keys(effects))
        .forEach(function(msg) {
            if (reducers[msg] !== undefined && effects[msg] !== undefined) {
                throw TypeError(msg + " is already defined either as a reducer and/or an effect, use a different name")
            }
            dispatch[msg] = function(data) {
                dispatch(msg, data)
            }
        })

    function render(model, view, update, lastNode) {
        patch(lastNode, container = view(model, dispatch))
    }

    render(model, view, update, container
        ? container
        : document.body.appendChild(document.createElement("div"))
    )

    document.addEventListener("DOMContentLoaded", function () {
        Object.keys(subs).forEach(function (key) {
            subs[key](dispatch, model)
        })
    })
}

module.exports = { html: html, app: app }
