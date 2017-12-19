import { h, app, ActionsType } from "hyperapp"

/**
 *
 * This files serves 2 purposes:
 * 1. checks that the typings are correct, i.e. this file compiles
 * 2. show a contrieved example of how an app could be written with Hyperapp and Typescript
 *    Note that this app is not functional: it misses e.g. creating, updating or deleting lists and todo items
 *    This is because we did not want to bloat this file too much
 *
 * This fictional app displays a list of Todo lists (like Trello would do) that it fetches from a server.
 * The code is divided in 3 parts:
 * 1. Todos namespace contains state, actions and components that deal with Todo items
 * 2. TodoLists namespace contains state, actions and components that deals with lists of Todo items
 * 3. the application (not contained in any namespace) shows how to wire it all together
 *
 */

/**
 * This namespace contains state, actions and components that deals with single Todo items.
 */
namespace Todos {
  export interface Todo {
    id: string
    listId: string
    text: string
    done: boolean
  }

  export interface State {
    store: Todo[]
  }

  export interface CreatePayload {
    text: string
    listId: string
  }

  // for brievty's sake, let's only add stuff, you can easily infer the other CRUD operations.
  export interface Actions {
    // store operations
    addToStore(todos: Todo[]): void
    // async operations
    fetchAll(listId: string): Promise<Todo[]>
    create(payload: CreatePayload): Promise<Todo>
  }

  export const state: State = {
    store: []
  }

  export const actions: ActionsType<State, Actions> = {
    // store operations
    addToStore: todos => state => ({ store: state.store.concat(todos) }),
    // async operations
    fetchAll: listId => (state, actions) => {
      return fetch("http://example.com/todos?list=" + listId)
        .then(response => response.json())
        .then(todos => {
          actions.addToStore(todos)
          return todos
        })
    },
    create: ({ text, listId }) => (state, actions) => {
      // let's assume it's a GET, for brievty's sake...
      return fetch(
        "http://example.com/todos/create?text=" + text + "&listId=" + listId
      )
        .then(response => response.json())
        .then(id => {
          const todo = { text, listId, id, done: false }
          actions.addToStore([todo])
          return todo
        })
    }
  }

  export const Todo = (todo: Todo) => {
    return <ul class={todo.done ? "crossed" : ""}>{todo.text}</ul>
  }
}

/**
 * This namespace contains state, actions and components that deals with lists of Todo items.
 */
namespace TodoLists {
  export interface List {
    id: string
    name: string
  }

  export interface State {
    todos: Todos.State
    store: List[]
  }

  export interface Actions {
    // sub-modules
    todos: Todos.Actions
    // store operations
    addToStore(lists: List[]): void
    // async operations
    fetchAll(): Promise<void>
  }

  export const state = {
    todos: Todos.state,
    store: []
  }

  interface FetchList extends List {
    todos: Todos.Todo[]
  }

  export const actions: ActionsType<State, Actions> = {
    // sub-modules
    todos: Todos.actions,
    // store operations
    addToStore: lists => state => ({ store: state.store.concat(lists) }),
    // async operations
    fetchAll: () => (state, actions) => {
      return fetch("http://example.com/todosLists")
        .then(response => response.json())
        .then((lists: FetchList[]) => {
          // add the lists
          actions.addToStore(lists.map(l => ({ id: l.id, name: l.name })))
          // add the todos
          lists.forEach(list => {
            actions.todos.addToStore(list.todos)
          })
        })
    }
  }

  interface TodoListProps {
    list: List
    todos: Todos.Todo[]
  }

  const TodoList = (props: TodoListProps) => {
    return (
      <div>
        <h2>{props.list.name}</h2>
        <ul>{props.todos.map(Todos.Todo)}</ul>
      </div>
    )
  }

  export interface AllListsProps {
    state: State
  }

  export const AllLists = ({ state }: AllListsProps) => {
    return (
      <div>
        {state.store.map(list => {
          return (
            <TodoList
              list={list}
              todos={state.todos.store.filter(item => item.listId === list.id)}
            />
          )
        })}
      </div>
    )
  }
}

/**
 * The rest of the file contains application level code
 */

enum InitState {
  NOT_STARTED,
  WORKING,
  SUCCESS,
  FAILURE
}

interface State {
  lists: TodoLists.State
  init: InitState
  error?: string
}

interface SetStatePayload {
  init: InitState
  error?: string
}

interface Actions {
  // sub-modules
  lists: TodoLists.Actions
  // sync operations
  setState(payload: SetStatePayload): void
  // async operations
  init(): void
}

const state: State = {
  lists: TodoLists.state,
  init: InitState.NOT_STARTED
}

const actions: ActionsType<State, Actions> = {
  // sub-modules
  lists: TodoLists.actions,
  // sync operations
  setState: ({ init, error }) => state => ({ init, error }),
  // async operations
  init: () => (state, actions) => {
    actions.setState({ init: InitState.WORKING })
    actions.lists
      .fetchAll()
      .then(() => {
        actions.setState({ init: InitState.SUCCESS })
      })
      .catch(e => {
        actions.setState({
          init: InitState.FAILURE,
          error: typeof e === "string" ? e : e.message
        })
      })
  }
}

const main = app<State, Actions>(state, actions, (state, actions) => {
  switch (state.init) {
    case InitState.NOT_STARTED:
    case InitState.WORKING:
      return <div>Loading...</div>
    case InitState.FAILURE:
      return <div>Error while fetching lists: {state.error}</div>
    default:
      return (
        <div>
          <h1>Todo lists</h1>
          <div>
            <TodoLists.AllLists state={state.lists} />
          </div>
        </div>
      )
  }
})

main.init()
