const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'chrome/icons', to: 'icons' },
        { from: 'chrome/manifest.json', to: 'manifest.json' },
        { from: 'src/misc/bg.js', to: 'bg.js' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  output: {
    chunkLoading: false,
    wasmLoading: false
  },
  target: ['web', 'es5']
};
