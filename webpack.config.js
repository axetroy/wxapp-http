const webpack = require('webpack');
const path = require('path');

// webpack.config.js
module.exports = {
  entry: {
    '/dist': path.join(__dirname, 'index.ts'),
    '/example': path.join(__dirname, 'index.ts')
  },
  output: {
    filename: '[name]/wxapp-http.js',
    library: 'wxHttp',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.coffee', '.ts']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
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
