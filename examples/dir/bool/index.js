import { app, html } from "flea"

const model = false

const view = model => html`<h1 style=${{
        color: model ? "blue" : "red"
    }}>Mouse down/up anywhere to toggle color.</h1>
`

const update = {
    TOGGLE: model => !model
}

const subs = [
    dispatch => document.addEventListener("mousedown", _ => dispatch("TOGGLE")),
    dispatch => document.addEventListener("mouseup", _ => dispatch("TOGGLE"))
]

app(model, view, update, subs)
