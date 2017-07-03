import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => (document.body.innerHTML = ""))

test("oncreate", done => {
  app({
    state: 1,
    view: state =>
      h("div", {
        oncreate: e => {
          expect(state).toBe(1)
          done()
        }
      })
  })
})

test("onupdate", done => {
  app({
    state: 1,
    view: state =>
      h("div", {
        onupdate: e => {
          expect(state).toBe(2)
          done()
        }
      }),
    actions: {
      add: state => state + 1
    },
    events: {
      ready: (state, actions) => actions.add()
    }
  })
})

test("onremove", done => {
  app({
    state: true,
    view: state =>
      (state
        ? h("ul", {}, [h("li"), h("li", { onremove: done })])
        : h("ul", {}, [h("li")])),
    actions: {
      toggle: state => !state
    },
    events: {
      ready: (state, actions) => actions.toggle()
    }
  })
})
