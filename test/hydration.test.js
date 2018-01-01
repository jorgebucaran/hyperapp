import { h, app } from "../src"

const hydrate = element => {
  const hydrateNode = node =>
    node && {
      name: node.nodeName.toLowerCase(),
      props: {},
      children: [...node.childNodes].map(
        child =>
          child.nodeType === Node.TEXT_NODE
            ? child.nodeValue
            : hydrateNode(child)
      )
    }
  return hydrateNode(element.children[0])
}

test("hydration", done => {
  const SSR_BODY = `<div id="app"><main><p>foo</p></main></div>`

  document.body.innerHTML = SSR_BODY

  const view = state =>
    h(
      "main",
      {
        onupdate() {
          expect(document.body.innerHTML).toBe(SSR_BODY)
          done()
        }
      },
      [h("p", {}, "foo")]
    )

  const container = document.getElementById("app")

  const hydrated = hydrate(container)

  app({}, {}, view, container, hydrated)
})
