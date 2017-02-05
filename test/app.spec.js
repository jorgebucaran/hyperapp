/* global describe, test */

const {app, html} = require('../src/index.js');

describe('App', () => {

	test('boots with no bugs', () => {
		app({model: {}, view: () => (html`<div>Hi</div>`)});
	});
})