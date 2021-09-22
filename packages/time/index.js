const timeout = (dispatch, props) =>
  setTimeout(() => dispatch(props.action), props.delay)

const interval = (dispatch, props) => {
  const id = setInterval(() => {
    dispatch(props.action, Date.now())
  }, props.delay)
  return () => clearInterval(id)
}

const getTime = (dispatch, props) => dispatch(props.action, Date.now())

/**
 * @example
 * app({
 *   subscriptions: (state) => [
 *   // Dispatch RequestResource every delayInMilliseconds
 *   every(state.delayInMilliseconds, RequestResource),
 *   ],
 * })
 */
export const every = (delay, action) => [interval, { delay, action }]

/**
 * @example
 * const SlowClap = (state, ms = 1200) => [state, delay(ms, Clap)]
 */
export const delay = (delay, action) => [timeout, { delay, action }]

/**
 * @example
 * now(NewTime)
 */
export const now = (action) => [getTime, { action }]
