import { h, text } from "hyperapp"

const textTypes = ["string", "number", "bigint"]

/**
 * Turn text elements into text nodes.
 * Leave other elements intact (ex: functions, dates, objects, etc)
 */
const textify = (children) =>
  textTypes.includes(typeof children) ? text(children) : children

/**
 * Apply textify function to all children (one or many)
 */
const textifyArray = (children) => [].concat(children).flatMap(textify)

/**
 * Add JSX compatibility to h function
 */
const createVNode = (type, { children, ...props }, key) => {
  const childNodes = textifyArray(children)
  return typeof type === "function"
    ? type({ ...props, key }, childNodes)
    : h(type, { ...props, key }, childNodes)
}

/**
 * Support fragments
 */
const Fragment = (_props, children) => textifyArray(children)

export {
	createVNode as jsx,
	createVNode as jsxs,
	createVNode as jsxDEV,
	Fragment
};
