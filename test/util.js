export const expectHTMLToBe = body =>
  expect(document.body.innerHTML).toBe(body.replace(/\s{2,}/g, ""))
