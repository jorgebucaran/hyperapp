import { app, html } from "flea"

app({
    model: true,
    view: (model, msg) => html`
        <div>
            <button onclick=${msg.doSomething}>Log</button>
            <button onclick=${msg.boom}>Error</button>
        </div>`,
    update: {
        doSomething: model => !model,
    },
    effects: {
        boom: (model, msg, err) => setTimeout(_ => err(Error("BOOM")), 1000)
    },
    hooks: {
        onError: e =>
            console.log("[Error] %c%s", "color: red", e),
        onAction: (name/*, data*/) =>
            console.log("[Action] %c%s", "color: blue", name),
        onUpdate: (last, model/*, data*/) =>
            console.log("[Update] %c%s -> %c%s", "color: gray", last, "color: blue", model)
    }
})

