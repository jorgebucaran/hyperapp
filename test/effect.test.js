import { app } from '../src'

test('runs an effect', () => {
  var resolve = null

  var promise = new Promise((a) => {
    resolve = a;
  })

  var myEffect = function (arg) {
    resolve(arg)
  }

  app({
    init: [{}, [myEffect, 'foo']],
    container: { children: [] }
  })

  return expect(promise).resolves.toBe('foo')
});
