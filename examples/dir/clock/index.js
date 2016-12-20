import { app, html } from "flea"

const model = Date.now()

const view = model => {
    const angle = 2 * Math.PI * model / (60 * 1000)

    return html`
        <div>
            <svg viewBox="0 0 250 250" width="300px">
                <circle cx="50" cy="50" r="45" fill="gray"/>
                <line
                    x1="50"
                    y1="50"
                    x2="${50 + 40 * Math.cos(angle)}"
                    y2="${50 + 40 * Math.sin(angle)}"
                    stroke="white"/>
            </svg>
        </div>`
}

const update = {
    TICK: _ => Date.now()
}

const subs = {
    tick: dispatch => setInterval(_ => dispatch("TICK"), 1000)
}

app(model, view, update, subs)