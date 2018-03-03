import { createNode } from "../src"

test("empty vnode", () => {
  expect(createNode("div")).toEqual({
    nodeName: "div",
    attributes: {},
    children: []
  })
})

test("vnode with a single child", () => {
  expect(createNode("div", {}, ["foo"])).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["foo"]
  })

  expect(createNode("div", {}, "foo")).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["foo"]
  })
})

test("positional String/Number children", () => {
  expect(createNode("div", {}, "foo", "bar", "baz")).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["foo", "bar", "baz"]
  })

  expect(createNode("div", {}, 0, "foo", 1, "baz", 2)).toEqual({
    nodeName: "div",
    attributes: {},
    children: [0, "foo", 1, "baz", 2]
  })

  expect(
    createNode("div", {}, "foo", createNode("div", {}, "bar"), "baz", "quux")
  ).toEqual({
    nodeName: "div",
    attributes: {},
    children: [
      "foo",
      {
        nodeName: "div",
        attributes: {},
        children: ["bar"]
      },
      "baz",
      "quux"
    ]
  })
})

test("vnode with attributes", () => {
  const attributes = {
    id: "foo",
    class: "bar",
    style: {
      color: "red"
    }
  }

  expect(createNode("div", attributes, "baz")).toEqual({
    nodeName: "div",
    attributes,
    children: ["baz"]
  })
})

test("skip null and Boolean children", () => {
  const expected = {
    nodeName: "div",
    attributes: {},
    children: []
  }

  expect(createNode("div", {}, true)).toEqual(expected)
  expect(createNode("div", {}, false)).toEqual(expected)
  expect(createNode("div", {}, null)).toEqual(expected)
})

test("nodeName as a function (JSX components)", () => {
  const Component = (props, children) => createNode("div", props, children)

  expect(createNode(Component, { id: "foo" }, "bar")).toEqual({
    nodeName: "div",
    attributes: { id: "foo" },
    children: ["bar"]
  })

  expect(
    createNode(Component, { id: "foo" }, [createNode(Component, { id: "bar" })])
  ).toEqual({
    nodeName: "div",
    attributes: { id: "foo" },
    children: [
      {
        nodeName: "div",
        attributes: { id: "bar" },
        children: []
      }
    ]
  })
})
