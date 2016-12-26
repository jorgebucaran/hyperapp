import { app, html } from "flea"

const model = { value: "" }

const view = (model, msg) => html`
    <div>
        <h1>Hello${model.value === "" ? "!" : `, ${model.value}!`}</h1>
        Name: <input type="text" oninput=${e => msg.change({ value: e.target.value })}
        />
    </div>`

const update = {
    change: (model, { value }) => ({ ...model, value })
}

app({ model, view, update })