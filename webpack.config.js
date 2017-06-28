const webpack = require('webpack');
const path = require('path');

// webpack.config.js
module.exports = {
  entry: {
    '/dist': path.join(__dirname, 'index.js'),
    '/example': path.join(__dirname, 'index.js')
  },
  output: {
    filename: '[name]/wxapp-http.js',
    library: 'wxHttp',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.coffee']
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      test: /\.min\.js$/
    })
  ]
};
