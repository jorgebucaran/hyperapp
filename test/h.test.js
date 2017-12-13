import { h } from "../src"

test("empty vnode", () => {
  expect(h("div")).toEqual({
    tag: "div",
    props: {},
    children: []
  })
})

test("vnode with a single child", () => {
  expect(h("div", {}, ["foo"])).toEqual({
    tag: "div",
    props: {},
    children: ["foo"]
  })

  expect(h("div", {}, "foo")).toEqual({
    tag: "div",
    props: {},
    children: ["foo"]
  })
})

test("positional String/Number children", () => {
  expect(h("div", {}, "foo", "bar", "baz")).toEqual({
    tag: "div",
    props: {},
    children: ["foo", "bar", "baz"]
  })

  expect(h("div", {}, 1, "foo", 2, "baz", 3)).toEqual({
    tag: "div",
    props: {},
    children: ["1", "foo", "2", "baz", "3"]
  })

  expect(h("div", {}, "foo", h("div", {}, "bar"), "baz", "quux")).toEqual({
    tag: "div",
    props: {},
    children: [
      "foo",
      {
        tag: "div",
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
    tag: "div",
    props,
    children: ["baz"]
  })
})

test("skip null and Boolean children", () => {
  const expected = {
    tag: "div",
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
    tag: "div",
    props: { id: "foo" },
    children: ["bar"]
  })

  expect(h(Component, { id: "foo" }, [h(Component, { id: "bar" })])).toEqual({
    tag: "div",
    props: { id: "foo" },
    children: [
      {
        tag: "div",
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
    tag: "div",
    props: {},
    children: ["Hello world"]
  })
})
