import { h, app } from "../src"

window.requestAnimationFrame = f => f()

beforeEach(() => (document.body.innerHTML = ""))

const delay = () => new Promise(resolve => setTimeout(() => resolve(), 50))

test("namespaced/nested actions", () => {
  app({
    view: state => "",
    actions: {
      foo: {
        bar: {
          baz(state, actions, data) {
            expect(data).toBe("foo.bar.baz")
          }
        }
      }
    },
    events: {
      load(state, actions) {
        actions.foo.bar.baz("foo.bar.baz")
      }
    }
  })
})

test("update the state sync", () => {
  app({
    view: state => h("div", {}, state),
    state: 1,
    actions: {
      up: state => state + 1
    },
    events: {
      load(state, actions) {
        actions.up()
        expect(document.body.innerHTML).toBe(`<div>2</div>`)
      }
    }
  })
})

test("update the state async", done => {
  app({
    view: state => h("div", null, state),
    state: 2,
    actions: {
      up: (state, actions, data) => state + data,
      upAsync: (state, actions, data) => {
        delay().then(() => {
          actions.up(data)
          expect(document.body.innerHTML).toBe(`<div>3</div>`)
          done()
        })
      }
    },
    events: {
      load(state, actions) {
        actions.upAsync(1)
      }
    }
  })
})

test("update the state async using a thunk", done => {
  app({
    view: state => h("div", {}, state),
    state: 3,
    actions: {
      upAsync(state, actions, data) {
        return update => {
          delay().then(() => {
            update(state + data)

            expect(document.body.innerHTML).toBe(`<div>4</div>`)
            done()
          })
        }
      }
    },
    events: {
      load(state, actions) {
        actions.upAsync(1)
      }
    }
  })
})

test("update the state async using a thunkified promise", done => {
  function mockUpdate(cb) {
    return data => {
      cb(data)

      expect(document.body.innerHTML).toBe(`<div>6</div>`)
      done()
    }
  }

  app({
    state: 5,
    view: state => h("div", {}, state),
    actions: {
      upAsync(state, actions, data) {
        return delay().then(() => state + data)
      }
    },
    events: {
      load(state, actions) {
        actions.upAsync(1)
      },
      resolve(state, actions, data) {
        return data && typeof data.then === "function"
          ? update => data.then(mockUpdate(update))
          : data
      }
    }
  })
})
