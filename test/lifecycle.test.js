import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => document.body.innerHTML = "")

test("onCreate", done => {
  app({
    state: 1,
    view: state =>
      h("div", {
        onCreate: e => {
          expect(state).toBe(1)
          done()
        }
      })
  })
})

test("onUpdate", done => {
  app({
    state: 1,
    view: state =>
      h("div", {
        onUpdate: e => {
          expect(state).toBe(2)
          done()
        }
      }),
    actions: {
      add: state => state + 1
    },
    events: {
      loaded: (state, actions) => actions.add()
    }
  })
})

test("onRemove", done => {
  app({
    state: true,
    view: state =>
      (state
        ? h("ul", {}, [h("li"), h("li", { onRemove: done })])
        : h("ul", {}, [h("li")])),
    actions: {
      toggle: state => !state
    },
    events: {
      loaded: (state, actions) => actions.toggle()
    }
  })
})
