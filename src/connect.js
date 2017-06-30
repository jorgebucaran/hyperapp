import h from './h.js'
const CONNECTED = Symbol()

// TODO: figure out how to have one context per app instance, not a global one
const hConnected = (() => {
  const context = {}
  return function hProvided (tag, data, ...rest) {
    if (tag === Provider) {
      Object.assign(context, data.context)
    }
    if (tag.connected === CONNECTED) {
      data = data || {}
      data.context = context
    }
    return h.call(null, tag, data, ...rest)
  }
})()

export {hConnected as h}
export const Provider = () => null

export function connect (component /*, mapContextToProps TBD by wrapping component */) {
  component.connected = CONNECTED
  // probable mapContextToProps implementation, untested
  // return (props, ...rest) => {
  //   if(mapContextToProps) {
  //     props = Object.assign({},props, mapContextToProps(props.context))
  //   }
  //   return component(props,...rest)
  // }
  return component
}
