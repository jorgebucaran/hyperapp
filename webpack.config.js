const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

module.exports = {

	entry: './src/index.js',

	output: {
		path: './dist/',
		filename: 'hyperapp.min.js',
		library: 'hyperapp',
		libraryTarget: 'umd'
	},

	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),

		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),

		new CompressionPlugin({
			asset: '[path].gz',
			algorithm: 'gzip'
		})
	]
}