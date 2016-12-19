const { html, app } = require("flea")

const FilterInfo = { All: 0, Todo: 1, Done: 2 }

const model = {
    todos: [],
    filter: FilterInfo.All,
    input: "",
    placeholder: "Add new todo"
}

const view = (model, dispatch) => {
    return html`
        <div>
            <h1>Todo</h1>
            <p>
                Show: ${
                Object.keys(FilterInfo)
                    .filter(key => FilterInfo[key] !== model.filter)
                    .map(key => html`
                        <span><a href="#" onclick=${_ => dispatch({
                            type: "FILTER",
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
                                textDecoration: t.done
                                    ? "line-through"
                                    : "none"
                            }}
                            onclick=${e => dispatch({
                                type: "TOGGLE",
                                value: t.done,
                                id: t.id
                            })}>${t.value}
                        </li>`)}
            </ul></p>

            <p>
                <input
                    onkeyup=${ e => e.keyCode === 13
                        ? dispatch({ type: "ADD" })
                        : ""
                    }
                    oninput=${e => dispatch({
                        type: "INPUT",
                        value: e.target.value
                    })}
                    type="text"
                    value=${model.input}
                    placeholder=${model.placeholder}
                />
                <button onclick=${_ => dispatch({ type: "ADD" })}>add</button>
            </p>
        </div>`
}

const update = {
    ADD: model => Object.assign({}, model, {
        input: "", // reset input
        todos: model.todos.concat({
            done: false,
            value: model.input,
            id: model.todos.length + 1
        })
    }),
    TOGGLE: (model, { id, value }) => Object.assign({}, model, {
        todos: model.todos.map(t =>
            id === t.id
                ? Object.assign({}, t, { done: !value })
                : t)
    }),
    INPUT: (model, { value }) => Object.assign({}, model, { input: value }),
    FILTER: (model, { value }) => Object.assign({}, model, { filter: value })
}

app(model, view, update)