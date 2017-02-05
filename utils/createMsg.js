var merge = require('./merge')

module.exports = function (options, hooks, callback) {
  var msg = {}
  var model = options.model
  var reducers = options.update || {}
  var effects = options.effects || {}
  var reducersWithEffects = merge(reducers, effects)

  for (var name in reducersWithEffects) {
      (function (name) {
          msg[name] = function (data) {
              hooks.onAction(name, data)

              var effect = effects[name]
              if (effect) {
                  return effect(options.model, msg, data, hooks.onError)
              }

              var update = reducers[name], _model = model
              // render(model = merge(model, update(model, data)), view, node)
              callback(data, update)

              hooks.onUpdate(_model, model, data)
          }
      } (name))
  }

  return msg;
}
