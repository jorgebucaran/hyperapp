import { h } from "../src"

test("empty vnode", () => {
  const node = h("div")
  expect(node.name).toEqual("div")
  expect(node.props).toEqual({})
  expect(node.children).toEqual([])
})
