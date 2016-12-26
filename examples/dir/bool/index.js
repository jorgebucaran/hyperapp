import { app, html } from "flea"

const model = false

const view = model => html`
    <h1 style=${{ userSelect: "none", color: model ? "crimson" : "deepskyblue"}}>
        Mouse down/up anywhere to toggle color.
    </h1>
`

const update = {
    toggle: model => !model
}

const subs = [
    msg => addEventListener("mousedown", msg.toggle),
    msg => addEventListener("mouseup", msg.toggle)
]

app({ model, view, update, subs })
