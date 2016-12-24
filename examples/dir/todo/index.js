import { app, html } from "flea"

const FilterInfo = { All: 0, Todo: 1, Done: 2 }

const model = {
    todos: [],
    filter: FilterInfo.All,
    input: "",
    placeholder: "Add new todo!"
}

const view = (model, msg) => {
    return html`
        <div>
            <h1>Todo</h1>
            <p>
                Show: ${
                Object.keys(FilterInfo)
                    .filter(key => FilterInfo[key] !== model.filter)
                    .map(key => html`
                        <span><a href="#" onclick=${_ => msg.filter({
                            value: FilterInfo[key]
                        })}>${key}</a> </span>
                    `)}
            </p>

            <p><ul>
                ${model.todos
                    .filter(t =>
                        model.filter === FilterInfo.Done
                            ? t.done :
                        model.filter === FilterInfo.Todo
                            ? !t.done :
                        model.filter === FilterInfo.All)
                    .map(t => html`
                        <li style=${{
                                color: t.done ? "gray" : "black",
                                textDecoration: t.done ? "line-through" : "none"
                            }}
                            onclick=${e => msg.toggle({
                                value: t.done,
                                id: t.id
                            })}>${t.value}
                        </li>`)}
            </ul></p>

            <p>
                <input
                    type="text"
                    onkeyup=${e => e.keyCode === 13 ? msg.add() : ""}
                    oninput=${e => msg.input({ value: e.target.value })}
                    value=${model.input}
                    placeholder=${model.placeholder}
                />
                <button onclick=${msg.add}>add</button>
            </p>
        </div>`
}

const update = {
    add: model => ({
        ...model,
        input: "",
        todos: model.todos.concat({
            done: false,
            value: model.input,
            id: model.todos.length + 1
        })
    }),
    toggle: (model, { id, value }) => ({
        ...model,
        todos: model.todos.map(t =>
            id === t.id
                ? Object.assign({}, t, { done: !value })
                : t)
    }),
    input: (model, { value }) => ({
        ...model,
        input: value
    }),
    filter: (model, { value }) => ({
        ...model,
        filter: value
    })
}

app(model, view, update)