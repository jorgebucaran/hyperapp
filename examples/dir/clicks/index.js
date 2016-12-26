import { app, html } from "flea"

const model = 0

const update = {
    click: model => model + 1
}

const view = model => html`<h1>${model} clicks</h1>`

const subs = [
    msg => addEventListener("mousedown", msg.click)
]

app({ model, view, update, subs })

