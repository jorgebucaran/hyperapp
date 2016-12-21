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
        TICK: model => ({ ...model, time: new Date() }),
        TOGGLE: model => ({ ...model, miTime: !model.miTime })
    },
    subscriptions: [
        dispatch => setInterval(_ => dispatch("TICK"), 1000),
        dispatch => document.addEventListener("click", _ => dispatch("TOGGLE"))
    ]
})



