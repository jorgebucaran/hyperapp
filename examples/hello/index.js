const { app, html } = require("flea")

const model = "hello, world"
const view = model => html`<h1>${model}</h1>`

app(model, view)