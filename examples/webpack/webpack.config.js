const path = require('node:path');

const CircularDependencyPlugin = require('circular-dependency-plugin');

/** @returns {import('webpack').Configuration} */
const createConfig = ({ babelConfig, output }) => ({
  devtool: 'source-map',
  entry: {
    esmodule: path.resolve(__dirname, './src/esmodule.mjs'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        mimetype: 'text/javascript',
        scheme: 'data',
        type: 'javascript/auto',
      },
      {
        resolve: { fullySpecified: false },
        test: /\.(m|c)?js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              ...babelConfig,
            },
          },
        ],
      },
    ],
  },
  output: {
    ...output,
  },
  plugins: [new CircularDependencyPlugin()],
  target: ['web', 'es5'],
});

const config = [
  createConfig({
    babelConfig: {
      ...require('./babel.config.js'),
      targets: {
        browsers: 'ie 11, >= 1%',
        esmodules: true,
      },
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, './dist'),
    },
  }),
  createConfig({
    babelConfig: {
      ...require('./babel.config.js'),
      targets: {
        browsers: 'ie 11, >= 1%',
      },
    },
    output: {
      filename: '[name].nomodule.js',
      path: path.resolve(__dirname, './dist'),
    },
  }),
];

module.exports = config;
