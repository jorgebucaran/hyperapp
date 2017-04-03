import { h } from "../src"

test("create an empty vnode", () => {
  expect(
    h("div")
  ).toEqual({
    tag: "div",
    data: {},
    children: []
  })
})

test("create a vnode with a single child", () => {
  expect(
    h("div", {}, ["foo"])
  ).toEqual({
    tag: "div",
    data: {},
    children: ["foo"]
  })

  expect(
    h("div", {}, "foo")
  ).toEqual({
    tag: "div",
    data: {},
    children: ["foo"]
  })
})

test("concatenate multiple children string/number", () => {
  expect(
    h("div", {}, "foo", "bar", "baz")
  ).toEqual({
    tag: "div",
    data: {},
    children: ["foobarbaz"]
  })

  expect(
    h("div", {}, ["foo", "bar", "baz"])
  ).toEqual({
    tag: "div",
    data: {},
    children: ["foobarbaz"]
  })

  expect(
    h("div", {}, 1, "foo", 2, "baz", 3)
  ).toEqual({
    tag: "div",
    data: {},
    children: ["1foo2baz3"]
  })

  expect(
    h("div", {}, "foo", h("div", {}, "bar"), "baz", "quux")
  ).toEqual({
    tag: "div",
    data: {},
    children: ["foo", {
      tag: "div",
      data: {},
      children: ["bar"]
    }, "bazquux"]
  })
})

test("create a vnode with props data", () => {
  const props = {
    id: "foo",
    class: "bar",
    style: {
      color: "red"
    }
  }

  expect(h("div", props, "baz")
  ).toEqual({
    tag: "div",
    data: props,
    children: ["baz"]
  })

})

test("don't create children from null or boolean values", () => {
  const expected = {
    tag: "div",
    data: {},
    children: []
  }

  expect(
    h("div", {}, true)
  ).toEqual(expected)

  expect(
    h("div", {}, false)
  ).toEqual(expected)

  expect(
    h("div", {}, null)
  ).toEqual(expected)
})

test("create a vnode from a component / tag function", () => {
  const Component = (data, children) => h("div", data, children)

  expect(
    h(Component, { id: "foo" }, "bar")
  ).toEqual({
    tag: "div",
    data: { id: "foo" },
    children: ["bar"]
  })

  expect(
    h(Component, { id: "foo" }, [h(Component, { id: "bar" })])
  ).toEqual({
    tag: "div",
    data: { id: "foo" },
    children: [{
      tag: "div",
      data: { id: "bar" },
      children: []
    }]
  })
})
