import { app, html } from "flea"

const angle = t => 2 * Math.PI * t / 60000

app({
    model: Date.now(),
    view: model => html`
    <div>
        <svg viewBox="0 0 100 100" width="300px">
            <circle cx="50" cy="50" r="45" fill="deepskyblue"/>
            <line
                x1="50"
                y1="50"
                x2="${50 + 40 * Math.cos(angle(model))}"
                y2="${50 + 40 * Math.sin(angle(model))}"
                stroke="white"/>
        </svg>
    </div>`,
    update: {
        tick: _ => Date.now()
    },
    subs: [
        msg => setInterval(msg.tick, 1000)
    ]
})