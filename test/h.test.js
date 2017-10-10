import { h } from "../src"

test("empty vnode", () => {
  expect(h("div")).toEqual({
    type: "div",
    props: {},
    children: []
  })
})

test("vnode with a single child", () => {
  expect(h("div", {}, ["foo"])).toEqual({
    type: "div",
    props: {},
    children: ["foo"]
  })

  expect(h("div", {}, "foo")).toEqual({
    type: "div",
    props: {},
    children: ["foo"]
  })
})

test("positional String/Number children", () => {
  expect(h("div", {}, "foo", "bar", "baz")).toEqual({
    type: "div",
    props: {},
    children: ["foo", "bar", "baz"]
  })

  expect(h("div", {}, 1, "foo", 2, "baz", 3)).toEqual({
    type: "div",
    props: {},
    children: ["1", "foo", "2", "baz", "3"]
  })

  expect(h("div", {}, "foo", h("div", {}, "bar"), "baz", "quux")).toEqual({
    type: "div",
    props: {},
    children: [
      "foo",
      {
        type: "div",
        props: {},
        children: ["bar"]
      },
      "baz",
      "quux"
    ]
  })
})

test("vnode with props", () => {
  const props = {
    id: "foo",
    class: "bar",
    style: {
      color: "red"
    }
  }

  expect(h("div", props, "baz")).toEqual({
    type: "div",
    props,
    children: ["baz"]
  })
})

test("skip null and Boolean children", () => {
  const expected = {
    type: "div",
    props: {},
    children: []
  }

  expect(h("div", {}, true)).toEqual(expected)
  expect(h("div", {}, false)).toEqual(expected)
  expect(h("div", {}, null)).toEqual(expected)
})

test("components", () => {
  const Component = (props, children) => h("div", props, children)

  expect(h(Component, { id: "foo" }, "bar")).toEqual({
    type: "div",
    props: { id: "foo" },
    children: ["bar"]
  })

  expect(h(Component, { id: "foo" }, [h(Component, { id: "bar" })])).toEqual({
    type: "div",
    props: { id: "foo" },
    children: [
      {
        type: "div",
        props: { id: "bar" },
        children: []
      }
    ]
  })
})

test("component with no props adds default props", () => {
  const Component = ({ name = "world" }, children) =>
    h("div", {}, "Hello " + name)

  expect(h(Component)).toEqual({
    type: "div",
    props: {},
    children: ["Hello world"]
  })
})
