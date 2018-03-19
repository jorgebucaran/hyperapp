import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("debouncing", done => {
  const state = { value: 1 }

  const actions = {
    up: () => state => ({ value: state.value + 1 }),
    fire: () => (state, actions) => {
      actions.up()
      actions.up()
      actions.up()
      actions.up()
    }
  }

  const view = state => (
    <div
      oncreate={() => {
        expect(document.body.innerHTML).toBe("<div>5</div>")
        done()
      }}
    >
      {state.value}
    </div>
  )

  app(state, actions, view, document.body).fire()
})

test("subviews / lazy components", done => {
  const state = { value: "foo" }

  const actions = {
    update: () => ({ value: "bar" })
  }

  const Component = () => (state, actions) => (
    <div
      oncreate={() => {
        expect(document.body.innerHTML).toBe("<div>foo</div>")
        actions.update()
      }}
      onupdate={() => {
        expect(document.body.innerHTML).toBe("<div>bar</div>")
        done()
      }}
    >
      {state.value}
    </div>
  )

  app(state, actions, <Component />, document.body)
})

test("actions in the view", done => {
  const state = { value: 0 }

  const actions = {
    up: () => state => ({ value: state.value + 1 })
  }

  const view = (state, actions) => {
    if (state.value < 1) {
      return actions.up()
    }

    setTimeout(() => {
      expect(document.body.innerHTML).toBe("<div>1</div>")
      done()
    })

    return <div>{state.value}</div>
  }

  app(state, actions, view, document.body)
})

test("returning null on a component", done => {
  const oncreate = () => {
    expect(document.body.innerHTML).toBe("<div></div>")
    done()
  }

  const NullComponent = () => null;
  const view = () => (
    <div oncreate={oncreate}>
      <NullComponent />
    </div>
  )

  app(null, null, view, document.body)
})

test("returning null on a lazy component", done => {
  const oncreate = () => {
    expect(document.body.innerHTML).toBe("<div></div>")
    done()
  }

  const NullComponent = () => () => null;
  const view = () => (
    <div oncreate={oncreate}>
      <NullComponent />
    </div>
  )

  app(null, null, view, document.body)
})
