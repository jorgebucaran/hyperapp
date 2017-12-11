import { h, app } from "../src"

const mockDelay = () => new Promise(resolve => setTimeout(resolve, 50))

beforeEach(() => {
  document.body.innerHTML = ""
})

test("sync updates", done => {
  const model = {
    value: 1,
    up: () => store => ({ value: store.value + 1 })
  }

  const view = store =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>2</div>`)
          done()
        }
      },
      store.value
    )

  const store = app(model, view)

  store.up()
})

test("async updates", done => {
  const model = {
    value: 2,
    up: data => store => ({ value: store.value + data }),
    upAsync: data => store => mockDelay().then(() => store.up(data))
  }
  const view = store =>
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
      store.value
    )

  const store = app(model, view)

  store.upAsync(1)
})
