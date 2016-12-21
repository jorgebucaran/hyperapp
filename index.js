var snabbdom = require("snabbdom")
var h = require("snabbdom/h")

var patch = snabbdom.init([
    require("snabbdom/modules/class"),
    require("snabbdom/modules/props"),
    require("snabbdom/modules/style"),
    require("snabbdom/modules/attributes"),
    require("snabbdom/modules/eventlisteners")
])

var html = require("hyperx")(function (tagName, attrs, children) {
    var keys = Object.keys(attrs), i = keys.length
    var data = {
        class: {}, props: {}, style: {}, attrs: {}, on: {}
    }

    while (~--i) {
        var key = keys[i], value = attrs[key]
        if (key === undefined) continue

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

function app(model, view, reducers, subs, container) {
    if (view === undefined) {
        view = model.view
        reducers = model.reducers || model.update
        subs = model.subs || model.subscriptions
        container = model.container
        model = model.model
    }

    var update = typeof reducers === "function"
        ? reducers
        : function(model, msg, data) {
            return reducers[msg](model, data)
        }

    function render(model, view, update, lastNode) {
        patch(lastNode, container = view(model, dispatch))

        subs && document.addEventListener("DOMContentLoaded", function () {
            Object.keys(subs).forEach(function (key) {
                subs[key](dispatch, model)
            })
        })
    }

    function dispatch(msg, data) {
        render(model = update(model, msg, data), view, update, container)
        return model
    }

    return render(model, view, update, container
        ? container
        : document.body.appendChild(document.createElement("div"))
    )
}

module.exports = { html: html, app: app }

