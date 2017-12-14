import { h, app } from "../src"

const mockDelay = () => new Promise(resolve => setTimeout(resolve, 50))

beforeEach(() => {
  document.body.innerHTML = ""
})

test("sync updates", done => {
  const model = {
    state: {
      value: 1
    },
    actions: {
      up: () => state => ({ value: state.value + 1 })
    }
  }

  const view = ({ state }) =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>2</div>`)
          done()
        }
      },
      state.value
    )

  const { actions } = app(model, view, document.body)

  actions.up()
})

test("async updates", done => {
  const model = {
    state: {
      value: 2
    },
    actions: {
      up: data => state => ({ value: state.value + data }),
      upAsync: data => (state, actions) =>
        mockDelay().then(() => actions.up(data))
    }
  }

  const view = ({ state }) =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>2</div>`)
        },
        onupdate() {
          expect(document.body.innerHTML).toBe(`<div>3</div>`)
          done()
        }
      },
      state.value
    )

  const { actions } = app(model, view, document.body)

  actions.upAsync(1)
})
