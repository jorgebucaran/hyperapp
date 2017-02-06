const CompressionPlugin = require("compression-webpack-plugin")
const BabiliPlugin = require("babili-webpack-plugin")
const webpack = require("webpack")

module.exports = {
	entry: "./src/index.js",

	output: {
		path: "./dist/",
		filename: "hyperapp.min.js",
		library: "hyperapp",
		libraryTarget: "umd"
	},

	module: {
		loaders: [
			{
				loader: "babel-loader",
				exclude: /node_modules/,
				query: {
					presets: ["es2015", "babili"]
				}
			}
		]
	},

	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: false
		}),

	    new BabiliPlugin(),

		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),

		new CompressionPlugin({
			asset: "[path].gz",
			algorithm: "zopfli"
		})
	]
}