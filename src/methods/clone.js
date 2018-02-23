export default (target, source) => {
  let obj = {}

  for (let i in target) obj[i] = target[i]
  for (let i in source) obj[i] = source[i]

  return obj
}