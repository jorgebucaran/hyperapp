import { app, html } from "flea"

app({
    model: 0,
    view: (model, msg) => html`
    <div>
        <button onclick=${msg.add}>+</button>
        <h1>${model}</h1>
        <button onclick=${msg.sub} disabled=${model <= 0}>-</button>
    </div>`,
    update: {
        add: model => model + 1,
        sub: model => model - 1
    }
})