import clone from './clone'

const updateAttribute = (element, name, value, isSVG, oldValue) => {
  if (name === "key") {
  } else if (name === "style") {
    for (let i in clone(oldValue, value)) {
      element[name][i] = value == null || value[i] == null ? "" : value[i]
    }
  } else {
    if (typeof value === "function" || (name in element && !isSVG)) {
      element[name] = value == null ? "" : value
    } else if (value != null && value !== false) {
      element.setAttribute(name, value)
    }

    if (value == null || value === false) {
      element.removeAttribute(name)
    }
  }
}

export default updateAttribute;