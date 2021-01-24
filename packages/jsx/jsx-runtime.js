import { h, text } from "hyperapp"

const childNode = (child) => typeof child === "string" || typeof child === "number" ? text(child) : child;

export const jsx = (tag, { children, ...props }) =>
  typeof tag === "function"
    ? tag(props || {}, children)
    : h(
        tag,
        props,
        childNode(children)
      )

export const jsxs = (tag, { children, ...props }) =>
  typeof tag === "function"
    ? tag(props || {}, children)
    : h(
        tag,
        props,
        children.map(childNode)
      )

