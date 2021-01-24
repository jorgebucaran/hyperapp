import { h, text } from "hyperapp"

const childNode = (child) => typeof child === "string" || typeof child === "number" ? text(child) : child;

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

