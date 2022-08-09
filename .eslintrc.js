module.exports = {
  extends: [require.resolve('@3846masa/configs/eslint')],
  rules: {
    'import/no-unresolved': ['error', { ignore: ['^polyfill:'] }],
  },
};
