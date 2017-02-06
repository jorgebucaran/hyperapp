const CompressionPlugin = require("compression-webpack-plugin")
const webpack = require("webpack")

module.exports = {
	entry: {
		hyperapp: ["./index.js"],
		app: "./app.js",
		html: "./html.js"
	},

	output: {
		path: "./dist/",
		filename: "[name].min.js",
		library: "hyperapp",
		libraryTarget: "umd"
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
		})
	]
}
