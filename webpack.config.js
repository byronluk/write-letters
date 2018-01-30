const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, '/src'),

  entry: {
    javascript: './index'
  },

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist'),
  },

  resolve: {
    alias: {
      react: path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      REACT_APP_HANDWRITE_API_KEY: JSON.stringify(process.env.REACT_APP_HANDWRITE_API_KEY),
      REACT_APP_SPELLCHECK_API_KEY: JSON.stringify(process.env.REACT_APP_SPELLCHECK_API_KEY),
    })
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
    ],
  },
};
