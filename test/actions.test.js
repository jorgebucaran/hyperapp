import { h, app } from "../src"

const mockDelay = () => new Promise(resolve => setTimeout(resolve, 50))

beforeEach(() => {
  document.body.innerHTML = ""
})

test("sync updates", done => {
  app({
    state: {
      value: 1
    },
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(`<div>2</div>`)
            done()
          }
        },
        state.value
      ),
    actions: {
      up: state => ({ value: state.value + 1 })
    }
  }).up()
})

test("async updates", done => {
  app({
    state: {
      value: 2
    },
    view: state =>
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
      ),
    actions: {
      up: state => data => ({ value: state.value + data }),
      upAsync: (state, actions) => data =>
        mockDelay().then(() => actions.up(data))
    }
  }).upAsync(1)
})
