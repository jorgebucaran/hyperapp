import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("slices", done => {
  const bar = {
    state: {
      value: true
    },
    actions: {
      change: () => state => ({ value: !state.value })
    }
  }

  const foo = {
    state: {
      value: true,
      bar: bar.state
    },
    actions: {
      up: () => state => ({ value: !state.value }),
      bar: bar.actions
    }
  }

  const state = {
    foo: foo.state
  }

  const actions = {
    foo: foo.actions,
    getState: () => state => state
  }

  const main = app(state, actions, () => {})

  expect(main.getState()).toEqual({
    foo: {
      value: true,
      bar: {
        value: true
      }
    }
  })

  expect(main.foo.up()).toEqual({ value: false })
  expect(main.foo.bar.change()).toEqual({ value: false })

  done()
})

test("state/actions tree", done => {
  const actions = {
    fizz: {
      buzz: {
        fizzbuzz: () => ({ value: "fizzbuzz" })
      }
    }
  }

  const view = state =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>fizzbuzz</div>`)
          done()
        }
      },
      state.fizz.buzz.value
    )

  const main = app({}, actions, view, document.body)

  main.fizz.buzz.fizzbuzz()
})


test("array slices", done => {
  const state = {
    counts: [0, 0]
  }

  const actions = {
    counts: {
      up: (i) => state => ({ [i]: state[i] + 1 }),
      add: (v) => state => ([...state, v])
    }
  }

  const view = state =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>0-1-0</div>`)
          done()
        }
      },
      state.counts.join("-")
    )

  const main = app(state, actions, view, document.body)

  main.counts.add(0)
  main.counts.up(1)
})

test("array slices/actions", done => {
  const state = {
    counts: [{
      count: 0
    }]
  }

  const actions = {
    counts: [{
      up: () => state => ({ count: state.count + 1 })
    }]
  }

  const view = state =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>1</div>`)
          done()
        }
      },
      state.counts[0].count
    )

  const main = app(state, actions, view, document.body)

  main.counts[0].up()
})