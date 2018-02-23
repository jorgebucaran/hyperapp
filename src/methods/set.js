import clone from './clone'

const set = (path, value, source) => {
  let target = {}
  if (path.length) {
    target[path[0]] =
      path.length > 1 ? set(path.slice(1), value, source[path[0]]) : value
    return clone(source, target)
  }
  return value
}


export default set