function tickEffect(props, dispatch) {
  const id = setInterval(function() {
    dispatch(props.action, {
      time: Date.now()
    })
  }, props.interval)
  return function() {
    clearInterval(id)
  }
}

export function tick(props) {
  return [
    tickEffect,
    {
      action: props.action,
      interval: props.interval
    }
  ]
}
