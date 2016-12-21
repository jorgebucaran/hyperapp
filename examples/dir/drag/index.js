import { app, html } from "flea"

const model = {
    drag: false,
    position: {
        x: 0, y: 0, offsetX: 0, offsetY: 0
    }
}

const view = (model, send) => html`
    <div
        onmousedown=${e => send("DRAG", {
            position: {
                x: e.pageX, y: e.pageY, offsetX: e.offsetX, offsetY: e.offsetY
            }
        })}
        style=${{
            cursor: "move",
            position: "absolute",
            padding: "50px",
            fontSize: "20px",
            left: `${model.position.x - model.position.offsetX}px`,
            top: `${model.position.y - model.position.offsetY}px`,
            backgroundColor: model.drag ? "gold" : "deepskyblue"
        }}
    >Drag Me!
    </div>`

const update = {
    DRAG: (model, { position }) => ({ ...model, drag: true, position }),
    DROP: (model) => ({ ...model, drag: false }),
    MOVE: (model, { x, y }) => model.drag
        ? ({ ...model, position: { ...model.position, x, y } })
        : model
}

const subs = [
    send => document.addEventListener("mouseup", _ => send("DROP")),
    send => document.addEventListener("mousemove", e =>
        send("MOVE", { x: e.pageX, y: e.pageY }))
]

app(model, view, update, subs)
