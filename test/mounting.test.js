import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("headless", done => {
  app({}, {}, () => done())
})

test("container", done => {
  document.body.innerHTML = "<main></main>"
  app(
    {},
    {},
    () => (
      <div
        oncreate={() => {
          expect(document.body.innerHTML).toBe("<main><div>foo</div></main>")
          done()
        }}
      >
        foo
      </div>
    ),
    document.body.firstChild
  )
})

test("nested container", done => {
  document.body.innerHTML = "<main><section></section><div></div></main>"
  app(
    {},
    {},
    () => (
      <p
        oncreate={() => {
          expect(document.body.innerHTML).toBe(
            `<main><section></section><div><p>foo</p></div></main>`
          )
          done()
        }}
      >
        foo
      </p>
    ),
    document.body.firstChild.lastChild
  )
})

test("container with mutated host", done => {
  document.body.innerHTML = "<main><div></div></main>"

  const host = document.body.firstChild
  const container = host.firstChild

  const state = {
    value: "foo"
  }

  const actions = {
    bar: () => ({ value: "bar" })
  }

  const view = (state, actions) => (
    <p
      oncreate={() => {
        expect(document.body.innerHTML).toBe(
          `<main><div><p>foo</p></div></main>`
        )
        host.insertBefore(document.createElement("header"), host.firstChild)
        host.appendChild(document.createElement("footer"))

        actions.bar()
      }}
      onupdate={() => {
        expect(document.body.innerHTML).toBe(
          `<main><header></header><div><p>bar</p></div><footer></footer></main>`
        )
        done()
      }}
    >
      {state.value}
    </p>
  )

  app(state, actions, view, container)
})
