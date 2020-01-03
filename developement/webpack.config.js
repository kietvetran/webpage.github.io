const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  devServer: {
    port: 3001,
    historyApiFallback: true,
    //contentBase: path.join(__dirname, 'dist'),
    contentBase: path.join(__dirname, 'src'),
    hotOnly: true,
    progress: true,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: true,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: false,
      warnings: true,
      publicPath: false,
      builtAt: false,
      entrypoints: false,
    },
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: '/',
    //filename: '[name].[hash].js',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(svg|eot|jpg|woff|woff2|ttf|png|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name]_[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader',   // translates CSS into CommonJS
          'sass-loader',  // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
};
