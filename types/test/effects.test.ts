import { Effect, EffectData, EffectDescriptor } from "hyperapp"

// $ExpectType Effect<string, string, string>
const runSayHi = ((dispatch, data) => {
  console.log(data)
  dispatch((state, x) => state + x, data)
}) as Effect<string, string, string>

const sayHi = (x: EffectData<string>): EffectDescriptor<string, string, string> =>
  [runSayHi, x]

// $ExpectType EffectDescriptor<string, string, string>
sayHi("hi")

// -----------------------------------------------------------------------------

// Credit: https://gist.github.com/eteeselink/81314282c95cd692ea1d
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// $ExpectType Effect<string, string, string>
const runSayHiEventually = (async (dispatch, data) => {
  await delay (5000)
  console.log(data)
  window.requestAnimationFrame(() => dispatch((state, x) => state + x, data))
}) as Effect<string, string, string>

const sayHiEventually = (x: EffectData<string>): EffectDescriptor<string, string, string> =>
  [runSayHiEventually, x]

// $ExpectType EffectDescriptor<string, string, string>
sayHiEventually("hi")
