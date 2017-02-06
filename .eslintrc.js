module.exports = {
	"env": {
		"node": true,
		"browser": true
	},
	"parserOptions": {
		"ecmaVersion": 7,
		"sourceType": "module"
	},
	"extends": "eslint:recommended",
	"rules": {
		"linebreak-style": "off",
		"indent": [
			"error",
			"tab"
		],
		"quotes": [
			"error",
			"double"
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
		],
		"semi": [
			"error",
			"never"
		],
		"no-unused-vars": [
			"warn"
		]
	}
};