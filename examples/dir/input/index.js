import { app, html } from "flea"

const model = { name: "" }

const view = (model, dispatch) => html`
    <div>
        <h1>Hello${model.name === "" ? "!" : `, ${model.name}!`}</h1>
        <input placeholder="What's your name?" type="text" oninput=${e =>
            dispatch({
                type: "UPDATE_TEXT",
                value: e.target.value
            })
        }/>
    </div>`

const update = {
    UPDATE_TEXT: (model, action) => ({
        ...model,
        name: action.value
    })
}

app(model, view, update)