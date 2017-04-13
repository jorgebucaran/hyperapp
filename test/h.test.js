import { h } from "../src"

test("empty vnode", () => {
  expect(
    h("div")
  ).toEqual({
    tag: "div",
    data: {},
    children: []
  })
})

test("vnode with a single child", () => {
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

test("concatenate String/Number children", () => {
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

test("vnode with data", () => {
  const data = {
    id: "foo",
    class: "bar",
    style: {
      color: "red"
    }
  }

  expect(h("div", data, "baz")
  ).toEqual({
    tag: "div",
    data,
    children: ["baz"]
  })

})

test("skip null and Boolean children", () => {
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

test("components", () => {
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
