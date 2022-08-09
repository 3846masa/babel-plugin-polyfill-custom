/** @type {import('@babel/core').TransformOptions} */
const config = {
  plugins: [
    [
      'polyfill-custom',
      {
        method: 'entry-global',
        polyfills: {
          'polyfill:abort-controller': {
            features: ['api.AbortController'],
            packages: [
              {
                packageName: 'abort-controller/polyfill',
              },
            ],
          },
          'polyfill:fetch': {
            features: ['api.fetch', 'api.fetch.init_signal_parameter'],
            packages: [
              {
                definitions: {
                  ['fetch']: 'fetch',
                },
                packageName: 'whatwg-fetch',
              },
            ],
          },
          'polyfill:promise': {
            features: ['javascript.builtins.Promise'],
            packages: [
              {
                definitions: {
                  ['Promise']: 'default',
                },
                packageName: 'zousan',
              },
            ],
          },
          'polyfill:promise.any': {
            features: ['javascript.builtins.Promise.any'],
            packages: [
              {
                definitions: {
                  ['Promise.any']: 'default',
                },
                packageName: '@ungap/promise-any',
              },
            ],
          },
        },
      },
    ],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
  ],
  sourceType: 'unambiguous',
};

module.exports = config;
