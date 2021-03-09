import { h, text } from "hyperapp"

const textTypes = ["string", "number", "bigint"]

const childNode = (child) =>
  textTypes.includes(typeof child) ? text(child) : child

export const jsx = (type, { children, ...props }, key) =>
  typeof type === "function"
    ? type({ ...props, key }, childNode(children))
    : h(type, { ...props, key }, childNode(children))

export const jsxs = (type, { children, ...props }, key) =>
  typeof type === "function"
    ? type({ ...props, key }, childNode(children))
    : h(type, { ...props, key }, children.flatMap(childNode))
