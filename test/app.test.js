import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("debouncing", done => {
  const model = {
    value: 1,
    up: () => store => ({ value: store.value + 1 }),
    fire: () => store => {
      store.up()
      store.up()
      store.up()
      store.up()
    }
  }
  const view = store =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe("<div>5</div>")
          done()
        }
      },
      store.value
    )

  const store = app(model, view)

  store.fire()
})

test("calling actions in the view", done => {
  const model = {
    value: 0,
    up: () => store => ({ value: store.value + 1 })
  }

  const view = store => {
    if (store.value < 1) {
      return store.up()
    }

    setTimeout(() => {
      expect(document.body.innerHTML).toBe("<div>1</div>")
      done()
    })

    return h("div", {}, store.value)
  }

  app(model, view)
})
