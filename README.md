# flea

Flea is a JavaScript UI library based in [Snabbdom] and ES6 tagged template literals with [Hyperx].

```js
import { app, html } from "flea"

app({
    model: 0,
    update: {
        add: model => model + 1,
        sub: model => model - 1
    },
    view: (model, msg) => html`
        <div>
            <button onclick=${msg.add}>+</button>
            <h1>${model}</h1>
            <button onclick=${msg.sub} disabled=${model === 0}>–</button>
        </div>`
})
```

[Snabbdom]: https://github.com/snabbdom/snabbdom
[Hyperx]: https://github.com/substack/hyperx