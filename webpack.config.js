const path = require('path');

module.exports = {
  entry: {
    custom: './custom.js',
  },
  // webpack 5 を利用していて、IE 対応する場合は以下のコメントを外す
  // target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  externals: {
    jquery: 'jQuery',
  },
};
