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
          baz(state, actions, data) {
            expect(state).toEqual({ baz: "minimal baz" })
            expect(data).toBe("foo.bar.baz")
            return { baz: "only the baz will do" }
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
      up(state, actions, byNumber) {
        return {
          value: state.value + byNumber
        }
      },
      upAsync(state, actions, byNumber) {
        mockDelay().then(() => {
          actions.up(byNumber)
        })
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
      upAsync(state, actions, data) {
        return update => {
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
      upAsync(state, actions, data) {
        return update => {
          mockDelay().then(() => {
            update(state => ({ value: state.value + data }))
          })
        }
      }
    }
  }).upAsync(1)
})
