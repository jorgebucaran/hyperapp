export const expectHTMLToBe = body =>
	expect(document.body.innerHTML).toBe(body
		.replace(/\r?\n|\r|\t/g, "")
		.replace(/\s+</g, "<")
		.replace(/>\s+/g, ">"))
