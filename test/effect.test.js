import { app } from '../src'

test('runs an effect', () => {
  var resolve = null

  var promise = new Promise((a) => {
    resolve = a;
  })

  var myEffect = function (fx) {
    resolve(fx.text)
  }

  app({
    init: [{}, { effect: myEffect, text: 'foo' }],
    container: { children: [] }
  })

  return expect(promise).resolves.toBe('foo')
});
