import renderToString from "../src/toString"

const RenderTest = trees =>
  trees.forEach(tree => expect(renderToString(tree.vnode)).toBe(tree.html))

const createVNode = vnode => Object.assign({ tag: "div", data: {}, children: [] }, vnode)

test("empty element", () => {
   RenderTest([
     {
       vnode: createVNode(),
       html: `<div></div>`
     },
     {
       vnode: createVNode({ tag: "h1" }),
       html: `<h1></h1>`
     }
   ])
})

test("attributes", () => {
  RenderTest([
    {
      vnode: createVNode({ data: { id: "a" } }),
      html: `<div id="a"></div>`
    },
    {
      vnode: createVNode({ data: { class: "a" } }),
      html: `<div class="a"></div>`
    },
    {
      vnode: createVNode({ data: { class: "a", id: "a" }}),
      html: `<div class="a" id="a"></div>`
    }
  ])
})

test("style", () => {
  RenderTest([
    {
      vnode: createVNode({ data: { style: { margin: 0 } } }),
      html: `<div style="margin:0;"></div>`
    },
    {
      vnode: createVNode({ data: { style: { backgroundColor: "papayawhip" } } }),
      html: `<div style="background-color:papayawhip;"></div>`
    }
  ])
})

test("primitive children", () => {
  RenderTest([
    {
      vnode: createVNode({ children: ["foo", "bar"] }),
      html: `<div>foobar</div>`
    }
  ])
})

test("vnode children", () => {
  RenderTest([
    {
      vnode: createVNode({
        children: [
          createVNode({ tag: "h1" })
        ]
      }),
      html: `<div><h1></h1></div>`
    }
  ])
})
