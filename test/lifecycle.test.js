import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("oncreate", done => {
  app(
    {},
    {},
    () => (
      <div
        oncreate={element => {
          element.className = "foo"
          expect(document.body.innerHTML).toBe(`<div class="foo">foo</div>`)
          done()
        }}
      >
        foo
      </div>
    ),
    document.body
  )
})

test("onupdate", done => {
  const state = { value: "foo" }
  const actions = {
    setValue: value => ({ value })
  }

  const view = (state, actions) => (
    <div
      class={state.value}
      oncreate={() => {
        actions.setValue("bar")
      }}
      onupdate={(element, oldProps) => {
        expect(element.textContent).toBe("bar")
        expect(oldProps.class).toBe("foo")
        done()
      }}
    >
      {state.value}
    </div>
  )

  app(state, actions, view, document.body)
})

test("onremove", done => {
  const state = {
    value: true
  }

  const actions = {
    toggle: () => state => ({ value: !state.value })
  }

  const view = (state, actions) =>
    state.value ? (
      <ul
        oncreate={() => {
          expect(document.body.innerHTML).toBe("<ul><li></li><li></li></ul>")
          actions.toggle()
        }}
      >
        <li />
        <li
          onremove={(element, remove) => {
            remove()
            expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
            done()
          }}
        />
      </ul>
    ) : (
      <ul>
        <li />
      </ul>
    )

  app(state, actions, view, document.body)
})

test("ondestroy", done => {
  let removed = false

  const state = {
    value: true
  }

  const actions = {
    toggle: () => state => ({ value: !state.value })
  }

  const view = (state, actions) =>
    state.value ? (
      <ul
        oncreate={() => {
          actions.toggle()
        }}
      >
        <li />
        <li>
          <span
            ondestroy={() => {
              expect(removed).toBe(false)
              done()
            }}
          />
        </li>
      </ul>
    ) : (
      <ul>
        <li />
      </ul>
    )

  app(state, actions, view, document.body)
})

test("onremove/ondestroy", done => {
  let detached = false

  const state = {
    value: true
  }

  const actions = {
    toggle: () => state => ({ value: !state.value })
  }

  const view = (state, actions) =>
    state.value ? (
      <ul
        oncreate={() => {
          actions.toggle()
        }}
      >
        <li />
        <li
          ondestroy={() => {
            detached = true
          }}
          onremove={(element, remove) => {
            expect(detached).toBe(false)
            remove()
            expect(detached).toBe(true)
            done()
          }}
        />
      </ul>
    ) : (
      <ul>
        <li />
      </ul>
    )

  app(state, actions, view, document.body)
})

test("event bubbling", done => {
  let count = 0

  const state = {
    value: true
  }

  const actions = {
    toggle: () => state => ({ value: !state.value })
  }

  const view = (state, actions) => (
    <main
      oncreate={() => {
        expect(count++).toBe(3)
        actions.toggle()
      }}
      onupdate={() => {
        expect(count++).toBe(7)
        done()
      }}
    >
      <p
        oncreate={() => {
          expect(count++).toBe(2)
        }}
        onupdate={() => {
          expect(count++).toBe(6)
        }}
      />

      <p
        oncreate={() => {
          expect(count++).toBe(1)
        }}
        onupdate={() => {
          expect(count++).toBe(5)
        }}
      />

      <p
        oncreate={() => {
          expect(count++).toBe(0)
        }}
        onupdate={() => {
          expect(count++).toBe(4)
        }}
      />
    </main>
  )

  app(state, actions, view, document.body)
})
