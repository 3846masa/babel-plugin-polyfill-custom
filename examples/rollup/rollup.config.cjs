const path = require('node:path');

const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const dataUri = require('@rollup/plugin-data-uri');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

/** @returns {import('rollup').RollupOptions} */
const createConfig = ({ babelConfig, output }) => ({
  input: path.resolve(__dirname, './src/esmodule.mjs'),
  output: {
    ...output,
  },
  plugins: [
    babel({
      ...babelConfig,
      ...require('./babel.config.js'),
      babelHelpers: 'bundled',
    }),
    dataUri(),
    nodeResolve(),
    commonjs(),
  ],
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
      file: path.resolve(__dirname, './dist', 'esmodule.js'),
      format: 'iife',
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
      file: path.resolve(__dirname, './dist', 'esmodule.nomodule.js'),
      format: 'iife',
    },
  }),
];

module.exports = config;
