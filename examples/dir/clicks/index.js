import { app, html } from "flea"

const model = 0

const view = model => html`<h1>${model} clicks</h1>`

const update = {
    CLICK: model => model + 1
}

const subs = [
    dispatch => document.addEventListener("mousedown", _ => dispatch("CLICK"))
]

app(model, view, update, subs)

