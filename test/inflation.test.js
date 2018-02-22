import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("inflation of connected components", done => {
  const state = {
    value: 1
  }

  const actions = {}

  const view = state =>
    h("a", {}, (state, actions) =>
      h("b", {}, [
        state.value,
        (state, actions) =>
          h(
            "c",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe("<a><b>1<c>1</c></b></a>")
                done()
              }
            },
            state.value
          )
      ])
    )

  app(state, actions, view, document.body)
})
