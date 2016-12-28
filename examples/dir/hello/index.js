import { app, html } from "flea"

app({
    model: "Hello World!",
    view: model => html`<h1>${model}</h1>`
})

