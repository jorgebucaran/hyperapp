import { app, html } from "flea"

const model = { red: 0, green: 0, blue: 0 }

const view = (model, dispatch) => {
    const slider = _ => Object.keys(model).map(key => html`
        <div><input type="range" min="0" max="255" value=${model[key]} oninput=${e => dispatch({
            type: "COLOR",
            key, value: e.target.value
        })}/></div>`)

    return html`
    <div>
        <h1 style=${{
            display: "inline-block",
            borderBottom: `50px solid rgb(${model.red}, ${model.green}, ${model.blue})`
        }}>
        ${Object
            .values(model)
            .reduce((hex, color) =>
                hex + "" + parseInt(color).toString(16).toUpperCase(), "#")}</h1>
        ${slider()}
    </div>`
}

const update = {
    COLOR: (model, action) => ({
        ...model,
        [action.key]: action.value
    })
}

app(model, view, update)
