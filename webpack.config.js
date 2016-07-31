var webpack = require('webpack')
var path = require('path')


module.exports = {
  entry: [path.join(__dirname, './src/index.js')],
  output: {
    path: path.join(__dirname, './lib'),
    filename: 'index.js'
  },
  module:{
    loaders:[
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  resolve:{
    extensions:['','js']
  },
  node: {
    fs: "empty"
  }
}