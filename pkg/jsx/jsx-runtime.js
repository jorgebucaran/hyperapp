import { h, text } from 'hyperapp'

const jsx = (type, { children = [], ...props }) =>
  typeof type === 'function'
    ? type(props || [], children)
    : h(
        type,
        props || {},
        []
          .concat(children)
          .map((any) =>
            typeof any === 'string' || typeof any === 'number' ? text(any) : any
          )
      )

export { jsx, jsx as jsxs, jsx as jsxDEV }
