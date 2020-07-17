var timeout = function (dispatch, props) {
  setTimeout(function () {
    dispatch(props.action)
  }, props.delay)
}

var interval = function (dispatch, props) {
  var id = setInterval(function () {
    dispatch(props.action, Date.now())
  }, props.delay)
  return function () {
    clearInterval(id)
  }
}

var getTime = function (dispatch, props) {
  dispatch(props.action, Date.now())
}

/** 
 * @example
  app({
    subscriptions: (state) => [
      // Dispatch RequestResource every delayInMilliseconds 
      every(state.delayInMilliseconds, RequestResource),
    ],
  })
 */
var every = function (delay, action) {
  return [interval, { delay: delay, action: action }]
}

/** 
 * @example
  const SlowClap = (state, ms = 1200) => [state, delay(ms, Clap)]
 */
var delay = function (delay, action) {
  return [timeout, { delay: delay, action: action }]
}

/** 
 * @example
  now(NewTime)
 */
var now = function (action) {
  return [getTime, { action: action }]
}

export { every, delay, now }
