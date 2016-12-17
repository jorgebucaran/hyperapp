const { html, app } = require("flea")

const FILTER = { All: 0, Active: 1, Completed: 2 }

const model = {
    todos: [],
    text: "",
    filter: {
        values: ["All", "Active", "Completed"],
        selected: 0
    }
}

const update = ({ todos, text, filter }, msg) => {
    switch (msg.type) {
        case "ADD_TODO":
            return {
                todos: todos.concat({
                    id: todos.length + 1,
                    value: text,
                    completed: false
                }),
                text: "",
                filter
            }

        case "TOGGLE_TODO":
            const newTodos = todos.map(t => t.id === msg.id
                ? Object.assign({}, t, { completed: !t.completed })
                : t)

            return {
                todos: newTodos,
                text,
                filter
            }

        case "UPDATE_TEXT":
            return {
                todos,
                text: msg.value,
                filter
            }

        case "UPDATE_FILTER":
            return {
                todos,
                text,
                filter: Object.assign({}, filter, { selected: msg.value })
            }

        default:
            return model
    }
}

const view = (model, dispatch) => {
    const addHandler = e =>
        dispatch({ type: "ADD_TODO" }, model)

    const toggleHandler = id =>
        dispatch({ type: "TOGGLE_TODO", id }, model)

    const editHandler = e =>
        dispatch({ type: "UPDATE_TEXT", value: e.target.value }, model)

    const filterHandler = i =>
        dispatch({ type: "UPDATE_FILTER", value: i }, model)

    const listItem = t => {
        const value = (model.filter.selected === FILTER.Completed && t.completed)
            ? t.value
            : (model.filter.selected === FILTER.Active && !t.completed)
                ? t.value
                : (model.filter.selected === FILTER.All)
                    ? t.value
                    : ""

        if (value === "") return

        return html`
            <li
                style=${{ textDecoration: t.completed ? "line-through" : "none" }}
                onclick=${_ => toggleHandler(t.id)}>${value}</li>
        `
    }

    const filterLink = _ => model.filter.values.map((v, i) =>
        html`
            <span>
                ${(i !== model.filter.selected
                ? html`<a href="#" onclick=${e => filterHandler(i, e.preventDefault())}>${v}</a>`
                : v)}
            </span>
        `)

    return html`
        <div>
            <input onchange=${editHandler} value=${model.text}/>
            <button onclick=${addHandler}>Add</button>
            <ul>
                ${model.todos.map(listItem)}
            </ul>
            ${filterLink()}
        </div>
    `
}

app(model, view, update)