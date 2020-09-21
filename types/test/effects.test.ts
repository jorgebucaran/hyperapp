// TODO:

import { Dispatch, EffectDescriptor, Payload } from "hyperapp"

const runEcho = (dispatch: Dispatch<string>, data?: Payload<string>): void => {
  if (!data) return
  console.log(data)
  dispatch((state, x) => state + x, data)
}

const echo = (x: string): EffectDescriptor<string, string> =>
  [runEcho, x]

// $ExpectType EffectDescriptor<string, string>
echo("hi")

// -----------------------------------------------------------------------------

// TODO:
// => Unsubscribe

// -----------------------------------------------------------------------------

// Credit: https://gist.github.com/eteeselink/81314282c95cd692ea1d
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const runEchoEventually = async (dispatch: Dispatch<string>, data?: Payload<string>): Promise<void> => {
  if (!data) return
  await delay(5000)
  console.log(data)
  window.requestAnimationFrame(() => dispatch((state, x) => state + x, data))
}

const echoEventually = (x: string): EffectDescriptor<string, string> =>
  [runEchoEventually, x]

// $ExpectType EffectDescriptor<string, string>
echoEventually("hi")

// -----------------------------------------------------------------------------

// TODO:
// => Promise<Unsubscribe>
