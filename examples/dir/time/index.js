import { app, html } from "flea"

const humanTime = (time, miTime) => {
    const [h, m, s] = [time.getHours(), time.getMinutes(), time.getSeconds()]
    return `${miTime ?
        h : h >= 12 ? h - 12 : h}:${
            m < 10 ? `0${m}` : m}:${
                s < 10 ? `0${s}` : s} ${miTime ? "" : h >= 12 ? "PM" : "AM"}`
}

app({
    model: {
        miTime: false,
        time: new Date()
    },
    view: model => html`<h1>${humanTime(model.time, model.miTime)}</h1>`,
    update: {
        tick: model => ({ ...model, time: new Date() }),
        toggle: model => ({ ...model, miTime: !model.miTime })
    },
    subscriptions: [
        msg => setInterval(msg.tick, 1000),
        msg => addEventListener("click", msg.toggle)
    ]
})



