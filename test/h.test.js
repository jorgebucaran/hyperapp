import { h } from "../src"

test("empty vnode", () => {
  expect(h("div")).toEqual({
    nodeName: "div",
    attributes: {},
    children: []
  })
})

test("vnode with a single child", () => {
  expect(h("div", {}, ["foo"])).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["foo"]
  })

  expect(h("div", {}, "foo")).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["foo"]
  })
})

test("positional String/Number children", () => {
  expect(h("div", {}, "foo", "bar", "baz")).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["foo", "bar", "baz"]
  })

  expect(h("div", {}, 0, "foo", 1, "baz", 2)).toEqual({
    nodeName: "div",
    attributes: {},
    children: [0, "foo", 1, "baz", 2]
  })

  expect(h("div", {}, "foo", h("div", {}, "bar"), "baz", "quux")).toEqual({
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

  expect(h("div", attributes, "baz")).toEqual({
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

  expect(h("div", {}, true)).toEqual(expected)
  expect(h("div", {}, false)).toEqual(expected)
  expect(h("div", {}, null)).toEqual(expected)
})

test("component", () => {
  const Component = () => h("div", {}, ["baz"])

  expect(h(Component, { id: "foo" }, "bar")).toEqual({
    nodeName: Component,
    attributes: { id: "foo" },
    children: ["bar"]
  })
})
