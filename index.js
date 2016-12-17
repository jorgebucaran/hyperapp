const { h, create, diff, patch } = require("virtual-dom")
const html = require("hyperx")(h)

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
    const dispatch = action => render(update(state.model, action))
    const tree = view(model, dispatch)
    const state = {
        model,
        tree,
        element: create(tree),
        lockRedraw: false,
        lockRender: false,
    }
    const render = model => {
        if (state.lockRender) {
            return
        }
        if (!state.lockRedraw) {
            state.lockRedraw = true
            requestAnimationFrame(_ => {
                state.lockRender = true
                state.lockRedraw = false

                const tree = view(state.model, dispatch)
                state.element = patch(state.element, diff(state.tree, tree))
                state.tree = tree

                state.lockRender = false
            })
        }
        state.model = model
    }
    (container ? container : document.body).appendChild(state.element)
}

module.exports = { html, app }




