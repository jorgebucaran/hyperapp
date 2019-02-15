import { app, h } from '../src';

var merge = function(a, b) {
  var target = {}

  for (var i in a) target[i] = a[i]
  for (var i in b) target[i] = b[i]

  return target
}

test('runs a subscription', () => {
  var resolve = null;
  var promise = new Promise(function (a) {
    resolve = a
  })

  var mySubscription = function(props) {
    return merge(
      props,
      {
        effect: (args, dispatch) => {
          var fire = () => {
            dispatch(args.action, {})
          }

          var interval = setInterval(fire, args.every)

          return function () {
            clearInterval(interval)
          }
        }
      }
    )
  }

  var tickAction = function(_, state) {
    var count = state.count + 1
    return [
      merge(state, { count: count }),
      state.count < 5 ? null : [myEndEffect, 'foo']
    ]
  }

  var myEndEffect = props => resolve(props[1]);

  app({
    init: { count: 0 },
    subscriptions: state => [
      state.count < 5 && mySubscription({
        action: tickAction,
        every: 5
      }),
    ]
  })

  return expect(promise).resolves.toBe('foo')
});

