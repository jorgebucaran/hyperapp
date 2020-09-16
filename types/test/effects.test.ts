import { Effect, EffectDescriptor } from "hyperapp"

// $ExpectType Effect<string, string, string>
const runEcho = ((dispatch, data) => {
  console.log(data)
  dispatch((state, x) => state + x, data)
}) as Effect<string, string, string>

const echo = (x: string): EffectDescriptor<string, string, string> =>
  [runEcho, x]

// $ExpectType EffectDescriptor<string, string, string>
echo("hi")

// -----------------------------------------------------------------------------

// TODO:
// => Unsubscribe

// -----------------------------------------------------------------------------

// Credit: https://gist.github.com/eteeselink/81314282c95cd692ea1d
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// $ExpectType Effect<string, string, string>
const runEchoEventually = (async (dispatch, data) => {
  await delay(5000)
  console.log(data)
  window.requestAnimationFrame(() => dispatch((state, x) => state + x, data))
}) as Effect<string, string, string>

const sayEchoEventually = (x: string): EffectDescriptor<string, string, string> =>
  [runEchoEventually, x]

// $ExpectType EffectDescriptor<string, string, string>
sayEchoEventually("hi")

// -----------------------------------------------------------------------------

// TODO:
// => Promise<Unsubscribe>
