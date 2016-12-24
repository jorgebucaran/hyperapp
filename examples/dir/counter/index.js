import { app, html } from "flea"

const model = 0

const view = (model, { add, sub }) => html`
    <div>
        <button onclick=${add}>+</button>
        <h1>${model}</h1>
        <button onclick=${sub} disabled=${model <= 0}>-</button>
    </div>`

const update = {
    add: model => model + 1,
    sub: model => model - 1
}

app(model, view, update)