import { h } from "hyperapp"

const EMPTY_ARR = []
const EMPTY_OBJ = {}

const tag = (tag) => (
  props,
  children = props.tag != null || Array.isArray(props) ? props : EMPTY_ARR
) => h(tag, props === children ? EMPTY_OBJ : props, children)

export const svg = tag("svg")
export const path = tag("path")
export const circle = tag("circle")
export const polygon = tag("polygon")
