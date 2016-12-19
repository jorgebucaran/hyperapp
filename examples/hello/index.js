const { app, html } = require("flea")

app("Hello!", model => html`<h1>${model}</h1>`)