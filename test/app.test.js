import { h, app } from "../src"
import { callbackify } from "util"

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

test("returning null from a component", done => {
  const NullComponent = () => null

  const view = () => (
    <div
      oncreate={() => {
        expect(document.body.innerHTML).toBe("<div></div>")
        done()
      }}
    >
      <NullComponent />
    </div>
  )

  app(null, null, view, document.body)
})

test("returning null from a lazy component", done => {
  const NullComponent = () => () => null

  const view = () => (
    <div
      oncreate={() => {
        expect(document.body.innerHTML).toBe("<div></div>")
        done()
      }}
    >
      <NullComponent />
    </div>
  )

  app(null, null, view, document.body)
})

test("a top level view can return null", done => {
  app(null, null, () => null, document.body)
  setTimeout(() => {
    expect(document.body.innerHTML).toBe("")
    done()
  }, 100)
})

test("a lazy component can return an array", function(done) {
  var Component = function() {
    return function() {
      return [<p />]
    }
  }
  app(
    null,
    null,
    function() {
      return (
        <div
          oncreate={function() {
            expect(document.body.innerHTML).toBe("<div><p></p></div>")
            done()
          }}
        >
          <Component />
        </div>
      )
    },
    document.body
  )
})
