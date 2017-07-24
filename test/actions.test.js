import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => (document.body.innerHTML = ""))

test("update the state sync", done => {
  app({
    state: 1,
    view: state => h("div", null, state),
    actions: {
      add: state => state + 1
    },
    events: {
      init: (state, actions) => {
        actions.add()
      },
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<div>2</div>`)
        done()
      }
    }
  })
})

test("update the state async", done => {
  app({
    state: 1,
    view: state => h("div", null, state),
    actions: {
      change: (state, actions, data) => state + data,
      delayAndChange: (state, actions, data) => {
        setTimeout(() => {
          actions.change(data)
          setTimeout(() => {
            expect(document.body.innerHTML).toBe(`<div>${state + data}</div>`)
            done()
          })
        }, 20)
      }
    },
    events: {
      init: (state, actions) => actions.delayAndChange(100)
    }
  })
})

test("update the state async using a promise with handler", done => {
  app({
    state: 1,
    view: state => h("div", {}, state),
    actions: {
      delay: state => new Promise(resolve => setTimeout(() => resolve(), 20)),
      change: (state, actions, data) => state + data,
      delayAndChange: (state, actions, data) => {
        actions.delay().then(() => {
          actions.change(data)
          setTimeout(() => {
            expect(document.body.innerHTML).toBe(`<div>${state + data}</div>`)
            done()
          })
        })
      }
    },
    events: {
      init: (state, actions) => actions.delayAndChange(100)
    }
  })
})

test("update the state async using a thunk", done => {
  app({
    state: 1,
    view: state => h("div", {}, state),
    actions: {
      delay: state => new Promise(resolve => setTimeout(() => resolve(), 20)),
      delayAndChange: (state, actions, data) => (update) => {
        actions.delay().then(() => {
          update(state + data)

          setTimeout(() => {
            expect(document.body.innerHTML).toBe(`<div>${state + data}</div>`)
            done()
          })
        })
      }
    },
    events: {
      init: (state, actions) => actions.delayAndChange(100)
    }
  })
})

test("update the state async using a promise", done => {
  app({
    state: 1,
    view: state => h("div", {}, state),
    actions: {
      delay: state => new Promise(resolve => setTimeout(() => resolve(), 20)),
      delayAndChange: (state, actions, data) => {
        return actions.delay().then(() => {
          return state + data
        })
      }
    },
    events: {
      init: (state, actions) => actions.delayAndChange(100),
      render: () => {
        setTimeout(() => {
          expect(document.body.innerHTML).toBe(`<div>101</div>`)
          done()
        })
      }
    }
  })
})

test("update a state using then sync", done => {
  app({
    state: {
      then: 1
    },
    view: state => h("div", null, state.then),
    actions: {
      add: state => ({ then: state.then + 1 })
    },
    events: {
      init: (state, actions) => {
        actions.add()
      },
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<div>2</div>`)
        done()
      }
    }
  })
})

test("namespaced/nested actions", () => {
  app({
    state: true,
    view: state => "",
    actions: {
      foo: {
        bar: {
          baz: (state, actions, data) => {
            expect(state).toBe(true)
            expect(data).toBe("foo.bar.baz")
          }
        }
      }
    },
    events: {
      init: (state, actions) => actions.foo.bar.baz("foo.bar.baz")
    }
  })
})
