import { app, html } from "flea"

app({
    model: 0,
    view: model => html`<h1 style=${{userSelect: "none"}}>${model} clicks</h1>`,
    update: {
        click: model => model + 1
    },
    subs: [
        msg => addEventListener("mousedown", msg.click)
    ]
})

