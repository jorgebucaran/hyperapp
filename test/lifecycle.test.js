import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => (document.body.innerHTML = ""))

const getElementByTagName = tag => document.getElementsByTagName(tag)[0]

test("oncreate", done => {
  app({
    view: () =>
      h("div", {
        oncreate: element => {
          expect(element).not.toBe(undefined)
          expect(getElementByTagName("div")).toBe(undefined)

          setTimeout(() => {
            expect(getElementByTagName("div")).toBe(element)
            done()
          })
        }
      })
  })
})

test("oninsert", done => {
  app({
    view: () =>
      h("div", {
        oninsert: element => {
          expect(getElementByTagName("div")).toBe(element)
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
        onupdate: element => {
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
      state
        ? h("ul", {}, [h("li"), h("li", { onremove: done })])
        : h("ul", {}, [h("li")]),
    actions: {
      toggle: state => !state
    },
    events: {
      ready: (state, actions) => actions.toggle()
    }
  })
})
