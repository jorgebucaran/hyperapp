const h = require("snabbdom/h")
const html = require("hyperx")((tagName, attrs, children) => {
    const keys = Object.keys(attrs), data = {
        class: {}, props: {}, style: {}, attrs: {}, on: {}
    }

    let i = keys.length

    while (~--i) {
        const key = keys[i], value = attrs[key]

        if (key === undefined) {
            continue
        }

        if (key === "className") {
            value.split(" ").forEach(cls => data.class[cls] = true)

        } else if (key === "style") {
            data.style = value

        } else if (0 === key.indexOf("on")) {
            data.on[key.substr(2)] = value

        } else {
            data.props[key] = data.attrs[key] = value === "true"
                ? true : value === "false" ? false : value
        }
    }

    return h(tagName, data, children ? [].concat(...children) : children)
})
const snabbdom = require("snabbdom")
const patch = snabbdom.init([
    require("snabbdom/modules/class"),
    require("snabbdom/modules/props"),
    require("snabbdom/modules/style"),
    require("snabbdom/modules/attributes"),
    require("snabbdom/modules/eventlisteners")
])

const app = (model, view, reducers, subscriptions, container) => {
    if (view === undefined) {
        view = model.view
        reducers = model.reducers || model.update
        subscriptions = model.subscriptions
        container = model.container
        model = model.model
    }

    const update = typeof reducers === "function"
        ? reducers
        : (model, msg) => {
            const type = msg.type === undefined ? msg : msg.type
            return reducers[type] === undefined
                ? model
                : reducers[type](model, msg)
        }

    const render = (model, view, update, lastNode) => {
        const send = msg => render(update(model, msg), view, update, nextNode)
        const nextNode = view(model, send)

        if (subscriptions)
            document.addEventListener("DOMContentLoaded", _ =>
                Object.keys(subscriptions).forEach(key => subscriptions[key](send)))

        patch(lastNode, nextNode)
    }

    return render(model, view, update, container
        ? container
        : document.body.appendChild(document.createElement("div"))
    )
}

module.exports = { html, app }
