import { h, text } from "hyperapp"

const jsx = (tag, { children = [], ...props }) =>
  typeof tag === "function"
    ? tag(props || {}, children)
    : h(
        tag,
        props,
        []
          .concat(children)
          .map((any) =>
            typeof any === "string" || typeof any === "number" ? text(any) : any
          )
      )

export { jsx, jsx as jsxs }
