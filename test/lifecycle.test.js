import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

const getElementByTagName = tag => document.getElementsByTagName(tag)[0]

beforeEach(() => (document.body.innerHTML = ""))

test("oncreate", done => {
  app({
    view: () =>
      h("div", {
        oncreate: elm => {
          setTimeout(() => {})

          expect(elm).not.toBe(undefined)
          expect(getElementByTagName("div")).toBe(undefined)

          setTimeout(() => {
            expect(getElementByTagName("div")).toBe(elm)
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
        oninsert: elm => {
          expect(getElementByTagName("div")).toBe(elm)
          done()
        }
      })
  })
})

test("onupdate", done => {
  const mock = jest.fn()
  app({
    state: 1,
    view: state =>
      h("div", { onupdate: mock },
        h("div", {
          class: state,
          onupdate: element => {
            expect(mock).not.toHaveBeenCalled()
            expect(state).toBe(2)
            done()
          }
        })
      ),
    actions: {
      add: state => state + 1
    },
    events: {
      loaded: (state, actions) => actions.add()
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
      loaded: (state, actions) => actions.toggle()
    }
  })
})
