const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const outputDir = path.resolve(__dirname, "./dist")
const appSrc = path.resolve(__dirname, "src")
const hyperappSrc = path.resolve(__dirname, "..", "src")
const createAlias = () => ({ hyperapp: hyperappSrc })

module.exports = {
  entry: {
    index: [`${__dirname}/src/index.js`]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: "index.html",
      template: "./index.html",
      chunks: ["index"],
      inject: "body"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      minimize: false
    })
  ],
  output: {
    path: outputDir,
    filename: "[name].js"
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".css"],
    descriptionFiles: ["package.json"],
    alias: {
      hyperapp: path.resolve(__dirname, "..", "src", "index.js")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devtool: "inline-source-map",
  devServer: {
    host: "0.0.0.0",
    hot: true,
    contentBase: outputDir,
    port: 8008,
    inline: true,
    disableHostCheck: true
  }
}
