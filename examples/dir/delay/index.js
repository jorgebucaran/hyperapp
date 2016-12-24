import { app, html } from "flea"

const wait = time => new Promise(resolve => setTimeout(_ => resolve(), time))

const model = {
    counter: 0,
    waiting: false
}

const view = (model, { waitThenAdd }) =>
    html`
        <button
            onclick=${waitThenAdd}
            disabled=${model.waiting}>${model.counter}
        </button>`

const update = {
    add: model => ({ ...model, counter: model.counter + 1 }),
    toggle: model => ({ ...model, waiting: !model.waiting})
}

const effects = {
    waitThenAdd: (model, { add, toggle }) => {
        toggle()
        wait(1000).then(add).then(toggle)
    }
}

app({ model, view, update, effects })


