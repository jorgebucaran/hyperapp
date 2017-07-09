import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

test("send messages to app", done => {
  const tellApp = app({
    state: 0,
    view: state => h("div", null, state),
    actions: {
      set: (state, actions, data) => data
    },
    events: {
      set: (state, actions, data) => actions.set(data),
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<div>foo</div>`)
        done()
      }
    }
  })

  tellApp("set", "foo")
})

test("throttled renders", done => {
  app({
    state: 0,
    view: state => h("div", null, state),
    actions: {
      up: state => state + 1,
      fire: (state, actions) => {
        actions.up()
        actions.up()
        actions.up()
      }
    },
    events: {
      init: (state, actions) => actions.fire(),
      render: state => {
        expect(state).toBe(3)
        done()
      }
    }
  })
})
