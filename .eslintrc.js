module.exports = {
	"env": {
		"node": true,
		"browser": true
	},
	"extends": "eslint:recommended",
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": "off",
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		],
		"no-inner-declarations": [
			"warn"
		],
		"no-redeclare": [
			"warn"
		]
	}
};