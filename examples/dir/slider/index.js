import { app, html } from "flea"

const model = { red: 255, green: 255, blue: 255 }

const view = (model, dispatch) => {
    document.body.style.backgroundColor = `rgb(${model.red}, ${model.green}, ${model.blue})`

    const slider = _ => Object.keys(model).map(key => html`
        <div>
            <input
                type="range" min="0" max="255"
                value=${model[key]}
                oninput=${e => dispatch("COLOR", { key, value: e.target.value })}
            />
        </div>`)

    return html`
    <div>
        <input type="text" style=${{ fontSize: "12px" }} value=${
            Object
                .values(model)
                .reduce((hex, color) => hex + "" + parseInt(color)
                    .toString(16)
                    .toUpperCase(), "#")}
        />
        ${slider()}
    </div>`
}

const update = {
    COLOR: (model, { key, value }) => ({ ...model, [key]: value })
}

app(model, view, update)
