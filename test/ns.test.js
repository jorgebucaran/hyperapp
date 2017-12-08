import { h, app } from "../src"

const SVG_NS = "http://www.w3.org/2000/svg"
const MATH_NS = "http://www.w3.org/1998/Math/MathML"

const deepExpectNS = (element, ns) =>
  Array.from(element.childNodes).map(child => {
    expect(child.namespaceURI).toBe(ns)
    deepExpectNS(child, ns)
  })

test("svg", done => {
  app({
    view: () =>
      h(
        "div",
        {
          oncreate() {
            const foo = document.getElementById("foo")
            const bar = document.getElementById("bar")
            const mbar = document.getElementById("mbar")
            const odd = document.getElementById("odd")
            const baz = document.getElementById("baz")

            expect(foo.namespaceURI).not.toBe(SVG_NS)
            expect(baz.namespaceURI).not.toBe(SVG_NS)
            expect(bar.namespaceURI).toBe(SVG_NS)
            expect(bar.getAttribute("viewBox")).toBe("0 0 10 10")
            deepExpectNS(bar, SVG_NS)

            expect(mbar.namespaceURI).toBe(MATH_NS)
            deepExpectNS(mbar, MATH_NS)

            expect(odd.namespaceURI).toBe(MATH_NS)
            deepExpectNS(odd, MATH_NS)
            
            done()
          }
        },
        [
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
          h("math", { id: "mbar" }, [
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
          h("mi", { id: "odd", namespace: MATH_NS }, [
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
        ]
      )
  })
})