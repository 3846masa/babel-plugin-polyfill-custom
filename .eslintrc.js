module.exports = {
  extends: [require.resolve('@3846masa/configs/eslint')],
  rules: {
    'import/no-unresolved': ['error', { ignore: ['^polyfill:'] }],
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            group: 'external',
            pattern: '@mdn/browser-compat-data',
          },
        ],
      },
    ],
  },
};
