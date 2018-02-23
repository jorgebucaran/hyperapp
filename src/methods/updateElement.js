import updateAttribute from './updateAttribute';
import clone from './clone';

export const updateElement = (lifecycleStack) => {
  return (firstRender, element, oldAttributes, attributes, isSVG) => {
    for (var name in clone(oldAttributes, attributes)) {
      if (
        attributes[name] !==
        (name === "value" || name === "checked"
          ? element[name]
          : oldAttributes[name])
      ) {
        updateAttribute(
          element,
          name,
          attributes[name],
          isSVG,
          oldAttributes[name]
        )
      }
    }

    var cb = firstRender ? attributes.oncreate : attributes.onupdate
    if (cb) {
      lifecycleStack.push(() => {
        cb(element, oldAttributes)
      })
    }
  }
};