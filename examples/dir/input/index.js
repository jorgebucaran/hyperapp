import { app, html } from "flea"

const model = { color: "" }

const view = (model, msg) => html`
    <div>
        <input
            style=${{
                color: model.color,
                borderColor: model.color,
                outline: "none"
             }}
            placeholder="Type a color..."
            type="text" oninput=${e => msg.change({ color: e.target.value })}
        />

    </div>`

const update = {
    change: (model, { color }) => ({ ...model, color })
}

app({ model, view, update })