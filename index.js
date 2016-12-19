const h = require("snabbdom/h")
const html = require("hyperx")((tagName, attrs, children) => {
    const keys = Object.keys(attrs), data = {
        class: {},
        props: {},
        style: {},
        on: {}
    }

    let i = keys.length

    while (~--i) {
        const key = keys[i], value = attrs[key]

        if (key === undefined /* || value === undefined */) {
            console.log(`Undefined key (${key}) or value (${value})`, tagName, attrs)
            continue
        }

        switch (key) {
            case "className":
                value.split(" ").forEach(cls => {
                    data.class[cls] = true
                })
                break

            case "style":
                Object.assign(data.style, value)
                break

            default:
                if (0 === key.indexOf("on")) {
                    data.on[key.substr(2)] = value
                } else {
                    data.props[key] = value === "true"
                        ? true : value === "false" ? false : value
                }
        }
    }

    return h(tagName, data, children ? [].concat(...children) : children)
})

const snabbdom = require("snabbdom")
const patch = snabbdom.init([
    require("snabbdom/modules/class"),
    require("snabbdom/modules/props"),
    require("snabbdom/modules/style"),
    require("snabbdom/modules/eventlisteners")
])

const app = (model, view, reducers, container) => {
    const update = (model, action) => {
        const type = action.type === undefined
            ? action
            : action.type
        return typeof reducers === "function"
            ? reducers(model, action)
            : reducers[type] === undefined
                ? model
                : reducers[type](model, action)
    }

    const render = (model, view, update, lastNode) => {
        const nextNode = view(model, action =>
            render(update(model, action), view, update, nextNode))

        patch(lastNode, nextNode)
    }

    return render(model, view, update, container
        ? container
        : document.body.appendChild(document.createElement("div"))
    )
}

module.exports = { html, app }
