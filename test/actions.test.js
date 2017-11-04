import { h, app } from "../src"

const mockDelay = () => new Promise(resolve => setTimeout(resolve, 50))

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("slices", done => {
  const actions = app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(
              `<div>only the baz will do</div>`
            )
            done()
          }
        },
        state.foo.bar.baz
      ),
    state: {
      foo: {
        bar: {
          baz: "minimal baz"
        }
      }
    },
    actions: {
      foo: {
        bar: {
          baz(state, actions) {
            return data => {
              expect(state).toEqual({ baz: "minimal baz" })
              expect(data).toBe("foo.bar.baz")
              return { baz: "only the baz will do" }
            }
          },
          buz(state, actions) {
            return (data1, data2, data3) => {
              expect(data1).toBe("foo")
              expect(data2).toBe("bar")
              expect(data3).toBe("baz")
            }
          }
        }
      },
      fizz: {
        buzz: {
          fizzbuzz: () => ({ fizzbuzz: "fizzbuz" })
        }
      }
    }
  })

  actions.foo.bar.baz("foo.bar.baz")
  actions.foo.bar.buz("foo", "bar", "baz")
  actions.fizz.buzz.fizzbuzz()
})

test("sync updates", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(`<div>2</div>`)
            done()
          }
        },
        state.value
      ),
    state: {
      value: 1
    },
    actions: {
      up(state) {
        return {
          value: state.value + 1
        }
      }
    }
  }).up()
})

test("async updates", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(`<div>2</div>`)
          },
          onupdate() {
            expect(document.body.innerHTML).toBe(`<div>3</div>`)
            done()
          }
        },
        state.value
      ),
    state: {
      value: 2
    },
    actions: {
      up(state, actions) {
        return byNumber => ({
          value: state.value + byNumber
        })
      },
      upAsync(state, actions) {
        return byNumber => {
          mockDelay().then(() => {
            actions.up(byNumber)
          })
        }
      }
    }
  }).upAsync(1)
})

test("thunks", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(`<div>3</div>`)
          },
          onupdate() {
            expect(document.body.innerHTML).toBe(`<div>4</div>`)
            done()
          }
        },
        state.value
      ),
    state: {
      value: 3
    },
    actions: {
      upAsync(state, actions) {
        return data => update => {
          mockDelay().then(() => {
            update({ value: state.value + data })
          })
        }
      }
    }
  }).upAsync(1)
})

test("thunks", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe(`<div>4</div>`)
          },
          onupdate() {
            expect(document.body.innerHTML).toBe(`<div>5</div>`)
            done()
          }
        },
        state.value
      ),
    state: {
      value: 4
    },
    actions: {
      upAsync(state, actions) {
        return data => update => {
          mockDelay().then(() => {
            update(state => ({ value: state.value + data }))
          })
        }
      }
    }
  }).upAsync(1)
})

test("state immutable", done => {
  let initialState
  const up = state => ({ value: state.value + 1 })

  const actions = app({
    state: {
      value: 0,
      module1: { value: 1 },
      module2: { value: 2 }
    },
    init(state) {
      initialState = state
    },
    actions: {
      up,
      get(state) {
        return _ => state
      },
      module1: { up }
    }
  })

  const state1 = actions.up()
  expect(state1.value).toBe(1)
  expect(state1).not.toBe(initialState)
  expect(state1.module1).toBe(initialState.module1)
  expect(state1.module2).toBe(initialState.module2)

  actions.module1.up()
  const state2 = actions.get()
  expect(state2.value).toBe(state1.value)
  expect(state2).not.toBe(state1)
  expect(state2.module1).not.toBe(state1.module1)
  expect(state2.module2).toBe(state1.module2)

  done()
})

test("Allow reuse state", done => {
  app({
    view: state =>
      h(
        "div",
        {
          oncreate() {
            console.log(document.body.innerHTML)
            expect(document.body.innerHTML).toBe(`<div>{"child":{}}</div>`)
            done()
          }
        },
        JSON.stringify(state)
      ),
    state: {},
    actions: {
      recurse(state) {
        return { child: state }
      }
    }
  }).recurse()
})
