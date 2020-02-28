const { resolve } = require('path');
const base = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    })
  ],
  output: {
    path: resolve(__dirname, '..', 'docs')
  }
});
