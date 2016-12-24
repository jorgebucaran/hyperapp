import { app, html } from "flea"

const model = Date.now()

const view = model => html`
    <div>
        <svg viewBox="0 0 100 100" width="300px">
            <circle cx="50" cy="50" r="45" fill="deepskyblue"/>
            <line
                x1="50"
                y1="50"
                x2="${50 + 40 * Math.cos(2 * Math.PI * model / 60000)}"
                y2="${50 + 40 * Math.sin(2 * Math.PI * model / 60000)}"
                stroke="white"/>
        </svg>
    </div>`

const update = {
    tick: _ => Date.now()
}

const subs = [
    ({ tick }) => setInterval(tick, 1000)
]

app(model, view, update, subs)