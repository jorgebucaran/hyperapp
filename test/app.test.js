import { h, app } from "../src"

window.requestAnimationFrame = setTimeout

test("send messages to app", done => {
  const tellApp = app({
    state: 0,
    view: state => h("div", null, state),
    actions: {
      set: (state, actions, data) => data
    },
    events: {
      set: (state, actions, data) => actions.set(data),
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<div>foo</div>`)
        done()
      }
    }
  })

  tellApp("set", "foo")
})

test("throttled renders", done => {
  app({
    state: 0,
    view: state => h("div", null, state),
    actions: {
      up: state => state + 1,
      fire: (state, actions) => {
        actions.up()
        actions.up()
        actions.up()
      }
    },
    events: {
      init: (state, actions) => actions.fire(),
      render: state => {
        expect(state).toBe(3)
        done()
      }
    }
  })
})

test("hydrate from SSR", done => {
  document.body.innerHTML = `<div id="foo" data-ssr><div id="bar">Baz</div></div>`

  app({
    state: {},
    view: state => h("div", { id: "foo" }, [h("div", { id: "bar" }, ["Baz"])]),
    events: {
      loaded: () => {
        expect(document.body.innerHTML).toBe(
          `<div id="foo"><div id="bar">Baz</div></div>`
        )
        done()
      }
    }
  })
})

test("hydrate with outdated textnode from SSR", done => {
  document.body.innerHTML = `<div id="foo" data-ssr>Foo</div>`

  app({
    view: state => h("div", { id: "foo" }, "Bar"),
    events: {
      loaded: () => {
        expect(document.body.innerHTML).toBe(`<div id="foo">Bar</div>`)
        done()
      }
    }
  })
})

test("hydrate from SSR with a root", done => {
  document.body.innerHTML = `<div id="app"><div id="foo" data-ssr>Foo</div></div>`

  app({
    root: document.getElementById("app"),
    state: {},
    view: state => h("div", { id: "foo" }, ["Foo"]),
    events: {
      loaded: () => {
        expect(document.body.innerHTML).toBe(
          `<div id="app"><div id="foo">Foo</div></div>`
        )
        done()
      }
    }
  })
})

test("svg", done => {
  const SVG_NS = "http://www.w3.org/2000/svg"

  app({
    view: () =>
      h("div", {}, [
        h("p", { id: "foo" }, "foo"),
        h("svg", { id: "bar", viewBox: "0 0 10 10" }, [
          h("quux", {}, [
            h("beep", {}, [h("ping", {}), h("pong", {})]),
            h("bop", {}),
            h("boop", {}, [h("ping", {}), h("pong", {})])
          ]),
          h("xuuq", {}, [
            h("beep", {}),
            h("bop", {}, [h("ping", {}), h("pong", {})]),
            h("boop", {})
          ])
        ]),
        h("p", { id: "baz" }, "baz")
      ]),
    events: {
      loaded: () => {
        expect(document.getElementById("foo").namespaceURI).not.toBe(SVG_NS)
        expect(document.getElementById("baz").namespaceURI).not.toBe(SVG_NS)

        const svg = document.getElementById("bar")
        expect(svg.namespaceURI).toBe(SVG_NS)
        expect(svg.getAttribute("viewBox")).toBe("0 0 10 10")
        expectChildren(svg)

        function expectChildren(svgElement) {
          Array.from(svgElement.childNodes).forEach(node =>
            expectChildren(node, expect(node.namespaceURI).toBe(SVG_NS))
          )
        }
        done()
      }
    }
  })
})
