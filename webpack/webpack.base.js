const merge = require('webpack-merge');
module.exports = merge({
  output: {
    libraryTarget: 'umd'
  }
});
