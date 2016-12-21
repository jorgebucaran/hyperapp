import { app, html } from "flea"

const model = { value: "" }

const view = (model, dispatch) => html`
    <div>
        <h1>Hello${model.value === "" ? "!" : `, ${model.value}!`}</h1>
        Name: <input type="text" oninput=${e =>
            dispatch("UPDATE_TEXT", { value: e.target.value })}
        />
    </div>`

const update = {
    UPDATE_TEXT: (model, { value }) => ({ ...model, value })
}

app(model, view, update)