import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("init", done => {
  app({
    init: (state, actions) => {
      expect(state).toEqual({
        value: 0
      })

      expect(actions.up()).toEqual({
        value: 1
      })

      done()
    },
    state: {
      value: 0
    },
    actions: {
      up: state => ({ value: state.value + 1 })
    }
  })
})
