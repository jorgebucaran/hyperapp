import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

const getElementByTagName = tag => document.getElementsByTagName(tag)[0]

beforeEach(() => (document.body.innerHTML = ""))

test("oncreate", done => {
  app({
    view: () =>
      h("div", {
        oncreate: element => {
          setTimeout(() => {})

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

test("fire onrender each render with oldData", () => {
  return new Promise((resolve, reject) => {

    const dataA = {foo: "bar"}

    const dataB = {
      onrender: (el, oldData) => {
        if (oldData && oldData.foo && oldData.foo === dataA.foo) {
          resolve()
        } else {
          reject()
        }
      }
    }

    app({
      state: true,
      actions: {
        change: () => false
      },
      events: {
        loaded: (state, actions) => {
          actions.change()
        }
      },
      view: state => h("div", (state ? dataA : dataB))
    })
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
