const base = require('./webpack.base');
const merge = require('webpack-merge');
module.exports = merge(base, {
  mode: 'production'
});
