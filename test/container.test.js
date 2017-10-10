import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

beforeEach(() => {
  document.body.innerHTML = ""
})

test("container", done => {
  document.body.innerHTML = "<main></main>"
  app(
    {
      view: state =>
        h(
          "div",
          {
            oncreate() {
              expect(document.body.innerHTML).toBe("<main><div>foo</div></main>")
              done()
            }
          },
          "foo"
        )
    },
    document.body.firstChild
  )
})

test("nested container", done => {
  document.body.innerHTML = "<main><section></section><div></div></main>"

  app(
    {
      view: state =>
        h(
          "p",
          {
            oncreate() {
              expect(document.body.innerHTML).toBe(
                `<main><section></section><div><p>foo</p></div></main>`
              )
              done()
            }
          },
          "foo"
        )
    },
    document.body.firstChild.lastChild
  )
})

test("container with mutated host", done => {
  document.body.innerHTML = "<main><div></div></main>"

  const host = document.body.firstChild
  const container = host.firstChild

  app(
    {
      view: (state, actions) =>
        h(
          "p",
          {
            oncreate() {
              expect(document.body.innerHTML).toBe(
                `<main><div><p>foo</p></div></main>`
              )

              host.insertBefore(
                document.createElement("header"),
                host.firstChild
              )
              host.appendChild(document.createElement("footer"))

              actions.bar()
            },
            onupdate() {
              expect(document.body.innerHTML).toBe(
                `<main><header></header><div><p>bar</p></div><footer></footer></main>`
              )
              done()
            }
          },
          state.value
        ),
      state: {
        value: "foo"
      },
      actions: {
        bar(state) {
          return {
            value: "bar"
          }
        }
      }
    },
    container
  )
})
