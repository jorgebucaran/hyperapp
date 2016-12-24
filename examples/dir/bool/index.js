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
    ({ toggle }) => addEventListener("mousedown", toggle),
    ({ toggle }) => addEventListener("mouseup", toggle)
]

app(model, view, update, subs)
