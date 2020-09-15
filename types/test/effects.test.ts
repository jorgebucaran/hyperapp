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
