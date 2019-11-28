// Change location FX
const historyFx = (dispatch, { to }) => {
  history.pushState(null, '', to)
}
export const UpdateHistory = ({ to }) => [historyFx, { to }]
