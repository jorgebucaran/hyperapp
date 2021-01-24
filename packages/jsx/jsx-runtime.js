import { h, text } from "hyperapp"

const textTypes = ["string", "number", "bigint"];

const childNode = (child) => textTypes.includes(typeof child) ? text(child) : child;

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

