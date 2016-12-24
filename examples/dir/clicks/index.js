import { app, html } from "flea"

const model = 0

const update = {
    click: model => model + 1
}

const view = model => html`<h1>${model} clicks</h1>`

const subs = [
    ({ click }) => addEventListener("mousedown", click)
]

app(model, view, update, subs)

