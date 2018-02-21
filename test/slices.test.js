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
  const state = {
    foo: {}
  }

  const actions = {
    foo: {
      bar: {
        baz: {
          foobarbaz: () => ({ value: "foobarbaz" })
        }
      }
    }
  }

  const view = state =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>foobarbaz</div>`)
          done()
        }
      },
      state.foo.bar.baz.value
    )

  const main = app(state, actions, view, document.body)

  main.foo.bar.baz.foobarbaz()
  expect(state).toEqual({ foo: {} })
})

test("non-object slices", () => {
  const state = {
    number: 1,
    string: "foo",
    array: ["a"]
  }

  const actions = {
    number: { add: value => state => state + value },
    string: { add: value => state => state + value },
    array: { add: value => state => state.concat(value) },
    getState: () => state => state
  }

  const main = app(state, actions, () => {})

  expect(main.number.add(-1)).toBe(0)
  expect(main.string.add("bar")).toBe("foobar")
  expect(main.array.add("b")).toEqual(["a", "b"])
  expect(main.getState()).toEqual({
    number: 0,
    string: "foobar",
    array: ["a", "b"]
  })
})
