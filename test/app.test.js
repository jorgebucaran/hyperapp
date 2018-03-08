import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("debouncing", done => {
  const state = { value: 1 }

  const actions = {
    up: () => state => ({ value: state.value + 1 }),
    fire: () => (state, actions) => {
      actions.up()
      actions.up()
      actions.up()
      actions.up()
    }
  }

  const view = state => (
    <div
      oncreate={() => {
        expect(document.body.innerHTML).toBe("<div>5</div>")
        done()
      }}
    >
      {state.value}
    </div>
  )

  app(state, actions, view, document.body).fire()
})

test("subviews / lazy components", done => {
  const state = { value: "foo" }
  const actions = {
    update: () => ({ value: "bar" })
  }

  const Component = () => (state, actions) => (
    <div
      oncreate={() => {
        expect(document.body.innerHTML).toBe("<div>foo</div>")
        actions.update()
      }}
      onupdate={() => {
        expect(document.body.innerHTML).toBe("<div>bar</div>")
        done()
      }}
    >
      {state.value}
    </div>
  )

  app(state, actions, <Component />, document.body)
})
