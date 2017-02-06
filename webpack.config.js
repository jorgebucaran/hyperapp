const webpack = require("webpack")
const Wrapper = require("wrapper-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
	context: `${__dirname}/src/`,
	cache: true,

	entry: {
		hyperapp: "./index.js",
		app: "./app.js",
		h: "./h.js",
		html: "./html.js"
	},

	output: {
		path: "./dist/",
		filename: "[name].min.js",
		library: "export",
		libraryTarget: "this"
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/
			}
		]
	},

	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),

		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),

		new CompressionPlugin({
			asset: "[path].gz",
			algorithm: "zopfli"
		}),

		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			mangle: true,
			output: {comments: false},
			sourceMap: true,
			compress: {
				warnings: false,
				sequences: true,
				dead_code: true,
				conditionals: true,
				booleans: true,
				unused: true,
				if_return: true,
				join_vars: true,
				drop_console: true,
				unsafe: true,
				loops: true,
				negate_iife: true
			}
		}),

		new Wrapper({
			header(fileName) {
				const module = /^([a-z]+)\.*/.exec(fileName)

				return `window["${module[1]}"] = (function() {`
			},
			footer: "return this.export.default})();"
		})
	]
}
