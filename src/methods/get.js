export default (path, source) => {
  for (let i = 0; i < path.length; i++) {
    source = source[path[i]]
  }
  return source
}