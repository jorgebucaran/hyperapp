import { app, html } from "flea"

const model = {
    dragging: false,
    position: {
        x: 0, y: 0, offsetX: 0, offsetY: 0
    }
}

const view = (model, msg) => html`
    <div
        onmousedown=${e => msg.drag({
            position: {
                x: e.pageX, y: e.pageY, offsetX: e.offsetX, offsetY: e.offsetY
            }
        })}
        style=${{
            userSelect: "none",
            cursor: "move",
            position: "absolute",
            padding: "50px",
            fontSize: "20px",
            left: `${model.position.x - model.position.offsetX}px`,
            top: `${model.position.y - model.position.offsetY}px`,
            backgroundColor: model.dragging ? "gold" : "deepskyblue"
        }}
    >Drag Me!
    </div>`

const update = {
    drop: model => ({ ...model, dragging: false }),
    drag: (model, { position }) => ({ ...model, dragging: true, position }),
    move: (model, { x, y }) => model.dragging
        ? ({ ...model, position: { ...model.position, x, y } })
        : model
}

const subs = [
    msg => addEventListener("mouseup", msg.drop),
    msg => addEventListener("mousemove", e =>
        msg.move({ x: e.pageX, y: e.pageY }))
]

app(model, view, update, subs)
