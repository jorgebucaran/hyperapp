import { app, html } from "flea"

const model = 0

const view = (model, dispatch) => html`
    <div>
        <button onclick=${_ => dispatch("INCREMENT")}>+</button>
        <h1>${model}</h1>
        <button onclick=${_ => dispatch("DECREMENT")} disabled=${model <= 0}>-</button>
    </div>`

const update = {
    INCREMENT: model => model + 1,
    DECREMENT: model => model - 1
}

app(model, view, update)