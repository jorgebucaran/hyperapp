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

test("fire onupdate if node data changes", done => {
  app({
    state: "foo",
    view: state =>
      h("div", {
        class: state,
        onupdate: done
      }),
    actions: {
      change: state => "bar"
    },
    events: {
      loaded: (state, actions) => {
        actions.change()
      }
    }
  })
})

test("do not fire onupdate if data does not change", () => {
  return new Promise((resolve, reject) => {
    app({
      state: "foo",
      view: state =>
        h("div", {
          class: state,
          onupdate: reject
        }),
      actions: {
        change: state => "foo"
      },
      events: {
        loaded: (state, actions) => {
          actions.change()
          setTimeout(resolve, 100)
        }
      }
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
