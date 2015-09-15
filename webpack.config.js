var path = require('path')

module.exports = {
  entry: {
    app: ['./ui/app.js']
  },
  output: {
    path: 'public/assets',
    publicPath: 'assets',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: 'public'
  }
}
