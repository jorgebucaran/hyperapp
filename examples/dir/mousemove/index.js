import { app, html } from "flea"

const model = { x: 0, y: 0 }

const update = {
    move: (model, { x, y }) => ({ ...model, x, y })
}

const view = model => html`<pre>${model.x}, ${model.y}</pre>`

const subs = [
    msg => addEventListener("mousemove", e => msg.move({ x: e.clientX, y: e.clientY }))
]

app({ model, view, update, subs })

