const base = require('./webpack.base');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(base, {
  mode: 'development',
  devServer: {
    hot: true,
    open: true
    // host: '0.0.0.0'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    })
  ]
});
