export const expectHTMLToBe = (body, ...values) =>
  expect(document.body.innerHTML).toBe(
    body.reduce((a, b, i) => a + values[i - 1] + b).replace(/\s{2,}/g, "")
  )
