const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCSSPresetEnv = require('postcss-preset-env');
const SvgToMiniDataURI = require('mini-svg-data-uri');

const config = {
  devtool: 'eval',
  entry: './src/library.less',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['*', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                PostCSSPresetEnv(),
              ],
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              generator: (content) => SvgToMiniDataURI(content.toString()),
            },
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'library.css',
    }),
  ],
};

exports.default = config;
