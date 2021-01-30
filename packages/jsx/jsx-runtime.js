import { h, text } from "hyperapp"

const isVNode = (child) => typeof child === "object" && ('node' in child)

const childNode = (child) => {
  if (child) {
    return isVNode(child) ? child : text(child)
  }
}

export const jsx = (tag, { children, ...props }, key) =>
  typeof tag === "function"
    ? tag({ ...props, key }, children)
    : h(
        tag,
        { ...props, key },
        childNode(children)
      )
    

export const jsxs = (tag, { children, ...props }, key) =>
  typeof tag === "function"
    ? tag({ ...props, key }, children)
    : h(
        tag,
        { ...props, key },
        children.map(childNode)
      )

