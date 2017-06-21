export default (() => {
  const topics = {}
  const set = (event, fn) => {
    if (!topics.hasOwnProperty(event)) topics[event] = []
    const index = topics[event].push(fn)
    const remove = () => topics[event][index] = null
    return { remove }
  }
  const get = (event, data) => {
    if (!topics.hasOwnProperty(event)) return false
    const result = topics[event].map(fn => fn(data))
    if (result.length === 1) return result[0]
    return result
  }
  return { get, set }
})()
