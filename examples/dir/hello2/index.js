import { app, html } from "flea"

app({
    model: "Howdy!",
    view: model => html`<h1>${model}</h1>`
})

