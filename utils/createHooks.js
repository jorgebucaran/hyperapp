var merge = require('./merge')

module.exports = function (options) {
  return merge({
      onAction: Function.prototype,
      onUpdate: Function.prototype,
      onError: function (err) {
          throw err
      }
  }, options.hooks)
}
