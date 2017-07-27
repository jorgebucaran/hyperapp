# Implementation Notes

- code base walk through
- vnode factory
- patching
- keyed nodes
- render scheduler
- recycling
- hydration


patch
  createElement
    setElementData
  updateElement
    setElementData
  removeElement


update

Create map with old keyed nodes.
Update the element's children.
Remove remaining unkeyed old nodes.
Remove unused keyed old nodes.



