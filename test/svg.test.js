import { h, app } from "../src"

const SVG_NS = "http://www.w3.org/2000/svg"

const deepExpectNS = (element, ns) =>
  Array.from(element.childNodes).map(child => {
    expect(child.namespaceURI).toBe(ns)
    deepExpectNS(child, ns)
  })

test("svg", done => {
  const view = () => (
    <div
      oncreate={() => {
        const foo = document.getElementById("foo")
        const bar = document.getElementById("bar")
        const baz = document.getElementById("baz")

        expect(foo.namespaceURI).not.toBe(SVG_NS)
        expect(baz.namespaceURI).not.toBe(SVG_NS)
        expect(bar.namespaceURI).toBe(SVG_NS)
        expect(bar.getAttribute("viewBox")).toBe("0 0 10 10")
        deepExpectNS(bar, SVG_NS)

        done()
      }}
    >
      <p id="foo">foo</p>
      <svg id="bar" viewBox="0 0 10 10">
        <foo />
      </svg>
      <p id="baz">baz</p>
    </div>
  )

  app(null, null, view, document.body)
})
