import { app, html } from "flea"

app({
    model: "Hello!",
    view: model => html`<h1>${model}</h1>`
})

