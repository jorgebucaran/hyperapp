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
  const noop = () => {}

  return new Promise((resolve, reject) => {
    app({
      state: "foo",
      view: state =>
        h("div", {
          class: state,
          oncreate: noop,
          onupdate: reject,
          oninsert: noop,
          onremove: noop
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

test("onmove called when siblings moved", done => {
  const called = {}
  const handler = key => { called[key] = true }
  app({
    state: {
      nodes: ["a", "b", "c", "d", "e", "f"]
    },
    actions: {
      shuffle: state => {
        state.nodes = ["a", "b", "e", "d", "c", "f"]
        return state
      }
    },
    events: {
      loaded: (state, actions) => actions.shuffle(),
      render: (state, actions) => {
        setTimeout(_ => {
          if (called.c && called.d && called.e && called.f) done()
        }, 0)
      }
    },
    view: state =>
      h('div', {}, state.nodes.map(key =>
        h('div', { key, onmove: el => handler(key) })
      ))
  })
})

test("onmove called when siblings removed", done => {
  const called = {}
  const handler = key => { called[key] = true }
  app({
    state: {
      nodes: ["a", "b", "c", "d"]
    },
    actions: {
      shuffle: state => {
        state.nodes = ["a", "c", "d"]
        return state
      }
    },
    events: {
      loaded: (state, actions) => actions.shuffle(),
      render: (state, actions) => {
        setTimeout(_ => {
          if (called.c && called.d) done()
        }, 0)
      }
    },
    view: state =>
      h('div', {}, state.nodes.map(key =>
        h('div', { key, onmove: el => handler(key) })
      ))
  })
})

test("onmove called when siblings inserted", done => {
  const called = {}
  const handler = key => { called[key] = true }
  app({
    state: {
      nodes: ["a", "c", "d"]
    },
    actions: {
      shuffle: state => {
        state.nodes = ["a", "b", "c", "d"]
        return state
      }
    },
    events: {
      loaded: (state, actions) => actions.shuffle(),
      render: (state, actions) => {
        setTimeout(_ => {
          if (called.c && called.d) done()
        }, 0)
      }
    },
    view: state =>
      h('div', {}, state.nodes.map(key =>
        h('div', { key, onmove: el => handler(key) })
      ))
  })
})
